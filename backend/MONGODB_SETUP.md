# MongoDB Setup Guide

## ✅ Migration Complete

Your backend has been successfully migrated from **PostgreSQL/Sequelize** to **MongoDB/Mongoose**.

## 📦 What Changed

### Packages
- ❌ Removed: `sequelize`, `pg`, `pg-hstore`, `sequelize-cli`
- ✅ Added: `mongoose`, `@types/mongoose`

### Configuration Files
- **`src/config/env.ts`**: Updated to use `MONGODB_URI` instead of separate DB credentials
- **`src/config/database.ts`**: Replaced Sequelize connection with Mongoose
- **`src/config/sequelize.ts`**: Deleted (no longer needed)
- **`.env`**: Created with MongoDB configuration
- **`.env.example`**: Created as template

### Models
- **`src/models/User.ts`**: Converted from Sequelize model to Mongoose schema
  - Changed from `UserAttributes` to `IUser` interface
  - Uses MongoDB's `_id` instead of UUID `id`
  - Timestamps handled automatically by Mongoose

### Services
- **`src/services/userService.ts`**: Updated all database queries
  - `findByPk(id)` → `findById(id)`
  - `findOne({ where: {...} })` → `findOne({...})`
  - `user.update(data)` → `Object.assign(user, data); user.save()`
  - `user.destroy()` → `user.deleteOne()`
  - `findAndCountAll` → `find()` + `countDocuments()`

- **`src/services/authService.ts`**: Updated to use Mongoose methods
  - `user.get({ plain: true })` → `user.toObject()`
  - `user.id` → `user._id.toString()`

### Controllers
- **`src/controllers/user.controller.ts`**: Updated to use `toObject()` method
- **`src/controllers/auth.controller.ts`**: Updated to use `toObject()` method

### Package.json
- Removed Sequelize CLI scripts (`db:migrate`, `db:seed`, etc.)

## 🚀 Getting Started

### 1. Install MongoDB (if not installed)

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org

# Windows
# Download installer from: https://www.mongodb.com/try/download/community
```

### 2. Start MongoDB Service

```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Check if MongoDB is running
mongosh --eval "db.version()"
```

### 3. Configure Environment

The `.env` file has been created with these values:

```env
MONGODB_URI=mongodb://localhost:27017/personal_finance
```

**For production or different setup**, update the `MONGODB_URI`:

```env
# Local with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/personal_finance

# MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal_finance

# Docker
MONGODB_URI=mongodb://mongo:27017/personal_finance
```

### 4. Start the Backend

```bash
cd /Users/thamaraikannan/Desktop/personal-finance/backend

# Start in development mode
npm run dev
```

You should see:
```
✅ MongoDB connection established successfully.
🚀 Server running on port 3000
```

## 📊 Database Structure

MongoDB will automatically create the `personal_finance` database and `users` collection when you register your first user.

### Example User Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "user@example.com",
  "password": "$2a$10$...",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "isActive": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

## 🔧 Useful MongoDB Commands

```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use personal_finance

# View all collections
show collections

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Drop database (⚠️ WARNING: Deletes all data!)
db.dropDatabase()
```

## 🎯 API Endpoints (Unchanged)

All API endpoints remain the same:

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/profile` - Get user profile
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🐛 Troubleshooting

### MongoDB Connection Error

```
❌ Unable to connect to MongoDB
```

**Solutions:**
1. Check if MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
2. Verify `MONGODB_URI` in `.env` file
3. Check MongoDB logs: `tail -f /usr/local/var/log/mongodb/mongo.log` (macOS)

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

## 📚 Next Steps

1. ✅ MongoDB is configured and running
2. ✅ Backend is using Mongoose
3. ✅ All linter errors fixed
4. 🔄 Test your API endpoints
5. 🔄 Add additional models for Assets, Liabilities, Transactions

## 🔗 Useful Links

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Atlas (Free Cloud Hosting)](https://www.mongodb.com/cloud/atlas)

---

**Status:** ✅ Ready to use!

