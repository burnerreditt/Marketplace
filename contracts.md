# Desi Marketplace - Backend Integration Contracts

## Overview
This document defines the API contracts, data models, and integration plan for converting the current frontend-only Desi Marketplace into a full-stack application.

## Current Frontend State
✅ **Completed Features (Frontend Only with Mock Data):**
- Homepage with product grid and filtering
- Product detail pages with full specifications
- Create listing form with image upload (up to 5 images)
- User authentication UI (Login/Register)
- Messaging system UI
- User profile pages
- Search and filtering interface
- Responsive design matching Facebook Marketplace

## Backend API Contracts

### 1. Authentication APIs

#### POST /api/auth/register
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}
```
**Response**: User object + JWT token

#### POST /api/auth/login
```json
{
  "email": "string", 
  "password": "string"
}
```
**Response**: User object + JWT token

#### GET /api/auth/me
**Headers**: Authorization: Bearer {token}
**Response**: Current user object

### 2. Product APIs

#### GET /api/products
**Query params**: 
- category (optional)
- location (optional) 
- price_min, price_max (optional)
- search (optional)
- page, limit (pagination)

**Response**: 
```json
{
  "products": [Product],
  "total": number,
  "page": number,
  "limit": number
}
```

#### GET /api/products/{id}
**Response**: Detailed product object

#### POST /api/products
**Headers**: Authorization required
**Body**: 
```json
{
  "title": "string",
  "description": "string", 
  "price": number,
  "category": "string",
  "condition": "string",
  "location": "string",
  "tags": ["string"],
  "images": ["base64_string"] // Max 5 images
}
```

#### PUT /api/products/{id}
**Headers**: Authorization required (owner only)
**Body**: Updated product data

#### DELETE /api/products/{id} 
**Headers**: Authorization required (owner only)

### 3. User APIs

#### GET /api/users/{id}
**Response**: Public user profile

#### PUT /api/users/{id}
**Headers**: Authorization required (own profile only)
**Body**: Updated user data

#### GET /api/users/{id}/products
**Response**: User's active listings

### 4. Message APIs

#### GET /api/messages
**Headers**: Authorization required
**Response**: User's conversation list

#### GET /api/messages/{conversation_id}
**Headers**: Authorization required
**Response**: Messages in conversation

#### POST /api/messages
**Headers**: Authorization required
**Body**:
```json
{
  "recipient_id": "string",
  "product_id": "string", 
  "message": "string"
}
```

### 5. Favorites APIs

#### GET /api/favorites
**Headers**: Authorization required
**Response**: User's favorite products

#### POST /api/favorites/{product_id}
**Headers**: Authorization required

#### DELETE /api/favorites/{product_id}
**Headers**: Authorization required

## Data Models

### User Model
```python
class User:
    id: str
    name: str
    email: str (unique)
    phone: str
    password_hash: str
    avatar: str (URL)
    location: str
    joined_date: datetime
    is_verified: bool = False
    rating: float = 0.0
    total_sales: int = 0
    total_purchases: int = 0
```

### Product Model  
```python
class Product:
    id: str
    title: str
    description: str
    price: float
    images: [str] # URLs, max 5
    category: str
    condition: str
    location: str
    tags: [str]
    seller_id: str (FK to User)
    created_at: datetime
    updated_at: datetime
    views: int = 0
    is_sold: bool = False
```

### Message Model
```python
class Message:
    id: str
    sender_id: str (FK to User)
    recipient_id: str (FK to User) 
    product_id: str (FK to Product)
    content: str
    timestamp: datetime
    is_read: bool = False
```

### Favorite Model
```python
class Favorite:
    id: str
    user_id: str (FK to User)
    product_id: str (FK to Product)
    created_at: datetime
```

## Mock Data Replacement Plan

### Current Mock Data Files:
- `/app/frontend/src/utils/mockData.js`
  - mockProducts (6 sample products)
  - mockCategories 
  - mockUsers
  - mockMessages

### Integration Steps:
1. Replace `mockProducts` with API calls to `GET /api/products`
2. Replace `mockUsers` with `GET /api/auth/me` 
3. Replace `mockMessages` with `GET /api/messages`
4. Update all product interactions to use real APIs
5. Implement real image upload to backend storage
6. Add real authentication flow with JWT tokens

## Frontend Integration Points

### HomePage.jsx
- Replace mockProducts with API call
- Implement real search/filtering
- Add authentication checks

### ProductDetail.jsx  
- Fetch product by ID from API
- Implement real messaging 
- Add real favorite toggle

### CreateListing.jsx
- Implement real image upload
- Submit to backend API
- Add authentication requirement

### LoginPage.jsx
- Connect to real auth APIs
- Store JWT tokens
- Redirect after login

### MessagesPage.jsx
- Replace mock conversations with real API data
- Implement real-time messaging
- Add message persistence

## Security Requirements
1. JWT authentication for protected routes
2. Input validation and sanitization  
3. Image upload security (file type, size limits)
4. Rate limiting on APIs
5. CORS configuration
6. SQL injection prevention

## File Upload Strategy
1. Accept base64 images from frontend (max 5 per product)
2. Convert and store in `/app/backend/uploads/` directory
3. Serve images via static file endpoint
4. Implement image compression and resizing
5. Add file cleanup for deleted products

## Success Criteria
✅ All 6 mock products display from database
✅ User can create account and login
✅ User can create listings with image upload
✅ Real search and filtering works
✅ Messaging system stores and retrieves messages
✅ User profiles show real data
✅ Favorites persist across sessions

## Implementation Priority
1. **Phase 1**: User authentication + basic CRUD
2. **Phase 2**: Product management + image upload  
3. **Phase 3**: Search/filtering + favorites
4. **Phase 4**: Messaging system
5. **Phase 5**: Testing + bug fixes