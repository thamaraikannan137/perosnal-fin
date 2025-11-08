# Personal Finance API 💰

A robust and scalable Node.js backend API for managing personal finances with TypeScript, Express, and MongoDB.

## ✨ Features

- 👤 **User Authentication** - JWT-based auth with access & refresh tokens
- 💰 **Asset Management** - Track all your assets (cash, bank, investments, property, vehicles, etc.)
- 💳 **Liability Management** - Manage all your liabilities (loans, credit cards, mortgages, etc.)
- 🎨 **Custom Categories** - Create custom asset/liability categories with custom fields
- 📊 **Summary & Analytics** - Get total values and category-wise breakdowns
- 🔒 **Secure** - Password hashing, JWT tokens, rate limiting, helmet security
- 📝 **Type-Safe** - Full TypeScript support with Zod validation
- 🗄️ **MongoDB** - NoSQL database with Mongoose ODM
- ✅ **Role-Based Access Control** - Admin and user roles
- 📋 **Request Logging** - Winston logger with different log levels
- 🚀 **Production Ready** - Error handling, CORS, API versioning

## 📋 Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 3. Configure Environment
The `.env` file has been created with default values. Update if needed:
```env
MONGODB_URI=mongodb://localhost:27017/personal_finance
JWT_SECRET=your-32-character-secret-here
JWT_REFRESH_SECRET=your-32-character-refresh-secret-here
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000` 🎉

## 📚 API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Reference

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile (protected)

#### Assets
- `POST /api/v1/assets` - Create asset
- `GET /api/v1/assets` - Get all assets (with pagination & filters)
- `GET /api/v1/assets/:id` - Get asset by ID
- `PUT /api/v1/assets/:id` - Update asset
- `DELETE /api/v1/assets/:id` - Delete asset
- `GET /api/v1/assets/summary` - Get asset summary & analytics

#### Liabilities
- `POST /api/v1/liabilities` - Create liability
- `GET /api/v1/liabilities` - Get all liabilities (with pagination & filters)
- `GET /api/v1/liabilities/:id` - Get liability by ID
- `PUT /api/v1/liabilities/:id` - Update liability
- `DELETE /api/v1/liabilities/:id` - Delete liability
- `GET /api/v1/liabilities/summary` - Get liability summary & analytics

#### Users (Admin)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 📁 Project Structure

```
src/
├── config/          # Configuration files (env, database, logger)
├── controllers/     # Request handlers (auth, user, asset, liability)
├── middlewares/     # Express middlewares (auth, error, validation, rate limit)
├── models/          # Mongoose models (User, Asset, Liability)
├── routes/          # API routes with versioning
├── services/        # Business logic layer
├── utils/           # Utility functions (jwt, bcrypt, errors, response)
├── validators/      # Zod validation schemas
└── index.ts         # Application entry point
```

## 🔐 Authentication

All protected endpoints require a JWT Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/assets
```

## 📊 Asset Categories

Built-in categories:
- `cash` - Cash in hand
- `bank` - Bank accounts, savings
- `investment` - Stocks, mutual funds, bonds
- `property` - Real estate, land
- `vehicle` - Cars, bikes, etc.
- `jewelry` - Gold, silver, precious items
- `other` - Miscellaneous assets
- `custom` - User-defined categories with custom fields

## 💳 Liability Categories

Built-in categories:
- `credit` - Credit cards
- `loan` - Personal loans
- `mortgage` - Home loans
- `tax` - Tax liabilities
- `other` - Miscellaneous liabilities
- `custom` - User-defined categories with custom fields

## 🎨 Custom Fields

Create custom categories with dynamic fields:

```json
{
  "category": "custom",
  "customCategoryName": "Vehicle",
  "customFields": [
    {
      "id": "field1",
      "name": "Brand",
      "type": "text",
      "value": "Toyota",
      "required": true
    },
    {
      "id": "field2",
      "name": "Model Year",
      "type": "number",
      "value": 2020,
      "required": true
    }
  ]
}
```

**Supported Field Types:**
- `text` - Single line text
- `textarea` - Multi-line text
- `number` - Numeric values
- `currency` - Monetary values
- `percentage` - Percentage values
- `date` - Date picker
- `url` - URLs/Links
- `email` - Email addresses
- `phone` - Phone numbers

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 📝 Environment Variables

```env
# Node Environment
NODE_ENV=development
PORT=3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/personal_finance

# JWT Secrets (32+ characters required)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🗄️ Database

### MongoDB Collections

1. **users** - User accounts
2. **assets** - User assets
3. **liabilities** - User liabilities

### Indexes

- `users.email` - Unique index for fast email lookups
- `assets.userId` - Index for user's assets
- `assets.userId + category` - Compound index for filtered queries
- `liabilities.userId` - Index for user's liabilities
- `liabilities.userId + category` - Compound index for filtered queries

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Refresh token rotation
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation with Zod
- ✅ MongoDB injection prevention
- ✅ Error sanitization in production

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

## 📖 Additional Documentation

- [MongoDB Setup Guide](./MONGODB_SETUP.md) - Complete MongoDB migration guide
- [API Documentation](./API_DOCUMENTATION.md) - Detailed API reference with examples

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 🎯 Next Steps

- [ ] Add transaction history tracking
- [ ] Implement recurring payments/income
- [ ] Add budgeting features
- [ ] Create financial goal tracking
- [ ] Add data export (PDF, CSV)
- [ ] Implement file upload for documents
- [ ] Add email notifications
- [ ] Create mobile app integration

---

**Made with ❤️ for better financial management**
