from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
import base64
import shutil


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT and Password Configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create uploads directory if it doesn't exist
uploads_dir = ROOT_DIR / "uploads"
uploads_dir.mkdir(exist_ok=True)

# Serve static files
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Pydantic Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    avatar: Optional[str] = None
    location: Optional[str] = None
    joined_date: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    rating: float = 0.0
    total_sales: int = 0
    total_purchases: int = 0

class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str
    condition: str
    location: str
    tags: List[str] = []

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: float
    images: List[str] = []
    category: str
    condition: str
    location: str
    tags: List[str] = []
    seller_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    views: int = 0
    is_sold: bool = False

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    recipient_id: str
    product_id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    is_read: bool = False

class Favorite(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Utility Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise credentials_exception
    return user

def save_uploaded_image(image_data: str) -> str:
    """Save base64 image data to uploads directory"""
    try:
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.jpg"
        filepath = uploads_dir / filename
        
        # Decode and save
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(image_data))
        
        return f"/uploads/{filename}"
    except Exception as e:
        logging.error(f"Error saving image: {e}")
        raise HTTPException(status_code=400, detail="Invalid image data")

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone
    )
    
    user_dict = user.dict()
    user_dict["password_hash"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.dict()
    }

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    # Remove password hash from response
    user_response = {k: v for k, v in user.items() if k != "password_hash"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.get("/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != "password_hash"}

# Product Routes
@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    location: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    # Build query
    query = {"is_sold": False}
    
    if category and category != "all":
        query["category"] = category
    
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    if price_min is not None or price_max is not None:
        price_query = {}
        if price_min is not None:
            price_query["$gte"] = price_min
        if price_max is not None:
            price_query["$lte"] = price_max
        query["price"] = price_query
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    # Get total count
    total = await db.products.count_documents(query)
    
    # Get products with pagination
    skip = (page - 1) * limit
    cursor = db.products.find(query).skip(skip).limit(limit).sort("created_at", -1)
    products = await cursor.to_list(length=limit)
    
    # Get seller info for each product
    for product in products:
        seller = await db.users.find_one({"id": product["seller_id"]}, {"_id": 0})
        if seller:
            product["seller"] = {
                "id": seller["id"],
                "name": seller["name"],
                "avatar": seller.get("avatar"),
                "is_verified": seller.get("is_verified", False),
                "rating": seller.get("rating", 0.0),
                "total_sales": seller.get("total_sales", 0)
            }
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "limit": limit
    }

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Increment views
    await db.products.update_one(
        {"id": product_id},
        {"$inc": {"views": 1}}
    )
    
    # Get seller info
    seller = await db.users.find_one({"id": product["seller_id"]}, {"_id": 0})
    if seller:
        product["seller"] = {
            "id": seller["id"],
            "name": seller["name"],
            "avatar": seller.get("avatar"),
            "is_verified": seller.get("is_verified", False),
            "rating": seller.get("rating", 0.0),
            "total_sales": seller.get("total_sales", 0),
            "member_since": seller["joined_date"].strftime("%B %Y")
        }
    
    return product

@api_router.post("/products")
async def create_product(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    condition: str = Form(...),
    location: str = Form(...),
    tags: str = Form(""),
    images: List[str] = Form([]),
    current_user: dict = Depends(get_current_user)
):
    # Process tags
    tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else []
    
    # Process images (assuming they're base64 encoded)
    image_urls = []
    for image_data in images[:5]:  # Limit to 5 images
        if image_data:
            image_url = save_uploaded_image(image_data)
            image_urls.append(image_url)
    
    # Create product
    product = Product(
        title=title,
        description=description,
        price=price,
        category=category,
        condition=condition,
        location=location,
        tags=tag_list,
        images=image_urls,
        seller_id=current_user["id"]
    )
    
    await db.products.insert_one(product.dict())
    return product

# Favorites Routes
@api_router.get("/favorites")
async def get_user_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": current_user["id"]}).to_list(100)
    
    # Get product details for each favorite
    favorite_products = []
    for fav in favorites:
        product = await db.products.find_one({"id": fav["product_id"]}, {"_id": 0})
        if product:
            favorite_products.append(product)
    
    return favorite_products

@api_router.post("/favorites/{product_id}")
async def add_favorite(product_id: str, current_user: dict = Depends(get_current_user)):
    # Check if already favorited
    existing = await db.favorites.find_one({
        "user_id": current_user["id"],
        "product_id": product_id
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    
    favorite = Favorite(user_id=current_user["id"], product_id=product_id)
    await db.favorites.insert_one(favorite.dict())
    return {"message": "Added to favorites"}

@api_router.delete("/favorites/{product_id}")
async def remove_favorite(product_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.favorites.delete_one({
        "user_id": current_user["id"],
        "product_id": product_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Removed from favorites"}

# Message Routes
@api_router.get("/messages")
async def get_user_conversations(current_user: dict = Depends(get_current_user)):
    """Get all conversations for the current user"""
    user_id = current_user["id"]
    
    # Get all messages where user is sender or recipient
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user_id},
            {"recipient_id": user_id}
        ]
    }).sort("timestamp", -1).to_list(1000)
    
    # Group messages by conversation (other user + product)
    conversations = {}
    for message in messages:
        other_user_id = message["recipient_id"] if message["sender_id"] == user_id else message["sender_id"]
        conversation_key = f"{other_user_id}_{message['product_id']}"
        
        if conversation_key not in conversations:
            # Get other user info
            other_user = await db.users.find_one({"id": other_user_id}, {"_id": 0})
            # Get product info
            product = await db.products.find_one({"id": message["product_id"]}, {"_id": 0})
            
            conversations[conversation_key] = {
                "id": conversation_key,
                "other_user": {
                    "id": other_user["id"],
                    "name": other_user["name"],
                    "avatar": other_user.get("avatar")
                } if other_user else None,
                "product": {
                    "id": product["id"],
                    "title": product["title"],
                    "images": product["images"]
                } if product else None,
                "last_message": message,
                "unread_count": 0
            }
        else:
            # Update last message if this one is more recent
            if message["timestamp"] > conversations[conversation_key]["last_message"]["timestamp"]:
                conversations[conversation_key]["last_message"] = message
        
        # Count unread messages
        if message["recipient_id"] == user_id and not message["is_read"]:
            conversations[conversation_key]["unread_count"] += 1
    
    return list(conversations.values())

@api_router.get("/messages/{conversation_id}")
async def get_conversation_messages(conversation_id: str, current_user: dict = Depends(get_current_user)):
    """Get all messages in a conversation"""
    user_id = current_user["id"]
    
    # Parse conversation_id to get other_user_id and product_id
    try:
        other_user_id, product_id = conversation_id.split("_", 1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")
    
    # Get messages between these users for this product
    messages = await db.messages.find({
        "product_id": product_id,
        "$or": [
            {"sender_id": user_id, "recipient_id": other_user_id},
            {"sender_id": other_user_id, "recipient_id": user_id}
        ]
    }).sort("timestamp", 1).to_list(1000)
    
    # Mark messages as read for the current user
    await db.messages.update_many(
        {
            "product_id": product_id,
            "sender_id": other_user_id,
            "recipient_id": user_id,
            "is_read": False
        },
        {"$set": {"is_read": True}}
    )
    
    return messages

class MessageCreate(BaseModel):
    recipient_id: str
    product_id: str
    content: str

@api_router.post("/messages")
async def send_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
    """Send a new message"""
    # Verify recipient exists
    recipient = await db.users.find_one({"id": message_data.recipient_id}, {"_id": 0})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Verify product exists
    product = await db.products.find_one({"id": message_data.product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create message
    message = Message(
        sender_id=current_user["id"],
        recipient_id=message_data.recipient_id,
        product_id=message_data.product_id,
        content=message_data.content
    )
    
    await db.messages.insert_one(message.dict())
    return message

# User Routes
@api_router.get("/users/{user_id}")
async def get_user_profile(user_id: str):
    """Get public user profile"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove sensitive information
    public_profile = {
        "id": user["id"],
        "name": user["name"],
        "avatar": user.get("avatar"),
        "location": user.get("location"),
        "joined_date": user["joined_date"],
        "is_verified": user.get("is_verified", False),
        "rating": user.get("rating", 0.0),
        "total_sales": user.get("total_sales", 0),
        "member_since": user["joined_date"].strftime("%B %Y")
    }
    
    return public_profile

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None

@api_router.put("/users/{user_id}")
async def update_user_profile(user_id: str, update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update user profile (own profile only)"""
    if current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Can only update own profile")
    
    # Build update data
    update_fields = {}
    if update_data.name is not None:
        update_fields["name"] = update_data.name
    if update_data.phone is not None:
        update_fields["phone"] = update_data.phone
    if update_data.location is not None:
        update_fields["location"] = update_data.location
    if update_data.avatar is not None:
        update_fields["avatar"] = update_data.avatar
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    # Update user
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_fields}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return updated user
    updated_user = await db.users.find_one({"id": user_id})
    return {k: v for k, v in updated_user.items() if k != "password_hash"}

@api_router.get("/users/{user_id}/products")
async def get_user_products(user_id: str, page: int = 1, limit: int = 20):
    """Get user's active listings"""
    # Verify user exists
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's products
    query = {"seller_id": user_id, "is_sold": False}
    total = await db.products.count_documents(query)
    
    skip = (page - 1) * limit
    cursor = db.products.find(query).skip(skip).limit(limit).sort("created_at", -1)
    products = await cursor.to_list(length=limit)
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "limit": limit
    }

# Product Management Routes
class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None
    is_sold: Optional[bool] = None

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, update_data: ProductUpdate, current_user: dict = Depends(get_current_user)):
    """Update product (owner only)"""
    # Verify product exists and user is owner
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Can only update own products")
    
    # Build update data
    update_fields = {}
    if update_data.title is not None:
        update_fields["title"] = update_data.title
    if update_data.description is not None:
        update_fields["description"] = update_data.description
    if update_data.price is not None:
        update_fields["price"] = update_data.price
    if update_data.category is not None:
        update_fields["category"] = update_data.category
    if update_data.condition is not None:
        update_fields["condition"] = update_data.condition
    if update_data.location is not None:
        update_fields["location"] = update_data.location
    if update_data.tags is not None:
        update_fields["tags"] = update_data.tags
    if update_data.is_sold is not None:
        update_fields["is_sold"] = update_data.is_sold
    
    if update_fields:
        update_fields["updated_at"] = datetime.utcnow()
        
        result = await db.products.update_one(
            {"id": product_id},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
    
    # Return updated product
    updated_product = await db.products.find_one({"id": product_id})
    return updated_product

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """Delete product (owner only)"""
    # Verify product exists and user is owner
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product["seller_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Can only delete own products")
    
    # Delete product
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Clean up related data
    await db.favorites.delete_many({"product_id": product_id})
    await db.messages.delete_many({"product_id": product_id})
    
    return {"message": "Product deleted successfully"}

# Basic route for testing
@api_router.get("/")
async def root():
    return {"message": "ThriftHub API is running!"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
