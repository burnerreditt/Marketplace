#!/usr/bin/env python3
"""
ThriftHub Backend API Test Suite
Comprehensive testing for all backend endpoints
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://design-refresh-29.preview.emergentagent.com/api"
TEST_USER_EMAIL = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
TEST_USER_PASSWORD = "SecurePassword123!"
TEST_USER_NAME = "John Doe"
TEST_USER_PHONE = "+1234567890"

class ThriftHubAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.auth_token = None
        self.test_user_id = None
        self.test_product_id = None
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log_result(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        
        if success:
            self.results["passed"] += 1
        else:
            self.results["failed"] += 1
            self.results["errors"].append(f"{test_name}: {message}")
        print()
    
    def test_api_health(self):
        """Test if API is running"""
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                self.log_result("API Health Check", True, f"API is running: {data.get('message', 'OK')}")
                return True
            else:
                self.log_result("API Health Check", False, f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_result("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_user_registration(self):
        """Test user registration with valid data"""
        try:
            payload = {
                "name": TEST_USER_NAME,
                "email": TEST_USER_EMAIL,
                "phone": TEST_USER_PHONE,
                "password": TEST_USER_PASSWORD
            }
            
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.test_user_id = data["user"]["id"]
                    self.log_result("User Registration", True, f"User registered successfully with ID: {self.test_user_id}")
                    return True
                else:
                    self.log_result("User Registration", False, "Missing access_token or user in response", data)
                    return False
            else:
                self.log_result("User Registration", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User Registration", False, f"Exception: {str(e)}")
            return False
    
    def test_duplicate_registration(self):
        """Test duplicate email registration should fail"""
        try:
            payload = {
                "name": TEST_USER_NAME,
                "email": TEST_USER_EMAIL,  # Same email as before
                "phone": TEST_USER_PHONE,
                "password": TEST_USER_PASSWORD
            }
            
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 400:
                self.log_result("Duplicate Email Registration", True, "Correctly rejected duplicate email")
                return True
            else:
                self.log_result("Duplicate Email Registration", False, f"Should have failed with 400, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Duplicate Email Registration", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_email_registration(self):
        """Test registration with invalid email"""
        try:
            payload = {
                "name": TEST_USER_NAME,
                "email": "invalid-email",  # Invalid email format
                "phone": TEST_USER_PHONE,
                "password": TEST_USER_PASSWORD
            }
            
            response = requests.post(f"{self.base_url}/auth/register", json=payload)
            
            if response.status_code == 422:  # Validation error
                self.log_result("Invalid Email Registration", True, "Correctly rejected invalid email format")
                return True
            else:
                self.log_result("Invalid Email Registration", False, f"Should have failed with 422, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Invalid Email Registration", False, f"Exception: {str(e)}")
            return False
    
    def test_user_login(self):
        """Test user login with correct credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
            
            response = requests.post(f"{self.base_url}/auth/login", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]  # Update token
                    self.log_result("User Login", True, "Login successful")
                    return True
                else:
                    self.log_result("User Login", False, "Missing access_token or user in response", data)
                    return False
            else:
                self.log_result("User Login", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("User Login", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            payload = {
                "email": TEST_USER_EMAIL,
                "password": "WrongPassword123!"
            }
            
            response = requests.post(f"{self.base_url}/auth/login", json=payload)
            
            if response.status_code == 400:
                self.log_result("Invalid Login Credentials", True, "Correctly rejected invalid credentials")
                return True
            else:
                self.log_result("Invalid Login Credentials", False, f"Should have failed with 400, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Invalid Login Credentials", False, f"Exception: {str(e)}")
            return False
    
    def test_protected_route_without_token(self):
        """Test accessing protected route without authentication"""
        try:
            response = requests.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 401:
                self.log_result("Protected Route Without Token", True, "Correctly rejected unauthenticated request")
                return True
            else:
                self.log_result("Protected Route Without Token", False, f"Should have failed with 401, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Protected Route Without Token", False, f"Exception: {str(e)}")
            return False
    
    def test_protected_route_with_token(self):
        """Test accessing protected route with valid token"""
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "email" in data and data["email"] == TEST_USER_EMAIL:
                    self.log_result("Protected Route With Token", True, "Successfully accessed protected route")
                    return True
                else:
                    self.log_result("Protected Route With Token", False, "Invalid user data returned", data)
                    return False
            else:
                self.log_result("Protected Route With Token", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Protected Route With Token", False, f"Exception: {str(e)}")
            return False
    
    def test_create_product(self):
        """Test creating a product"""
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            # Using form data as the endpoint expects Form parameters
            payload = {
                "title": "Vintage Leather Jacket",
                "description": "Beautiful vintage leather jacket in excellent condition. Perfect for winter wear.",
                "price": 89.99,
                "category": "clothing",
                "condition": "excellent",
                "location": "New York, NY",
                "tags": "vintage,leather,jacket,winter",
                "images": []  # Empty for now
            }
            
            response = requests.post(f"{self.base_url}/products", data=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "title" in data:
                    self.test_product_id = data["id"]
                    self.log_result("Create Product", True, f"Product created successfully with ID: {self.test_product_id}")
                    return True
                else:
                    self.log_result("Create Product", False, "Missing id or title in response", data)
                    return False
            else:
                self.log_result("Create Product", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Create Product", False, f"Exception: {str(e)}")
            return False
    
    def test_get_all_products(self):
        """Test retrieving all products"""
        try:
            response = requests.get(f"{self.base_url}/products")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data and "total" in data:
                    products_count = len(data["products"])
                    self.log_result("Get All Products", True, f"Retrieved {products_count} products, total: {data['total']}")
                    return True
                else:
                    self.log_result("Get All Products", False, "Missing products or total in response", data)
                    return False
            else:
                self.log_result("Get All Products", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Get All Products", False, f"Exception: {str(e)}")
            return False
    
    def test_get_single_product(self):
        """Test retrieving a single product by ID"""
        if not self.test_product_id:
            self.log_result("Get Single Product", False, "No test product ID available")
            return False
        
        try:
            response = requests.get(f"{self.base_url}/products/{self.test_product_id}")
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and data["id"] == self.test_product_id:
                    self.log_result("Get Single Product", True, f"Retrieved product: {data.get('title', 'Unknown')}")
                    return True
                else:
                    self.log_result("Get Single Product", False, "Product ID mismatch", data)
                    return False
            else:
                self.log_result("Get Single Product", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Get Single Product", False, f"Exception: {str(e)}")
            return False
    
    def test_product_filtering_by_category(self):
        """Test product filtering by category"""
        try:
            response = requests.get(f"{self.base_url}/products?category=clothing")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data:
                    # Check if all returned products are in clothing category
                    clothing_products = [p for p in data["products"] if p.get("category") == "clothing"]
                    total_products = len(data["products"])
                    
                    if total_products == 0 or len(clothing_products) == total_products:
                        self.log_result("Product Filtering by Category", True, f"Category filter working, found {total_products} clothing items")
                        return True
                    else:
                        self.log_result("Product Filtering by Category", False, f"Filter not working properly: {len(clothing_products)}/{total_products} are clothing")
                        return False
                else:
                    self.log_result("Product Filtering by Category", False, "Missing products in response", data)
                    return False
            else:
                self.log_result("Product Filtering by Category", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Product Filtering by Category", False, f"Exception: {str(e)}")
            return False
    
    def test_product_search(self):
        """Test product search functionality"""
        try:
            response = requests.get(f"{self.base_url}/products?search=leather")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data:
                    self.log_result("Product Search", True, f"Search returned {len(data['products'])} results")
                    return True
                else:
                    self.log_result("Product Search", False, "Missing products in response", data)
                    return False
            else:
                self.log_result("Product Search", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Product Search", False, f"Exception: {str(e)}")
            return False
    
    def test_product_pagination(self):
        """Test product pagination"""
        try:
            response = requests.get(f"{self.base_url}/products?page=1&limit=5")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data and "page" in data and "limit" in data:
                    products_count = len(data["products"])
                    expected_limit = min(5, data.get("total", 0))
                    
                    if data["page"] == 1 and data["limit"] == 5:
                        self.log_result("Product Pagination", True, f"Pagination working: page {data['page']}, limit {data['limit']}, got {products_count} products")
                        return True
                    else:
                        self.log_result("Product Pagination", False, f"Pagination parameters incorrect: page={data['page']}, limit={data['limit']}")
                        return False
                else:
                    self.log_result("Product Pagination", False, "Missing pagination fields in response", data)
                    return False
            else:
                self.log_result("Product Pagination", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Product Pagination", False, f"Exception: {str(e)}")
            return False
    
    def test_add_to_favorites(self):
        """Test adding product to favorites"""
        if not self.test_product_id:
            self.log_result("Add to Favorites", False, "No test product ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.post(f"{self.base_url}/favorites/{self.test_product_id}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Add to Favorites", True, f"Added to favorites: {data['message']}")
                    return True
                else:
                    self.log_result("Add to Favorites", False, "Missing message in response", data)
                    return False
            else:
                self.log_result("Add to Favorites", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Add to Favorites", False, f"Exception: {str(e)}")
            return False
    
    def test_get_favorites(self):
        """Test getting user's favorite products"""
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/favorites", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    favorites_count = len(data)
                    self.log_result("Get Favorites", True, f"Retrieved {favorites_count} favorite products")
                    return True
                else:
                    self.log_result("Get Favorites", False, "Response is not a list", data)
                    return False
            else:
                self.log_result("Get Favorites", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Get Favorites", False, f"Exception: {str(e)}")
            return False
    
    def test_duplicate_favorite(self):
        """Test adding same product to favorites again (should fail)"""
        if not self.test_product_id:
            self.log_result("Duplicate Favorite", False, "No test product ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.post(f"{self.base_url}/favorites/{self.test_product_id}", headers=headers)
            
            if response.status_code == 400:
                self.log_result("Duplicate Favorite", True, "Correctly rejected duplicate favorite")
                return True
            else:
                self.log_result("Duplicate Favorite", False, f"Should have failed with 400, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Duplicate Favorite", False, f"Exception: {str(e)}")
            return False
    
    def test_remove_from_favorites(self):
        """Test removing product from favorites"""
        if not self.test_product_id:
            self.log_result("Remove from Favorites", False, "No test product ID available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.delete(f"{self.base_url}/favorites/{self.test_product_id}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("Remove from Favorites", True, f"Removed from favorites: {data['message']}")
                    return True
                else:
                    self.log_result("Remove from Favorites", False, "Missing message in response", data)
                    return False
            else:
                self.log_result("Remove from Favorites", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_result("Remove from Favorites", False, f"Exception: {str(e)}")
            return False
    
    def test_favorites_without_auth(self):
        """Test accessing favorites without authentication"""
        try:
            response = requests.get(f"{self.base_url}/favorites")
            
            if response.status_code == 401:
                self.log_result("Favorites Without Auth", True, "Correctly rejected unauthenticated request")
                return True
            else:
                self.log_result("Favorites Without Auth", False, f"Should have failed with 401, got {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Favorites Without Auth", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("THRIFTHUB BACKEND API TEST SUITE")
        print("=" * 60)
        print(f"Testing API at: {self.base_url}")
        print(f"Test User Email: {TEST_USER_EMAIL}")
        print("=" * 60)
        print()
        
        # Test sequence
        tests = [
            # Basic connectivity
            self.test_api_health,
            
            # Authentication tests
            self.test_user_registration,
            self.test_duplicate_registration,
            self.test_invalid_email_registration,
            self.test_user_login,
            self.test_invalid_login,
            self.test_protected_route_without_token,
            self.test_protected_route_with_token,
            
            # Product management tests
            self.test_create_product,
            self.test_get_all_products,
            self.test_get_single_product,
            self.test_product_filtering_by_category,
            self.test_product_search,
            self.test_product_pagination,
            
            # Favorites tests
            self.test_add_to_favorites,
            self.test_get_favorites,
            self.test_duplicate_favorite,
            self.test_remove_from_favorites,
            self.test_favorites_without_auth,
        ]
        
        for test in tests:
            try:
                test()
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                self.log_result(test.__name__, False, f"Test execution error: {str(e)}")
        
        # Print summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📊 Total: {self.results['passed'] + self.results['failed']}")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        print("=" * 60)
        
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = ThriftHubAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)