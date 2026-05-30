# AI English Tutor Backend

A production-ready Node.js backend built with Express.js and MongoDB (Mongoose) using ES modules.

## Features

- Express.js REST API
- MongoDB connection with Mongoose
- User CRUD endpoints
- Validation and meaningful errors
- Global error handler
- Async error wrapper
- Not found middleware
- Security middleware with Helmet, CORS, and request sanitization
- Consistent API response format

## Project Structure

- `src/config/` - database connection and configuration
- `src/controllers/` - request handlers
- `src/models/` - Mongoose schemas
- `src/routes/` - API routes
- `src/middleware/` - reusable middleware
- `src/services/` - business logic
- `src/utils/` - helpers and custom error class
- `src/app.js` - Express app configuration
- `src/server.js` - application entry point

## Requirements

- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend root using `.env.example` as the template.

### Variables

- `PORT` - server port
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - environment name

### Example

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-english-tutor
NODE_ENV=development
```

## Run the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Base URL

```text
http://localhost:5000
```

## Health Check

### GET /health

Response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "status": "ok"
  }
}
```

## User API

All responses follow this structure:

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

## Endpoints

### Create User

**POST** `/api/users`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Response example:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "6657f7d7e5b1d9f1e3a8c001",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### Get All Users

**GET** `/api/users`

Response example:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": []
}
```

### Get User By ID

**GET** `/api/users/:id`

Response example:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "6657f7d7e5b1d9f1e3a8c001",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### Update User

**PUT** `/api/users/:id`

Request body:

```json
{
  "name": "Jane Doe"
}
```

Response example:

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "6657f7d7e5b1d9f1e3a8c001",
    "name": "Jane Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:10:00.000Z"
  }
}
```

### Delete User

**DELETE** `/api/users/:id`

Response example:

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "6657f7d7e5b1d9f1e3a8c001",
    "name": "Jane Doe",
    "email": "john@example.com",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:10:00.000Z"
  }
}
```

## Validation Rules

- `name` is required
- `email` is required and must be valid
- `password` is required and must be at least 6 characters
- Invalid MongoDB ObjectIds return a `400` error

## Security

This backend uses:

- `helmet`
- `cors`
- `express.json()`
- `express-mongo-sanitize`

## Notes

- Passwords are hashed before being stored in MongoDB.
- Duplicate email addresses return a `409` error.
- Missing routes return a `404` error.
