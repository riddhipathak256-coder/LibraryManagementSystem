
# Library Management System

A simple web-based Library Management System developed using the MERN Stack. This application helps manage books, library members, and book issue and return transactions.

## 1. Introduction

The Library Management System is a full-stack web application developed using MongoDB, Express.js, React.js, and Node.js.

It provides a simple interface to manage library records, maintain book information, manage members, and track book issue and return activities.

## 2. Objectives

The main objectives of this project are:

- Add, update, view, and delete books.
- Manage library members.
- Issue books to members.
- Record returned books.
- Display basic library information through a dashboard.
- Understand frontend, backend, API, and database integration.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Node.js | Backend runtime environment |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB interaction |
| HTML | Page structure |
| CSS | Styling and design |
| JavaScript | Application logic |
| Git & GitHub | Version control |

## 4. System Modules

### 4.1 Dashboard
Displays library statistics such as:
- Total Books
- Total Members
- Issued Books
- Returned Books

### 4.2 Book Management
- Add new books.
- View book records.
- Update book information.
- Delete book records.

### 4.3 Member Management
- Add new members.
- View member details.
- Update member information.
- Delete member records.

### 4.4 Issue and Return Management
- Issue available books to members.
- Record book issue and due dates.
- Return issued books.
- Update book availability and quantity.

## 5. Functional Requirements

- View the dashboard.
- Create and manage book records.
- Add and manage library members.
- Issue books to members.
- Return issued books.
- View current and previous transactions.

## 6. Non-Functional Requirements

- Simple and user-friendly interface.
- Responsive web pages.
- RESTful backend APIs.
- MongoDB database integration.
- Form validation.
- Maintainable project structure.

## 7. Database Design

The application uses MongoDB to store its data.

The main collections are:

- **Books:** Stores book information.
- **Members:** Stores library member information.
- **Transactions:** Stores book issue and return records.

## 8. Backend API Design

The backend uses Express.js to provide API endpoints for:

- Book management (CRUD operations).
- Member management.
- Book issue operations.
- Book return operations.

## 9. Frontend Pages

The React frontend contains the following sections:

- Dashboard
- Books
- Members
- Transactions

## 10. Project Folder Structure

```text
LibraryManagementSystemProject/
│
├── Backend/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 11. Working Flow

1. The user opens the React application.
2. React sends requests to the Express.js backend.
3. Express.js handles the API requests.
4. Mongoose communicates with MongoDB.
5. The backend sends JSON responses to React.
6. React updates the user interface based on the response.

## 12. Installation and Setup

### Prerequisites

- Node.js
- MongoDB
- VS Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/riddhipathak256-coder/LibraryManagementSystem.git
```

### Step 2: Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder and configure your MongoDB connection string.

Start the backend server:

```bash
node server.js
```

The backend runs on port **5000**.

### Step 3: Setup Frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 13. Testing

The following functionalities have been tested:

- Adding, viewing, updating, and deleting books.
- Managing library members.
- Issuing books to members.
- Returning issued books.
- Updating book quantity after issue and return.
- Frontend and backend communication.
- Dashboard statistics.

## 14. Future Enhancements

The project can be extended with:

- Admin login and authentication.
- Fine calculation for late returns.
- Search and filtering.
- Book cover images.
- Email notifications.
- Pagination.
- Reports and analytics.
- Cloud deployment.

## 15. Conclusion

The Library Management System is a beginner-friendly MERN Stack project that demonstrates the complete flow of a full-stack web application.

It covers frontend development using React.js, backend API development using Node.js and Express.js, and database management using MongoDB and Mongoose.

The project provides practical understanding of CRUD operations, API integration, database connectivity, and library management functionalities.

---

**Project:** Library Management System  
**Technology:** MERN Stack