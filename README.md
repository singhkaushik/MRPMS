# 🗂️ Multi-Role Project Management System (REST API)

A robust and secure Project Management System REST API built with **Node.js**, **Express**, and **MongoDB**, supporting **multi-tenancy** and **role-based access control (RBAC)**.

---

## 🚀 Features

- 🔐 **JWT Authentication** with **access + refresh tokens**
- 🏢 **Multi-Tenancy**: Each company has its own isolated data
- 👥 **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to users, projects, and tasks
  - **Manager**: Can manage projects and tasks within their company
  - **Member**: Can view and update only their assigned tasks
- 📦 CRUD Operations for:
  - Companies
  - Users
  - Projects
  - Tasks
- 🔎 Task **filtering by status and assignee**
- 📃 **Pagination** on list endpoints
- 🛡️ Input **validation** with Joi or express-validator
- 🚫 **Rate Limiting** per IP using `express-rate-limit`
- ⚙️ **Centralized Error Handling**
- 🧱 Modular Codebase (routes, controllers, services, models)
- ✅ Unit Testing support with Jest

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (Access + Refresh Tokens)
- **Validation**: Joi / express-validator
- **Testing**: Jest or Mocha (basic unit tests)
- **Docs**: Postman or Swagger

---

## 🧩 Entities & Relationships

### 🏢 Company
- `name`: String
- `domain`: String

### 👤 User
- `name`, `email`, `password` (hashed), `role`: 'Admin' | 'Manager' | 'Member'
- Belongs to a `Company`

### 📁 Project
- `name`, `description`
- `createdBy`: User
- `companyId`: Company

### ✅ Task
- `title`, `description`, `status`: 'To Do' | 'In Progress' | 'Done'
- `assignedTo`: User
- `projectId`: Project

---

## 🔐 Authentication & Authorization

### JWT Authentication
- **Access Token** (short-lived)
- **Refresh Token** (long-lived)

### Role Access Control
| Role   | Users | Projects | Tasks |
|--------|-------|----------|-------|
| Admin  | ✅    | ✅       | ✅    |
| Manager| ❌    | ✅       | ✅    |
| Member | ❌    | ❌       | 🔄 Update/View assigned tasks only |

EndPoint 
bash
http://localhost:4000/api/v1

🔹 Company Routes
| Method   | Endpoint                   | Description             | Roles   |
| -------- | -------------------------- | ----------------------- | ------- |
| `POST`   | `/api/v1/company/register` | Setup company and admin | Public  |
| `GET`    | `/api/v1/company/:id`      | Get company by ID       | `admin` |
| `PUT`    | `/api/v1/company/:id`      | Update company by ID    | `admin` |
| `DELETE` | `/api/v1/company/:id`      | Delete company by ID    | `admin` |

example
{
  "companyName": "",
  "domain": "",
  "admin": {
    "name": "",
    "email": "",
    "password": ""
  }
}



🔹 User Routes

| Method   | Endpoint              | Description                     | Roles              |
| -------- | --------------------- | ------------------------------- | ------------------ |
| `POST`   | `/api/v1/user/signup` | Signup new user under a company | `admin`            |
| `POST`   | `/api/v1/user/signin` | Sign in a user (get token)      | Public             |
| `GET`    | `/api/v1/`            | Get all users of company        | `admin`, `manager` |
| `PUT`    | `/api/v1/user/:id`    | Update user by ID               | Authenticated      |
| `DELETE` | `/api/v1/user/:id`    | Delete user by ID               | `admin`            |

example
{
    "name": "",
    "email": "",
    "role": "",
    "password": "",
    "companyID": "" #Mongo db ID only
}


🔹 Project Routes

| Method   | Endpoint                     | Description                     | Roles              |
| -------- | ---------------------------- | ------------------------------- | ------------------ |
| `POST`   | `/api/v1/project/create`     | Create a new project            | `admin`, `manager` |
| `GET`    | `/api/v1/projects`           | Get all projects of the company | `admin`, `manager` |
| `PUT`    | `/api/v1/project/:projectId` | Update a project                | `admin`, `manager` |
| `DELETE` | `/api/v1/project/:projectId` | Delete a project                | `admin`, `manager` |

example
{
    "name" : "", 
    "description" : ""
}


🔹 Task Routes

| Method   | Endpoint               | Description                  | Roles              |
| -------- | ---------------------- | ---------------------------- | ------------------ |
| `POST`   | `/api/v1/task/assign`  | Assign a task to user        | `admin`, `manager` |
| `GET`    | `/api/v1/tasks`        | Get tasks (supports filters) | Authenticated      |
| `PUT`    | `/api/v1/task/:taskId` | Update a task                | Authenticated      |
| `DELETE` | `/api/v1/task/:taskId` | Delete a task                | `admin`, `manager` |


{
      "title": "",
      "description": "",
    //"status" : "",
      "assignedTo" : "", #Mongo Db id only
      "projectId": ""   #Mongo Db id only
}


✅ Example Base URL for Testing
http://localhost:4000/api/v1/user/signin






