# Runners API

A RESTful API for tracking running activities and managing user profiles. Built with Node.js, Express, and MongoDB.

## 📋 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Register, login, and manage user profiles
- **Run Tracking**: Create and retrieve running activity records
- **Data Validation**: Comprehensive input validation and error handling
- **Testing Suite**: Complete test coverage with Jest and Supertest

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Environment Management**: dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd runners-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/runners-db
   TOKEN_KEY=your-secret-jwt-key-here
   ```

4. **Start the server**
   ```bash
   node src/server.js
   ```

## 🚀 Quick Start

### Development
```bash
# Run the server
node src/server.js

# Run tests
npm test
```

### Testing the API
You can use REST Client extension in VS Code, or use tools like Postman or curl.

## 📚 API Documentation

See [API_DOCS.md](API_DOCS.md) for detailed endpoint documentation.

### Quick Overview

**Base URL**: `http://localhost:3000`

#### Health Check
- `GET /` - Server status
- `GET /server-runtime` - Server uptime

#### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive JWT token
- `POST /auth/logout-all` - Logout from all devices (requires auth)

#### Users
- `GET /users/me` - Get current user profile (requires auth)
- `PATCH /users/me/profile` - Update user profile (requires auth)
- `PATCH /users/me/account` - Update account info (requires auth)

#### Runs
- `POST /users/me/runs` - Create a new run record (requires auth)
- `GET /users/me/runs` - Get all runs for authenticated user (requires auth)
- `GET /runs/:id` - Get run by ID
- `DELETE /runs/:id` - Delete run by ID (requires auth, must be owner)

## 🏗️ Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/
│   └── env.config.js      # Environment variables
├── controllers/           # Route controllers
├── middleware/            # Custom middleware
│   └── validation/        # Input validation
├── models/                # Mongoose schemas
├── repositories/          # Database operations
├── routes/                # Route definitions
├── services/              # Business logic
└── utils/                 # Utility functions

test/
├── __tests__/             # Test files
├── fixtures/              # Test data
├── helpers/               # Test utilities
└── setup/                 # Test configuration
```

## 🔒 Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Obtain a token by logging in via `POST /users/login`.

## ✅ Testing

The project includes comprehensive test coverage:

```bash
npm test
```

Tests include:
- User registration and authentication
- User profile updates
- Run creation and retrieval
- Server functionality
- Input validation

## 📝 Environment Variables

| Variable   | Description                    | Required |
|------------|--------------------------------|----------|
| PORT       | Server port number             | Yes      |
| MONGO_URI  | MongoDB connection string      | Yes      |
| TOKEN_KEY  | Secret key for JWT signing     | Yes      |

## 🤝 Contributing

This is a course submission project for Hyper Island.

## 📄 License

ISC