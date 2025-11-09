# Frontend-Backend Integration Guide 🔌

This guide explains how to run the Personal Finance application with both frontend and backend connected.

## 🚀 Quick Start

### 1. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Check if running
mongosh --eval "db.version()"
```

### 2. Start Backend
```bash
# Navigate to backend directory
cd /Users/thamaraikannan/Desktop/personal-finance/backend

# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

**Backend will run on:** `http://localhost:3000`

### 3. Start Frontend
```bash
# Open a new terminal
# Navigate to frontend directory
cd /Users/thamaraikannan/Desktop/personal-finance/frontend

# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 4. Access the Application
Open your browser and go to: `http://localhost:5173`

## 📋 What Was Integrated

### ✅ **Backend API Created**
- MongoDB database with Mongoose
- RESTful API endpoints for Assets & Liabilities
- JWT authentication (login/register)
- User management
- Full CRUD operations

### ✅ **Frontend Services Updated**
- `assetService.ts` - Connects to `/api/v1/assets`
- `liabilityService.ts` - Connects to `/api/v1/liabilities`
- `authService.ts` - Handles login/register with JWT
- API client with axios interceptors for auth tokens

### ✅ **Authentication Flow**
1. User registers/logs in
2. Backend returns JWT access & refresh tokens
3. Frontend stores tokens in localStorage
4. All API requests include `Authorization: Bearer <token>` header
5. Unauthorized requests (401) redirect to login

### ✅ **Environment Configuration**
- **Frontend:** `.env` file with `VITE_API_BASE_URL=http://localhost:3000/api/v1`
- **Backend:** `.env` file with MongoDB URI and JWT secrets

## 📁 File Structure

```
personal-finance/
├── backend/
│   ├── src/
│   │   ├── models/          # Asset, Liability, User models
│   │   ├── services/        # Business logic
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   └── config/          # Database, env config
│   ├── .env                 # Backend environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── services/        # API service files
│   │   │   ├── api.ts       # Axios client with interceptors
│   │   │   ├── assetService.ts
│   │   │   ├── liabilityService.ts
│   │   │   └── authService.ts
│   │   ├── store/           # Redux store
│   │   ├── contexts/        # Auth context
│   │   └── pages/           # React pages
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
└── FRONTEND_BACKEND_INTEGRATION.md (this file)
```

## 🔐 Authentication Flow

### Register New User
```typescript
// Frontend calls authService.register()
POST http://localhost:3000/api/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

// Backend responds with:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}

// Frontend stores tokens in localStorage
localStorage.setItem('authToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### Login Flow
```typescript
// Frontend calls authService.login()
POST http://localhost:3000/api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Backend responds with tokens
// Frontend stores them and redirects to dashboard
```

### Authenticated Requests
```typescript
// All subsequent requests include auth header
GET http://localhost:3000/api/v1/assets
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 💰 Asset Management Flow

### Create Asset
```typescript
// User fills form in frontend
// Frontend calls assetService.createAsset()
POST http://localhost:3000/api/v1/assets
{
  "name": "Savings Account",
  "category": "bank",
  "value": 50000,
  "owner": "John Doe"
}

// Backend creates asset in MongoDB
// Returns created asset with _id
// Frontend updates Redux store
```

### Get All Assets
```typescript
// Page loads, fetchAssets() is called
GET http://localhost:3000/api/v1/assets?page=1&limit=50

// Backend queries MongoDB for user's assets
// Frontend displays in DataGrid
```

### Update Asset
```typescript
// User edits asset in dialog
PUT http://localhost:3000/api/v1/assets/:id
{
  "value": 55000
}

// Backend updates in MongoDB
// Frontend updates Redux store
```

### Delete Asset
```typescript
// User clicks delete
DELETE http://localhost:3000/api/v1/assets/:id

// Backend removes from MongoDB
// Frontend removes from Redux store
```

## 💳 Liability Management Flow

Same pattern as assets:
- Create: `POST /api/v1/liabilities`
- Read: `GET /api/v1/liabilities`
- Update: `PUT /api/v1/liabilities/:id`
- Delete: `DELETE /api/v1/liabilities/:id`

## 🔄 Data Transformation

### Backend → Frontend
```typescript
// Backend uses MongoDB _id
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Savings",
  ...
}

// Frontend transforms to id
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Savings",
  ...
}
```

This transformation happens in the service layer:
```typescript
const transformAsset = (asset: any): Asset => {
  return {
    ...asset,
    id: asset._id || asset.id,
  };
};
```

## 🛠️ Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `backend/src/`
2. Server auto-restarts (nodemon)
3. Check `http://localhost:3000/api/v1/...`

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. Browser auto-reloads (Vite HMR)
3. Check `http://localhost:5173`

### Testing API Endpoints

Use the browser DevTools Network tab or:

```bash
# Get all assets (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/assets

# Create asset
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","category":"cash","value":1000,"owner":"Me"}' \
  http://localhost:3000/api/v1/assets
```

## 🐛 Troubleshooting

### CORS Errors
**Problem:** Browser shows CORS error

**Solution:** Backend is configured to allow `http://localhost:5173`. Check `backend/src/config/env.ts`:
```typescript
CORS_ORIGIN=http://localhost:5173
```

### 401 Unauthorized
**Problem:** API returns 401

**Solutions:**
1. Check if logged in (localStorage has 'authToken')
2. Token might be expired - log in again
3. Backend is running and MongoDB is connected

### Network Error
**Problem:** "Network Error" or "Failed to fetch"

**Solutions:**
1. Check backend is running on port 3000
2. Check MongoDB is running
3. Check `.env` files have correct URLs

### Assets/Liabilities Not Loading
**Problem:** Empty list even though you created items

**Solutions:**
1. Open DevTools → Network tab
2. Check if API calls are being made
3. Check API responses for errors
4. Verify you're logged in with correct user

## 📊 Database Inspection

### View Data in MongoDB
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use personal_finance

# View users
db.users.find().pretty()

# View assets
db.assets.find().pretty()

# View liabilities
db.liabilities.find().pretty()

# Count documents
db.assets.countDocuments()
```

## 🔒 Security Notes

- ✅ JWT tokens stored in localStorage
- ✅ Passwords hashed with bcrypt
- ✅ API client adds auth headers automatically
- ✅ 401 responses redirect to login
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Input validation with Zod

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend (`.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/personal_finance
JWT_SECRET=your-32-character-secret-here
JWT_REFRESH_SECRET=your-32-character-refresh-secret
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
# Update VITE_API_BASE_URL to production API URL
```

### Backend
```bash
cd backend
npm run build
npm start
# Deploy to Heroku, Railway, AWS, etc.
# Use MongoDB Atlas for database
# Update MONGODB_URI to Atlas connection string
```

## ✅ Checklist

Before reporting issues, verify:

- [ ] MongoDB is running
- [ ] Backend server is running on port 3000
- [ ] Frontend server is running on port 5173
- [ ] Both `.env` files exist and have correct values
- [ ] You can access `http://localhost:3000/health` (backend health check)
- [ ] Browser console shows no errors
- [ ] Network tab shows API requests are being made
- [ ] You're logged in (localStorage has 'authToken')

## 📚 Additional Resources

- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- [Backend README](./backend/README.md)
- [MongoDB Setup Guide](./backend/MONGODB_SETUP.md)

---

**🎉 Your Full-Stack Personal Finance App is Ready!**

