## **Task Management System**

### **Objective**
The Task Management System allows users to create, read, update, and delete tasks. Users can register, log in, and manage their tasks efficiently with authentication and a user-friendly interface.

---

## **Tech Stack**
- **Frontend:** React, TypeScript, Axios
- **Backend:** Node.js, Express.js, TypeScript, JWT Authentication
- **Database:** PostgreSQL (with Supabase)
- **State Management:** React Hooks (useState, useEffect, useContext)
- **API Client:** Axios
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## **Features**
### **Frontend (React + TypeScript)**
✅ **Authentication Pages**  
- User Registration  
- Login with JWT Authentication  

✅ **Task Management Dashboard**  
- Display all tasks  
- Filter tasks by status  

✅ **Task Operations**  
- Add a new task  
- Edit existing tasks  
- Delete tasks  
- Mark tasks as completed  

✅ **Responsive Design**  
- Works on mobile and desktop  

---

### **Backend (Node.js + TypeScript)**
✅ **Authentication**  
- JWT-based authentication  
- User registration & login endpoints  
- Refresh token mechanism for session persistence  

✅ **Task Management API**  
- CRUD (Create, Read, Update, Delete) operations for tasks  

✅ **Database Schema (PostgreSQL)**  
- User table  
- Task table with relationships  

✅ **Security & Best Practices**  
- Validation & error handling  
- Environment variables for sensitive configuration  
- Transaction handling for database integrity  

---

## **Installation & Setup**
### **Backend Setup**
1. Clone the repository:
   ```sh
   git clone https://github.com/Prateek-rajput-007/Task-Management-System.git
   cd Task-Management-System/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables (`.env` file):
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. Run the backend server:
   ```sh
   npm run dev
   ```

---

### **Frontend Setup**
1. Navigate to the frontend:
   ```sh
   cd ../frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the React application:
   ```sh
   npm start
   ```

---

## **API Endpoints**
### **Authentication**
| Method | Endpoint        | Description               |
|--------|----------------|---------------------------|
| POST   | `/api/register` | Register a new user       |
| POST   | `/api/login`    | Authenticate user & return JWT |

### **Tasks**
| Method | Endpoint        | Description               |
|--------|----------------|---------------------------|
| GET    | `/api/tasks`    | Get all tasks for a user  |
| POST   | `/api/tasks`    | Create a new task         |
| PUT    | `/api/tasks/:id` | Update an existing task   |
| DELETE | `/api/tasks/:id` | Delete a task            |

---

## **Deployment**
- **Frontend:** [Live on Vercel](https://tasktypescript.vercel.app)
- **Backend:** [Live on Render](https://task-typescript-backend.onrender.com)

---

## **Future Improvements**
- Implement unit tests using Jest
- Optimize database queries with indexing
- Add dark mode & UI enhancements

---

## **Author**
- **Prateek Rajput**  
- GitHub: [Prateek-rajput-007](https://github.com/Prateek-rajput-007)
- LinkedIn: [prateek-007](https://linkedin.com/in/prateek-007)  

---

## **Notes for Implementation**
- Use **Supabase PostgreSQL** for database storage
- Implement **JWT Refresh Token Mechanism** for secure authentication
- Handle **CORS Issues** using appropriate headers
- Use **React Context API** for global state management
- Optimize queries for better performance and scalability

🚀 **Happy Coding!** 🎯
