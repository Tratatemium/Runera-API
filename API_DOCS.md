# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

**Note**: Health check endpoint is at `http://localhost:3000/health` (no `/api/v1` prefix).

## Authentication

Protected endpoints require a JWT token:
```
Authorization: Bearer <token>
```

---

## Health Check

### GET /health
Get server status and uptime.

**Full URL**: `http://localhost:3000/health` (no `/api/v1` prefix)

**Response** (200 OK)
```json
{
  "status": "ok",
  "uptime": "00:05:23",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### POST /auth/signup
Register a new user.

**Request Body**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation**
- `username`: 3-30 chars, alphanumeric with underscores/hyphens
- `email`: Valid email format
- `password`: Minimum 8 characters

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Errors**
- `400`: Validation error or user exists
- `409`: Username or email already exists
- `415`: Content-Type must be application/json
- `500`: Server error

---

### POST /auth/login
Authenticate and receive JWT token.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
*Use either `email` or `username`, not both.*

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "1h"
  }
}
```

**Errors**
- `400`: Invalid credentials or validation error
- `401`: Incorrect password
- `404`: User not found
- `415`: Content-Type must be application/json

---

### POST /auth/logout-all
Invalidate all tokens for current user (increments token version).

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```
Status: 200 OK
(No response body)
```

**Errors**
- `401`: Invalid or missing token

---

## User Endpoints

### GET /users/me
Get current user's profile.

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "account": {
      "username": "johndoe",
      "email": "john@example.com",
      "lastLogin": "2026-01-30T12:00:00.000Z"
    },
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "heightCm": 180,
      "weightKg": 75
    },
    "createdAt": "2026-01-20T10:00:00.000Z",
    "updatedAt": "2026-01-30T12:00:00.000Z"
  }
}
```

**Errors**
- `401`: Invalid or missing token
- `404`: User not found

---

### PATCH /users/me/profile
Update user profile.

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "heightCm": 180,
  "weightKg": 75
}
```
*All fields optional.*

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "heightCm": 180,
    "weightKg": 75
  }
}
```

**Errors**
- `400`: Validation error
- `401`: Invalid or missing token
- `415`: Content-Type must be application/json

---

### PATCH /users/me/account
Update account information (username/email).

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```
*All fields optional. Must not conflict with existing users.*

**Response** (200 OK)
```
Status: 200 OK
(No response body)
```

**Errors**
- `400`: Validation error or username/email exists
- `401`: Invalid or missing token
- `409`: Username or email already exists
- `415`: Content-Type must be application/json

---

### GET /users
Get all users (admin only).

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "userId": "...",
      "account": {...},
      "profile": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Errors**
- `401`: Invalid or missing token
- `403`: Not admin

---

### GET /users/:id
Get user by ID (admin or self only).

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "userId": "...",
    "account": {...},
    "profile": {...},
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**
- `400`: Invalid UUID
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: User not found

---

## Run Endpoints

### POST /users/me/runs
Create a new run.

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 1800,
  "distanceMeters": 5000
}
```

**Response** (201 Created)
```json
{
  "status": "success",
  "data": {
    "runId": "660e8400-e29b-41d4-a716-446655440001"
  }
}
```

**Errors**
- `400`: Validation error
- `401`: Invalid or missing token
- `415`: Content-Type must be application/json

---

### GET /users/me/runs
Get all runs for authenticated user.

**Headers**
```
Authorization: Bearer <token>
```

**Response** (200 OK)
```json
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "runId": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "startTime": "2026-01-30T08:00:00.000Z",
      "durationSec": 1800,
      "distanceMeters": 5000,
      "createdAt": "2026-01-30T08:30:00.000Z",
      "updatedAt": "2026-01-30T08:30:00.000Z"
    }
  ]
}
```

**Errors**
- `401`: Invalid or missing token

---

### GET /runs/:id
Get run by ID (public).

**URL Parameters**
- `id`: UUID of the run

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "runId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2026-01-30T08:00:00.000Z",
    "durationSec": 1800,
    "distanceMeters": 5000,
    "createdAt": "2026-01-30T08:30:00.000Z",
    "updatedAt": "2026-01-30T08:30:00.000Z"
  }
}
```

**Errors**
- `400`: Invalid UUID
- `404`: Run not found

---

### PATCH /runs/:id
Update run (owner or admin only).

**Headers**
```
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 2000,
  "distanceMeters": 5500
}
```
*All fields optional.*

**Response** (200 OK)
```json
{
  "status": "success",
  "data": {
    "runId": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2026-01-30T08:00:00.000Z",
    "durationSec": 2000,
    "distanceMeters": 5500,
    "createdAt": "2026-01-30T08:30:00.000Z",
    "updatedAt": "2026-01-30T10:00:00.000Z"
  }
}
```

**Errors**
- `400`: Validation error or invalid UUID
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: Run not found
- `415`: Content-Type must be application/json

---

### DELETE /runs/:id
Delete run (owner or admin only).

**Headers**
```
Authorization: Bearer <token>
```

**Response** (204 No Content)
```
Status: 204 No Content
(No response body)
```

**Errors**
- `400`: Invalid UUID
- `401`: Invalid or missing token
- `403`: Not authorized
- `404`: Run not found

---

## Data Models

### User
```javascript
{
  userId: String (UUID),
  account: {
    username: String,
    email: String,
    lastLogin: Date
  },
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    heightCm: Number,
    weightKg: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Run
```javascript
{
  runId: String (UUID),
  userId: String (UUID),
  startTime: Date,
  durationSec: Number,
  distanceMeters: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Format

All errors return:
```json
{
  "error": "Error message"
}
```

### HTTP Status Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `415` - Unsupported Media Type (Content-Type not application/json)
- `500` - Internal Server Error
