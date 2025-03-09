# **SheetSync - Dashboard with Google Sheets Integration**

## **Overview**

This project is a web-based dashboard that integrates with Google Sheets to display and manage data dynamically. It supports user authentication, real-time updates, and dynamic column additions on the dashboard.

## **Features**

### **1. Authentication (JWT-based)**

- Users must log in to access the dashboard (protected routes).
- JWT-based authentication (automatic logout on token expiration).

### **2. Dashboard with Google Sheets Integration**

- Users can create tables dynamically.
- Specify the number of columns and set column headers with data types (Text/Date).
- Fetches data from Google Sheets and displays it in a table.
- Rows dynamically increase as data is added.
- Real-time updates without excessive API calls.

### **3. Dynamic Column Addition**

- Users can add new columns dynamically (not reflected in Google Sheets).
- Supported types: Text (default), Date.
- Columns persist permanently on the dashboard.

---

## **Tech Stack**

### **Frontend:**

- Next.js
- Tailwind CSS
- ShadcnUI

### **Backend:**

- Node.js (Express)
- MongoDB

### **Authentication:**

- JWT (with automatic logout on expiration)

---

## **Project Structure**

```bash
📦 project-root
├── 📂 client (Frontend)
│   ├── 📂 public
│   ├── 📂 src
│   │   ├── 📂 api
│   │   ├── 📂 app
│   │   ├── 📂 app
│   │   │   ├── 📂 (auth)
│   │   │   │   ├── signin
│   │   │   │   ├── signup
│   │   │   ├── 📂 (main)
│   │   │   │   ├── dashboard
│   │   │   │   ├── table
│   │   │   ├── 📜 page.tsx
│   │   │   ├── 📜 layout.tsx
│   │   ├── 📂 app
│   │   ├── 📂 context
│   │   ├── 📂 hooks
│   │   ├── 📂 components
│   ├── 📜 package.json
│   ├── 📜 .env.local
│   ├── 📜 next.config.js
│
├── 📂 server (Backend)
│   ├── 📂 src
│   │   │  ├── 📂 config
│   │   │  ├── 📂 controllers
│   │   │  ├── 📂 lib
│   │   │  ├── 📂 middlewares
│   │   │  ├── 📂 models
│   │   │  ├── 📂 routes
│   │   │  ├── 📂 services
│   │   │  ├── 📜 server.ts
│   ├── 📜 package.json
│   ├── 📜 .env
│
├── 📜 README.md
├── 📜 .gitignore
```

## **Installation & Setup**

### **Prerequisites**

- Node.js & npm
- MongoDB
- Google Cloud Account (for Sheets API)

### **1. Clone the Repository**

```bash
git clone https://github.com/vasa-r/revoeai-assignment.git
cd revoeai-assignment
```

### **2. Setup Backend**

```bash
cd server
npm install
```

Create a **`.env`** file in the `server/` directory and add the following:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_PRIVATE_KEY = your_google_private_key (for google sheet api you can get it from api and services library. search for google sheet)
```

Run the backend:

```bash
npm start
```

---

### **3. Setup Frontend**

```bash
cd client
npm install or npm install --leagacy-per-deps
```

Create a **`.env.local`** file in the `client/` directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_WS_URL = ws://localhost:8000

```

Run the frontend:

```bash
npm run dev
```

---

**Frontend Live Link:** [Frontend Deployment](https://revoeai-task-one.vercel.app/)

**Backend Live Link:** [Backend Deployment](https://revoeai-assignment-zvqk.onrender.com/)
