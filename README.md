# Runners API

A RESTful API for tracking running activities and managing user profiles. Built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication with bcrypt password hashing
- User registration, login, and session management
- User profile and account management
- Running activity tracking (create, read, update, delete)
- Admin-level access controls with permission guards
- Input validation and error handling
- Complete test coverage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with token versioning
- **Password Security**: bcrypt
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Environment**: dotenv

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/runners-db
TOKEN_KEY=your-secret-jwt-key-here
```

## Usage

```bash
# Start server
node src/server.js

# Run tests
npm test
```

## API Overview

See [API_DOCS.md](API_DOCS.md) for complete documentation.

**Base URL**: `http://localhost:3000/api/v1`

**Health Check** (no `/api/v1` prefix)
- `GET /health` - Server status and uptime

**Authentication**
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/logout-all` - Invalidate all tokens

**Users**
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me/profile` - Update profile (firstName, lastName, dateOfBirth, heightCm, weightKg)
- `PATCH /api/v1/users/me/account` - Update account (username, email)
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin or self)

**Runs**
- `POST /api/v1/users/me/runs` - Create run
- `GET /api/v1/users/me/runs` - Get my runs
- `GET /api/v1/runs/:id` - Get run by ID
- `PATCH /api/v1/runs/:id` - Update run (owner or admin)
- `DELETE /api/v1/runs/:id` - Delete run (owner or admin)

## Architecture

**Layered Structure**
- **Routers**: Route definitions and endpoint setup
- **Middleware**: Auth, validation, guards, error handling
- **Controllers**: Request/response handling
- **Services**: Business logic
- **Repositories**: Database operations
- **Models**: Mongoose schemas
- **Utils**: Helpers (JWT, password, DB, response)

**Key Features**
- Token versioning for session management
- Permission-based guards (admin, owner-or-admin)
- Comprehensive input validation
- Password metadata tracking (failed attempts, lock)
- UUID-based resource identifiers

## Testing

Tests cover all endpoints and include:
- Auth (signup, login, session management)
- Users (profile, account, admin operations)
- Runs (CRUD operations)
- Input validation and error handling

## License

ISC