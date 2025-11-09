# Authentication Setup Guide 🔐

## ✅ What Was Fixed

The "No token provided" error has been resolved by adding authentication guards to all protected routes.

### Changes Made:

1. **Created ProtectedRoute Component** ✅
   - Checks if user is authenticated before rendering pages
   - Shows loading spinner while checking auth
   - Redirects to `/login` if not authenticated

2. **Updated LoginPage** ✅
   - Now uses real authentication API
   - Shows error messages if login fails
   - Redirects to dashboard after successful login
   - Stores JWT tokens in localStorage

3. **Updated Routes** ✅
   - All app routes now wrapped in `ProtectedRoute`
   - Login and Register pages are public (no auth needed)
   - Dashboard, Assets, Liabilities all require authentication

## 🚀 How to Use

### Step 1: Start the Backend
```bash
cd /Users/thamaraikannan/Desktop/personal-finance/backend
npm run dev
```

### Step 2: Start the Frontend
```bash
cd /Users/thamaraikannan/Desktop/personal-finance/frontend
npm run dev
```

### Step 3: Register a User

1. Open http://localhost:5173
2. You'll be redirected to http://localhost:5173/login
3. Click "Create an account" 
4. Fill in registration form:
   - Email: `test@example.com`
   - Password: `password123`
   - First Name: `Test`
   - Last Name: `User`
5. Click "Create Account"
6. You'll be logged in and redirected to the dashboard

### Step 4: Use the App

After login, you can:
- View dashboard
- Add assets
- Add liabilities
- Create custom categories
- View analytics

## 🔄 Authentication Flow

```
User opens app (http://localhost:5173)
    ↓
ProtectedRoute checks authentication
    ↓
Not authenticated → Redirect to /login
    ↓
User enters credentials
    ↓
Frontend calls: POST /api/v1/auth/login
    ↓
Backend validates and returns JWT tokens
    ↓
Frontend stores tokens in localStorage
    ↓
Frontend redirects to dashboard (/)
    ↓
ProtectedRoute checks authentication → Success!
    ↓
Dashboard loads and fetches data with auth token
    ↓
All API requests include: Authorization: Bearer <token>
```

## 🧪 Test with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Copy the accessToken from response
```

### Get Assets (with token)
```bash
curl -X GET http://localhost:3000/api/v1/assets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 🔐 How Auth Works

### 1. Registration/Login
- User submits credentials
- Backend validates and generates JWT tokens
- Frontend stores in localStorage:
  - `authToken` - for API requests
  - `refreshToken` - to get new access tokens
  - `user` - user profile data

### 2. API Requests
Every API request automatically includes auth header:
```typescript
Authorization: Bearer <authToken>
```

This is done by the axios interceptor in `services/api.ts`

### 3. Protected Routes
`ProtectedRoute` component checks:
- Is there an `authToken` in localStorage?
- If yes → render the page
- If no → redirect to `/login`

### 4. Token Expiry
If backend returns 401 Unauthorized:
- Axios interceptor catches it
- Clears localStorage
- Redirects to `/login`

## 📝 LocalStorage Keys

After successful login, check browser DevTools → Application → Local Storage:
- `authToken` - JWT access token
- `refreshToken` - JWT refresh token  
- `user` - User profile JSON

## 🐛 Troubleshooting

### "No token provided" Error
**Solution:** User needs to login first at http://localhost:5173/login

### "Invalid credentials" Error
**Solutions:**
1. Check backend is running on port 3000
2. Check MongoDB is running
3. Check email/password are correct
4. Register a new user if needed

### Infinite redirect to login
**Solutions:**
1. Clear browser localStorage
2. Check if backend is returning valid JWT tokens
3. Check console for error messages

### Can't register new user
**Solutions:**
1. Check MongoDB is running
2. Check backend logs for errors
3. Email might already be registered - try different email

## ✅ Verification Checklist

Before using the app:

- [ ] MongoDB is running
- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Open http://localhost:5173
- [ ] Should redirect to http://localhost:5173/login
- [ ] Register/Login works
- [ ] After login, redirected to dashboard
- [ ] Dashboard loads without "No token provided" errors
- [ ] Can create assets and liabilities
- [ ] Logout works (clear localStorage)

## 🎯 Quick Commands

```bash
# Check MongoDB
mongosh --eval "db.version()"

# Start MongoDB
brew services start mongodb-community

# Start backend
cd backend && npm run dev

# Start frontend  
cd frontend && npm run dev

# Clear localStorage (in browser console)
localStorage.clear()
```

## 📊 Default Credentials

For testing, you can use:
- **Email:** `test@example.com`
- **Password:** `password123`

(You need to register this user first)

---

## 🎉 All Set!

Your authentication is now working correctly. No more "No token provided" errors!

The flow is:
1. User visits app → Redirected to login
2. User logs in → Token stored
3. User accesses protected pages → Token sent with requests
4. Backend validates token → Returns data
5. Frontend displays data ✨

---

**Created:** $(date)
**Status:** ✅ WORKING

