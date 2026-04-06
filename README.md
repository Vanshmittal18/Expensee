# 🧾 Expensee — Expense Tracker API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

**Expensee** is a backend API for managing personal expenses and incomes.  
It provides authentication, income/expense management, and dashboard summaries — ready to integrate with any frontend.

---

## 🚀 Features

- 🔐 User Authentication (Register/Login) with JWT
- 💰 Manage Incomes and Expenses
- 📊 Dashboard summary for quick insights
- 📁 File uploads (Excel or receipts) using Multer
- RESTful API design

---

## 🧱 Tech Stack

- **Backend:** Node.js + Express  
- **Database:** MongoDB (via Mongoose)  
- **Authentication:** JWT  
- **Password Security:** Bcrypt  
- **File Upload:** Multer  
- **Configuration:** dotenv  
- **Other:** CORS  

---

## ⚡ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/Vanshmittal18/Expensee.git
cd Expensee

# Install dependencies
npm install
Environment Variables

Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
Run the Server
# Start in development mode
npm run dev

# Or start normally
npm start

The server will run at http://localhost:5000.

💡 Future Enhancements
Swagger API documentation
Rate limiting & security middleware
Pagination for income/expense lists
Monthly summary charts & analytics
Frontend integration (React / Flutter / React Native)

