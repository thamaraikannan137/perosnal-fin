# Node.js API Boilerplate

Enterprise-grade Node.js API boilerplate with TypeScript, Express, Sequelize, and PostgreSQL.

## Features

- ✅ TypeScript for type safety
- ✅ Express.js framework
- ✅ Sequelize ORM with PostgreSQL
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ Error handling middleware
- ✅ Request logging with Winston
- ✅ Rate limiting
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ API versioning
- ✅ Standardized API responses

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd api_react_boiler_plate
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
- Database credentials
- JWT secrets (generate strong random strings)
- Other environment-specific settings

4. Set up database
```bash
# Create database
createdb your_database_name

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database
- `npm run db:seed:undo` - Undo seed data

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic layer
├── utils/           # Utility functions
├── validators/      # Request validation schemas
└── index.ts         # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/profile` - Get current user profile (protected)

### Users
- `GET /api/v1/users` - Get all users (protected)
- `GET /api/v1/users/:id` - Get user by ID (protected)
- `PUT /api/v1/users/:id` - Update user (protected)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Health Check
- `GET /health` - Health check endpoint

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Error Handling

All errors follow a standardized format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

See `.env.example` for all available environment variables.

## Database Migrations

Migrations are managed using Sequelize CLI. Create a new migration:

```bash
npx sequelize-cli migration:generate --name migration-name
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC