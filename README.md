# Personal Finance Application 💰

A full-stack personal finance management application built with React (Frontend) and Node.js/Express (Backend) with MongoDB database.

## 🌟 Features

### 💰 **Asset Management**
- Track multiple asset types: Cash, Bank Accounts, Investments, Property, Vehicles, Jewelry
- Create custom asset categories with custom fields
- View detailed asset information
- Real-time asset value tracking
- Category-wise asset distribution

### 💳 **Liability Management**
- Manage debts: Credit Cards, Loans, Mortgages, Taxes
- Create custom liability categories
- Track interest rates and due dates
- Institution-wise liability tracking
- Category-wise liability breakdown

### 🎨 **Custom Categories**
- Create reusable custom categories for both assets and liabilities
- Define custom fields with 9 different field types:
  - Text, Number, Currency, Date, URL, Email, Phone, Text Area, Percentage
- Separate management for Asset and Liability categories
- Document upload support and notes

### 📊 **Dashboard & Analytics**
- Net worth calculation (Assets - Liabilities)
- Total assets and liabilities summary
- Category-wise distribution charts
- Recent activity tracking
- Highest asset identification

### 🔐 **Authentication & Security**
- JWT-based authentication
- Secure password hashing
- Access & refresh tokens
- Role-based access control
- Rate limiting protection

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - UI components
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **ApexCharts** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Input validation
- **Winston** - Logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd /Users/thamaraikannan/Desktop/personal-finance
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod
```

4. **Start the application**

**Option 1: Use the convenience script**
```bash
cd /Users/thamaraikannan/Desktop/personal-finance
./start-dev.sh
```

**Option 2: Start manually**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📁 Project Structure

```
personal-finance/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.ts       # User model
│   │   │   ├── Asset.ts      # Asset model
│   │   │   └── Liability.ts  # Liability model
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   └── validators/        # Zod schemas
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── common/       # Reusable components
│   │   │   ├── features/     # Feature components
│   │   │   │   ├── assets/
│   │   │   │   └── liabilities/
│   │   │   ├── forms/        # Form components
│   │   │   └── layout/       # Layout components
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── AssetsPage.tsx
│   │   │   ├── LiabilitiesPage.tsx
│   │   │   └── CustomCategoriesPage.tsx
│   │   ├── services/         # API services
│   │   │   ├── api.ts       # Axios client
│   │   │   ├── assetService.ts
│   │   │   ├── liabilityService.ts
│   │   │   └── authService.ts
│   │   ├── store/            # Redux store
│   │   │   └── slices/
│   │   ├── contexts/         # React contexts
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilities
│   ├── .env                   # Environment variables
│   └── package.json
│
├── start-dev.sh               # Quick start script
├── FRONTEND_BACKEND_INTEGRATION.md
└── README.md (this file)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/profile` - Get user profile

### Assets
- `GET /api/v1/assets` - Get all assets
- `GET /api/v1/assets/:id` - Get asset by ID
- `POST /api/v1/assets` - Create asset
- `PUT /api/v1/assets/:id` - Update asset
- `DELETE /api/v1/assets/:id` - Delete asset
- `GET /api/v1/assets/summary` - Get asset summary

### Liabilities
- `GET /api/v1/liabilities` - Get all liabilities
- `GET /api/v1/liabilities/:id` - Get liability by ID
- `POST /api/v1/liabilities` - Create liability
- `PUT /api/v1/liabilities/:id` - Update liability
- `DELETE /api/v1/liabilities/:id` - Delete liability
- `GET /api/v1/liabilities/summary` - Get liability summary

## 📚 Documentation

- [Frontend-Backend Integration Guide](./FRONTEND_BACKEND_INTEGRATION.md)
- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- [MongoDB Setup Guide](./backend/MONGODB_SETUP.md)

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend (`.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/personal_finance
JWT_SECRET=your-32-character-secret-key
JWT_REFRESH_SECRET=your-32-character-refresh-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 🎯 Usage Flow

1. **Register/Login**
   - Create an account or login
   - JWT tokens are stored in localStorage
   - All API requests include auth token

2. **Add Assets**
   - Click "Add Asset" on Dashboard
   - Fill in asset details
   - Choose from preset or custom categories
   - Asset appears in Assets page and Dashboard

3. **Add Liabilities**
   - Click "Add Liability" on Dashboard
   - Fill in liability details
   - Track interest rates and due dates
   - Liability appears in Liabilities page

4. **Create Custom Categories**
   - Go to "Custom Categories" page
   - Create asset or liability category
   - Define custom fields
   - Use in asset/liability forms

5. **View Analytics**
   - Dashboard shows net worth
   - View category-wise distribution
   - Track total assets and liabilities
   - See recent activity

## 🛠️ Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy dist/ folder
```

### Linting & Formatting
```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### CORS Errors
- Check backend `CORS_ORIGIN` matches frontend URL
- Default: `http://localhost:5173`

### 401 Unauthorized
- Clear localStorage and login again
- Check if JWT tokens are expired
- Verify backend is running

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
kill -9 $(lsof -ti:3000)

# Kill process on port 5173 (frontend)
kill -9 $(lsof -ti:5173)
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Assets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  category: String,
  value: Number,
  purchaseDate: String,
  location: String,
  description: String,
  owner: String,
  documents: [String],
  documentUrl: String,
  customFields: Array,
  customCategoryName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Liabilities Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  category: String,
  balance: Number,
  interestRate: Number,
  dueDate: String,
  institution: String,
  owner: String,
  notes: String,
  customFields: Array,
  customCategoryName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 🎯 Future Enhancements

- [ ] Transaction history tracking
- [ ] Recurring payments/income
- [ ] Budget management
- [ ] Financial goal tracking
- [ ] Data export (PDF, CSV)
- [ ] File upload for documents
- [ ] Email notifications
- [ ] Mobile app
- [ ] Multi-currency support
- [ ] Investment portfolio tracking

---

**Built with ❤️ for better financial management**

