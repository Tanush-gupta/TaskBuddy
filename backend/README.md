# Backend API

This is the backend of the application, built with **Node.js, Express, and MongoDB**. It handles authentication, user management, and various API endpoints.

## 🚀 Features
- User authentication (JWT & cookies)
- Secure API with token-based authentication
- Task management (Add, Update, Delete)
- User logout functionality
- CORS enabled for frontend communication
- MongoDB integration using Mongoose

---

## 🛠️ Tech Stack
- **Node.js** (Runtime)
- **Express.js** (Web framework)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT** (Authentication)
- **cookie-parser** (Handling cookies)
- **CORS** (Cross-origin requests)

---

## 📌 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/backend.git
cd backend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the root directory and add:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3001
```

### **4️⃣ Run the Server**
#### Development Mode
```bash
npm run dev
```
#### Production Mode
```bash
npm start
```

---

## 🔐 Authentication


### **User Register**
**Endpoint:** `POST /api/v1/user/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "username" : "user",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Register successful"
  }
  ```
  - The response also sets an **HTTP-only cookie** with the JWT token.

### **User Login**

**Endpoint:** `POST /api/v1/user/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful"
  }
  ```
  - The response also sets an **HTTP-only cookie** with the JWT token.


### **Get User Data**
**Endpoint:** `GET /api/v1/user/getUser`
- **Headers:** `Cookie: token=your_jwt_token`
- **Response:**
  ```json
  {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
  ```


### **User Logout**
**Endpoint:** `POST /api/v1/user/logout`
- **Response:**
  ```json
  {
    "message": "Logout successful"
  }
  ```
  - This clears the authentication token from the cookies.


---

## 📌 Task Management


### **Add Task**
**Endpoint:** `POST /api/v1/task/addTask`
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "dueDate": "2024-12-31",
    "status": "TO DO"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task added successfully",
  }
  ```

### **Get Task**
**Endpoint:** `GET /api/v1/task/getTask`
- **Headers:** `Cookie: token=your_jwt_token`
- **Response:**
  ```json
  {
    "message": "Task fetched successfully",
    "data": [Task]
  }
  ```

### **Update Task Status**
**Endpoint:** `PATCH /api/v1/task/updateTaskStatus/:taskId`
- **Request Body:**
  ```json
  {
    "status": "IN PROGRESS"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task status updated successfully"
  }
  ```

### **Delete Task**
**Endpoint:** `DELETE /api/v1/task/deleteTask/:taskId`
- **Response:**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## ⚡ API Endpoints
| Method | Endpoint                         | Description               |
|--------|----------------------------------|---------------------------|
| POST   | `/api/v1/user/login`            | User login               |
| GET   | `/api/v1/user/logout`           | User logout                |
  POST   |`api/v1/user/register`            | User Register             |
| GET    | `/api/v1/user/getUser`          | Get authenticated user   |
| POST   | `/api/v1/task/addTask`          | Add a new task           |
| PATCH  | `/api/v1/task/updateTaskStatus/:taskId` | Update task status|
| GET.   | `/api/v1/task/getTask`.                 | Get all tasks |
| DELETE | `/api/v1/task/deleteTask/:taskId` | Delete a task   
       |

---

## 🌍 CORS Configuration
Ensure **CORS** is enabled in `server.js`:
```javascript
import cors from "cors";
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));
```

---

## 🛠️ Debugging & Logs
- **Check Server Logs:**
  ```bash
  npm run dev
  ```
- **Debugging Cookies:**
  - Open Chrome DevTools → **Application → Storage → Cookies**

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🙌 Contributors
Feel free to contribute! Open an issue or submit a pull request.

