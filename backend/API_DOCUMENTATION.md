# Personal Finance API Documentation

## 📚 Base URL
```
http://localhost:3000/api/v1
```

## 🔐 Authentication
All endpoints except `/auth/register` and `/auth/login` require authentication via JWT Bearer token.

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 3. Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true
    }
  }
}
```

---

## 💰 Asset Endpoints

### 1. Create Asset
**POST** `/assets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Savings Account",
  "category": "bank",
  "value": 50000,
  "purchaseDate": "2024-01-01",
  "location": "HDFC Bank",
  "description": "Primary savings account",
  "owner": "John Doe",
  "documents": ["doc1.pdf", "doc2.pdf"],
  "documentUrl": "https://example.com/document.pdf"
}
```

**Categories:** `cash`, `bank`, `investment`, `property`, `vehicle`, `jewelry`, `other`, `custom`

**Custom Category Example:**
```json
{
  "name": "Vintage Watch Collection",
  "category": "custom",
  "customCategoryName": "Collectibles",
  "value": 250000,
  "owner": "John Doe",
  "customFields": [
    {
      "id": "field1",
      "name": "Brand",
      "type": "text",
      "value": "Rolex",
      "required": true
    },
    {
      "id": "field2",
      "name": "Model Year",
      "type": "number",
      "value": 1965,
      "required": true
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "asset": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "name": "Savings Account",
      "category": "bank",
      "value": 50000,
      "owner": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Get All Assets
**GET** `/assets?page=1&limit=50&category=bank`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 50)
- `category` (optional) - Filter by category

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Assets retrieved successfully",
  "data": {
    "assets": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439010",
        "name": "Savings Account",
        "category": "bank",
        "value": 50000,
        "owner": "John Doe",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 10,
    "pages": 1
  }
}
```

### 3. Get Asset by ID
**GET** `/assets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Asset retrieved successfully",
  "data": {
    "asset": { ... }
  }
}
```

### 4. Update Asset
**PUT** `/assets/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Savings Account",
  "value": 55000
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Asset updated successfully",
  "data": {
    "asset": { ... }
  }
}
```

### 5. Delete Asset
**DELETE** `/assets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

### 6. Get Asset Summary
**GET** `/assets/summary`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Asset summary retrieved successfully",
  "data": {
    "totalValue": 500000,
    "byCategory": [
      {
        "category": "bank",
        "total": 150000,
        "count": 3
      },
      {
        "category": "property",
        "total": 300000,
        "count": 1
      },
      {
        "category": "investment",
        "total": 50000,
        "count": 2
      }
    ]
  }
}
```

---

## 💳 Liability Endpoints

### 1. Create Liability
**POST** `/liabilities`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Home Loan",
  "category": "mortgage",
  "balance": 2000000,
  "interestRate": 7.5,
  "dueDate": "2024-01-15",
  "institution": "HDFC Bank",
  "owner": "John Doe",
  "notes": "20 year loan, EMI: ₹15,000"
}
```

**Categories:** `credit`, `loan`, `mortgage`, `tax`, `other`, `custom`

**Custom Category Example:**
```json
{
  "name": "Business Loan",
  "category": "custom",
  "customCategoryName": "Business Finance",
  "balance": 500000,
  "owner": "John Doe",
  "customFields": [
    {
      "id": "field1",
      "name": "Loan Purpose",
      "type": "text",
      "value": "Equipment Purchase",
      "required": true
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Liability created successfully",
  "data": {
    "liability": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "name": "Home Loan",
      "category": "mortgage",
      "balance": 2000000,
      "interestRate": 7.5,
      "owner": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 2. Get All Liabilities
**GET** `/liabilities?page=1&limit=50&category=loan`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 50)
- `category` (optional) - Filter by category

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Liabilities retrieved successfully",
  "data": {
    "liabilities": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439010",
        "name": "Home Loan",
        "category": "mortgage",
        "balance": 2000000,
        "owner": "John Doe",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 5,
    "pages": 1
  }
}
```

### 3. Get Liability by ID
**GET** `/liabilities/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Liability retrieved successfully",
  "data": {
    "liability": { ... }
  }
}
```

### 4. Update Liability
**PUT** `/liabilities/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "balance": 1950000,
  "notes": "Paid EMI for January"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Liability updated successfully",
  "data": {
    "liability": { ... }
  }
}
```

### 5. Delete Liability
**DELETE** `/liabilities/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Liability deleted successfully"
}
```

