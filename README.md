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


