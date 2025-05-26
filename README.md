#PostMan Documentation link : https://www.postman.com/crimson-capsule-249854/taskmate/collection/3awjjjn/taskbuddy?action=share&creator=36302522

# Getting Started with Docker

To run this application using Docker:

## 1. Switch to the docker branch

git checkout docker

## 2. Build and start the application using Docker Compose

docker-compose up --build

## 3. App URLs:

### Backend API: http://localhost:5050/api/v1

### Frontend (if connected): http://localhost:3000

## 4.Admin User Auto-Creation

email : admin@gmail.com

password : admin@gmail.com

## 5. To reflect code changes, always rebuild the containers:

docker-compose up --build

# API Documentation

## Overview

This API allows for managing users and tasks with role-based access control using JWT authentication. Admin routes are protected and can only be accessed by users with admin privileges.

---

## Base URL

```
/api/v1
```

---

## Authentication Middleware

- `protect`: Ensures the user is authenticated.
- `isAdmin`: Verifies the user has admin privileges.

---

## Admin Routes

### Base Path

```
/api/v1/admin
```

### Middleware

All routes under this path are protected by both `protect` and `isAdmin` middleware.

---

### User Management

#### GET `/admin/users`

Retrieve all users except the currently logged-in admin.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)
- `sort` (default: "createdAt")
- `order` (default: "desc")

**Response:**

- List of users (excluding passwords)
- Pagination metadata

#### POST `/admin/users`

Create a new user.

**Body Parameters:**

- `email` (required)
- `password` (required)
- `role` (optional; default: "user")

**Response:**

- Created user info (without password)

#### PUT `/admin/users/:id`

Update an existing user.

**Body Parameters:**

- `email` (optional)
- `password` (optional)
- `role` (optional)

**Response:**

- Updated user info (without password)

#### DELETE `/admin/users/:id`

Delete a user and their assigned tasks.

**Response:**

- Success message

---

### Task Management

These routes exist in the code but are currently commented out. They follow the same structure:

#### GET `/admin/tasks`

Retrieve all tasks with filtering, sorting, and pagination.

#### POST `/admin/tasks`

Create a new task. Accepts file uploads via `multipart/form-data`.

#### PUT `/admin/tasks/:id`

Update a task by ID.

#### DELETE `/admin/tasks/:id`

Delete a task by ID.

---

## Task Routes

### Base Path

```
/api/v1/tasks
```

### Middleware

All routes under this path require `protect` middleware (user must be authenticated).

#### GET `/tasks`

Get all tasks created by the authenticated user.

#### GET `/tasks/:id`

Get a single task by ID (only if it belongs to the user).

#### POST `/tasks`

Create a new task.

#### PUT `/tasks/:id`

Update an existing task by ID.

#### DELETE `/tasks/:id`

Delete a task by ID.

---

## User Routes

### Base Path

```
/api/v1/users
```

### Middleware

Some routes require `protect` middleware.

#### POST `/users/register`

Register a new user.

#### POST `/users/login`

Login a user and return JWT token.

#### GET `/users/profile`

Get the authenticated user’s profile. (Requires `protect`)

#### PUT `/users/profile`

Update the authenticated user’s profile. (Requires `protect`)

---

## File Upload Middleware

- Configured using `multer`
- Files are saved under `public/uploads/`
- File types allowed: jpeg, jpg, png, gif, pdf, doc, docx
- Max file size: 5MB

---

## Error Handling

Unhandled errors are caught by global middleware and return a JSON response with a 500 status.

**Response:**

```json
{
  "message": "Something went wrong!",
  "error": "<error message> (if in development mode)"
}
```

---

## Available Routes Summary

| Method | Endpoint           | Description               | Access        |
| ------ | ------------------ | ------------------------- | ------------- |
| GET    | `/admin/users`     | Get all users             | Admin only    |
| POST   | `/admin/users`     | Create a user             | Admin only    |
| PUT    | `/admin/users/:id` | Update a user             | Admin only    |
| DELETE | `/admin/users/:id` | Delete a user             | Admin only    |
| GET    | `/admin/tasks`     | Get all tasks (commented) | Admin only    |
| POST   | `/admin/tasks`     | Create task with upload   | Admin only    |
| PUT    | `/admin/tasks/:id` | Update a task             | Admin only    |
| DELETE | `/admin/tasks/:id` | Delete a task             | Admin only    |
| GET    | `/tasks`           | Get all user tasks        | Authenticated |
| GET    | `/tasks/:id`       | Get task by ID            | Authenticated |
| POST   | `/tasks`           | Create a task             | Authenticated |
| PUT    | `/tasks/:id`       | Update a task             | Authenticated |
| DELETE | `/tasks/:id`       | Delete a task             | Authenticated |
| POST   | `/users/register`  | Register a new user       | Public        |
| POST   | `/users/login`     | Login a user              | Public        |
| GET    | `/users/profile`   | Get user profile          | Authenticated |
| PUT    | `/users/profile`   | Update user profile       | Authenticated |

Let me know if you want this document exported as Markdown or need a Postman collection to test the API endpoints.
