# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Health Check

#### GET /
Get server status message.

**Response**
```json
{
  "message": "Hi there! This is a runners app server."
}
```

#### GET /server-runtime
Get server uptime in seconds.

**Response**
```json
{
  "message": "Server is running for 123.4 s."
}
```

---

## Users

### POST /users/signup
Register a new user account.

**Request Body**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules**
- `username`: 3-30 characters, alphanumeric with underscores/hyphens
- `email`: Valid email format
- `password`: Minimum 8 characters

**Success Response** (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**
- `400 Bad Request`: Validation error or user already exists
- `500 Internal Server Error`: Server error

---

### POST /users/login
Authenticate and receive a JWT token.

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
*Note: You can use either `email` or `username`, but not both.*

**Success Response** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**
- `400 Bad Request`: Invalid credentials or validation error
- `401 Unauthorized`: Incorrect password
- `404 Not Found`: User not found

---

### GET /users/me
Get current authenticated user's profile.

**Headers**
```
Authorization: Bearer <token>
```

**Success Response** (200 OK)
```json
{
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
```

**Error Responses**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

### PATCH /users/me
Update current user's profile information.

**Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "heightCm": 180,
    "weightKg": 75
  }
}
```

**Field Descriptions**
- `firstName`: User's first name (optional)
- `lastName`: User's last name (optional)
- `dateOfBirth`: ISO date format (YYYY-MM-DD) (optional)
- `heightCm`: Height in centimeters, positive number (optional)
- `weightKg`: Weight in kilograms, positive number (optional)

**Success Response** (200 OK)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "heightCm": 180,
  "weightKg": 75
}
```

**Error Responses**
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token

---

## Runs

### POST /runs
Create a new running activity record.

**Request Body**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 1800,
  "distanceMeters": 5000
}
```

**Field Descriptions**
- `userId`: UUID of the user who completed the run
- `startTime`: ISO 8601 datetime when the run started
- `durationSec`: Duration in seconds (must be ≥ 0)
- `distanceMeters`: Distance covered in meters (must be ≥ 0)

**Success Response** (201 Created)
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Error Responses**
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

---

### GET /runs/:id
Retrieve a specific run by its ID.

**URL Parameters**
- `id`: UUID of the run

**Example Request**
```
GET /runs/660e8400-e29b-41d4-a716-446655440001
```

**Success Response** (200 OK)
```json
{
  "runId": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "startTime": "2026-01-30T08:00:00.000Z",
  "durationSec": 1800,
  "distanceMeters": 5000,
  "createdAt": "2026-01-30T08:30:00.000Z",
  "updatedAt": "2026-01-30T08:30:00.000Z"
}
```

**Calculated Metrics** (you can calculate on client-side)
- Average pace: `durationSec / (distanceMeters / 1000)` seconds per km
- Speed: `(distanceMeters / 1000) / (durationSec / 3600)` km/h

**Error Responses**
- `400 Bad Request`: Invalid UUID format
- `404 Not Found`: Run not found
- `500 Internal Server Error`: Server error

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 404 | Not Found - Requested resource doesn't exist |
| 500 | Internal Server Error - Server-side error |

---

## Data Models

### User Profile Schema
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

### Run Schema
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

## Usage Examples

### cURL Examples

**Register a user**
```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "runner123",
    "email": "runner@example.com",
    "password": "MyPassword123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "runner@example.com",
    "password": "MyPassword123"
  }'
```

**Get user profile**
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create a run**
```bash
curl -X POST http://localhost:3000/runs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2026-01-30T08:00:00.000Z",
    "durationSec": 1800,
    "distanceMeters": 5000
  }'
```

**Get a run**
```bash
curl -X GET http://localhost:3000/runs/660e8400-e29b-41d4-a716-446655440001
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

## Versioning

This is version 1.0.0 of the API. The API is currently unversioned in the URL structure.
