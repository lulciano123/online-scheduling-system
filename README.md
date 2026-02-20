# 🚀 Online Scheduling System for Services

This is a complete full-stack project developed for the Database Design course at the Federal University of Pelotas (UFPel), focusing on building an online scheduling system for independent professionals.

## 🎯 Project Objective

The goal is to create a platform where professionals (such as barbers, doctors, therapists, etc.) can manage their calendars, and clients can book appointments automatically.

## 🛠️ Technologies Built With

* **Frontend:** React.js, Vite, TypeScript
* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL

## ✅ Project Status: Completed

All phases of the initial roadmap have been successfully implemented to deliver a fully functional architecture:

* [x] **Architecture & Modeling:** Conceptual design via Entity-Relationship Diagram (ERD) and its mapping to the Relational Logical Model. *(Available in the PDF file)*.
* [x] **Database (SQL):** Complete schema creation, data seeding, complex queries with `JOINs`, and active database processing using `Triggers`.
* [x] **Backend:** Development of a RESTful API to handle database connections and execute complete CRUD operations.
* [x] **Frontend:** Creation of a dynamic user interface (Dashboard) capable of fetching, displaying, adding, editing, and deleting professional records in real-time.

## ⚙️ How to Run the Project Locally

To run this full-stack application on your machine, you will need Node.js and PostgreSQL installed.

### 1. Database Setup
1. Open your PostgreSQL environment (e.g., pgAdmin or DBeaver).
2. Execute the `database/script_final.sql` file. This script will automatically create the schema, tables, triggers, and insert mock data.

### 2. Backend (Node.js API)
Open a terminal in the root directory and run:

```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:3000`*

### 3. Frontend (React App)
Open a new terminal in the root directory and run:

```bash
cd client
npm install
npm run dev
```
*The React application will be available on `http://localhost:5173`*