### 6. Get Liability Summary
**GET** `/liabilities/summary`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Liability summary retrieved successfully",
  "data": {
    "totalBalance": 2500000,
    "byCategory": [
      {
        "category": "mortgage",
        "total": 2000000,
        "count": 1
      },
      {
        "category": "loan",
        "total": 400000,
        "count": 2
      },
      {
        "category": "credit",
        "total": 100000,
        "count": 3
      }
    ]
  }
}
```

---

## 🧩 Custom Category Templates

Custom categories allow users to create reusable templates with custom fields for both assets and liabilities.

All endpoints require authentication (`Authorization: Bearer <token>`).

### 1. List Custom Categories
**GET** `/custom-categories?type=asset`

**Query Parameters (optional):**
- `type`: `asset` or `liability` (if omitted, returns all categories)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Custom categories retrieved successfully",
  "data": {
    "templates": [
      {
        "id": "672b6dd6f4b8c8de29e3ff91",
        "name": "Vehicle",
        "categoryType": "asset",
        "description": "Track cars, bikes, and other vehicles",
        "icon": "ri-car-line",
        "fields": [
          {
            "id": "field-make",
            "name": "Make & Model",
            "type": "text",
            "required": true,
            "placeholder": "e.g., Tesla Model 3"
          },
          {
            "id": "field-purchase-price",
            "name": "Purchase Price",
            "type": "currency",
            "required": true
          }
        ],
        "createdAt": "2024-11-09T14:21:34.000Z",
        "updatedAt": "2024-11-09T14:21:34.000Z"
      }
    ]
  },
  "timestamp": "2024-11-09T14:22:00.000Z"
}
```

### 2. Create Custom Category
**POST** `/custom-categories`

**Request Body:**
```json
{
  "name": "Consulting Clients",
  "categoryType": "asset",
  "description": "Track outstanding invoices for consulting work",
  "fields": [
    {
      "id": "field-client",
      "name": "Client Name",
      "type": "text",
      "required": true,
      "placeholder": "e.g., Acme Corp"
    },
    {
      "id": "field-invoice-amount",
      "name": "Invoice Amount",
      "type": "currency",
      "required": true
    },
    {
      "id": "field-due-date",
      "name": "Due Date",
      "type": "date",
      "required": false
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Custom category created successfully",
  "data": {
    "template": {
      "id": "672b6f99f4b8c8de29e3ff92",
      "name": "Consulting Clients",
      "categoryType": "asset",
      "description": "Track outstanding invoices for consulting work",
      "fields": [
        {
          "id": "field-client",
          "name": "Client Name",
          "type": "text",
          "required": true,
          "placeholder": "e.g., Acme Corp"
        },
        {
          "id": "field-invoice-amount",
          "name": "Invoice Amount",
          "type": "currency",
          "required": true
        },
        {
          "id": "field-due-date",
          "name": "Due Date",
          "type": "date",
          "required": false
        }
      ],
      "createdAt": "2024-11-09T14:25:01.000Z",
      "updatedAt": "2024-11-09T14:25:01.000Z"
    }
  },
  "timestamp": "2024-11-09T14:25:01.000Z"
}
```

### 3. Update Custom Category
**PUT** `/custom-categories/:id`

**Request Body (any updatable field):**
```json
{
  "name": "Consulting Accounts Receivable",
  "description": "Updated description for consulting invoices",
  "fields": [
    {
      "id": "field-client",
      "name": "Client Name",
      "type": "text",
      "required": true
    },
    {
      "id": "field-invoice-amount",
      "name": "Invoice Amount",
      "type": "currency",
      "required": true
    },
    {
      "id": "field-status",
      "name": "Status",
      "type": "text",
      "required": false,
      "placeholder": "e.g., Sent, Paid, Overdue"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Custom category updated successfully",
  "data": {
    "template": {
      "id": "672b6f99f4b8c8de29e3ff92",
      "name": "Consulting Accounts Receivable",
      "categoryType": "asset",
      "description": "Updated description for consulting invoices",
      "fields": [
        {
          "id": "field-client",
          "name": "Client Name",
          "type": "text",
          "required": true
        },
        {
          "id": "field-invoice-amount",
          "name": "Invoice Amount",
          "type": "currency",
          "required": true
        },
        {
          "id": "field-status",
          "name": "Status",
          "type": "text",
          "required": false,
          "placeholder": "e.g., Sent, Paid, Overdue"
        }
      ],
      "createdAt": "2024-11-09T14:25:01.000Z",
      "updatedAt": "2024-11-09T14:28:44.000Z"
    }
  },
  "timestamp": "2024-11-09T14:28:44.000Z"
}
```

### 4. Delete Custom Category
**DELETE** `/custom-categories/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Custom category deleted successfully",
  "timestamp": "2024-11-09T14:30:12.000Z"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "value",
      "message": "Value must be positive"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Asset not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔄 Testing with cURL

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Asset
```bash
curl -X POST http://localhost:3000/api/v1/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Savings Account",
    "category": "bank",
    "value": 50000,
    "owner": "Test User"
  }'
```

### Get All Assets
```bash
curl -X GET "http://localhost:3000/api/v1/assets?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Liability
```bash
curl -X POST http://localhost:3000/api/v1/liabilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Credit Card",
    "category": "credit",
    "balance": 25000,
    "owner": "Test User"
  }'
```

---

## 📊 Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per window

---

## 🚀 Quick Start

1. **Start MongoDB**
```bash
brew services start mongodb-community
```

2. **Start Backend**
```bash
cd backend
npm run dev
```

3. **Test API**
```bash
# Use Postman, Insomnia, or cURL to test endpoints
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- All monetary values are in the base currency (no decimal for paise/cents)
- Custom fields support multiple data types: text, number, currency, date, url, email, phone, textarea, percentage
- MongoDB automatically creates `_id` for each document
- Timestamps (`createdAt`, `updatedAt`) are automatically managed by Mongoose

---

**Status:** ✅ Ready to use!

