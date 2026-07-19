# Coupon Management System

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge)

# Coupon Management System

### Smart Coupon Distribution & Management Platform

**Create • Manage • Redeem • Track**

</div>

---

# 📖 Overview

The **Coupon Management System** is a full-stack web application that enables businesses to efficiently create, distribute, manage, and monitor digital coupons. The platform provides secure coupon generation, redemption tracking, and analytics while ensuring that coupons are redeemed only by eligible users.

The system simplifies promotional campaigns by automating coupon management, reducing manual effort, and preventing coupon misuse.

---

# 🎯 Objectives

- Digitize coupon management
- Eliminate duplicate coupon redemption
- Provide secure coupon validation
- Manage promotional campaigns efficiently
- Track coupon usage and redemption history
- Generate insights through analytics
- Improve customer engagement

---

# ✨ Features

## 👨‍💼 Admin Module

- Secure Login
- Dashboard
- Create Coupons
- Edit Coupons
- Delete Coupons
- Activate/Deactivate Coupons
- Set Coupon Validity
- Configure Discount Rules
- Monitor Coupon Usage
- View Analytics
- Manage Users

---

## 👤 User Module

- User Registration
- Secure Login
- Browse Available Coupons
- Redeem Coupons
- View Redemption History
- Profile Management
- Notification Support

---

## 🎟 Coupon Management

- Generate Unique Coupon Codes
- Percentage Discounts
- Flat Discounts
- Expiry Date Management
- Limited Usage Coupons
- One-Time Coupons
- Public & Private Coupons

---

## 📊 Dashboard

Monitor important statistics:

- Total Coupons
- Active Coupons
- Expired Coupons
- Redeemed Coupons
- Registered Users
- Campaign Performance
- Redemption Analytics

---

## 🔐 Authentication & Security

- JWT Authentication
- Password Encryption (bcrypt)
- Protected Routes
- Role-Based Access
- Secure API Endpoints

---

# 🏗️ System Architecture

```text
             React Frontend
                    │
                    ▼
             Express REST API
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      MongoDB Database   JWT Authentication
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap / Tailwind CSS
- Axios

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB
- Mongoose

---

## Authentication

- JWT
- bcrypt

---

## Development Tools

- Visual Studio Code
- Postman
- Git
- GitHub
- MongoDB Compass

---

# 📂 Project Structure

```text
Coupon-Management/

│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── screenshots/
├── docs/
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/gnanadeep30805/Coupon-Management.git
```

Navigate to the project

```bash
cd Coupon-Management
```

Install frontend dependencies

```bash
cd client
npm install
```

Install backend dependencies

```bash
cd ../server
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## Start Backend

```bash
npm run dev
```

---

## Start Frontend

```bash
npm start
```

---

# 📸 Screenshots

Add screenshots for:

- Home Page
- Login Page
- Admin Dashboard
- Coupon Management
- User Dashboard
- Coupon Redemption
- Analytics Dashboard

---

# 🚀 Future Enhancements

- QR Code Coupons
- Email Coupon Distribution
- SMS Notifications
- Referral Coupons
- Loyalty Rewards
- Multi-Vendor Support
- AI-Based Personalized Coupons
- Mobile Application
- Payment Gateway Integration
- Coupon Fraud Detection

---

# 📊 Project Highlights

- 🎟 Secure Coupon Generation
- 🔐 JWT Authentication
- 📈 Coupon Analytics
- 📊 Admin Dashboard
- 👤 User Dashboard
- 🗄 MongoDB Integration
- ⚡ RESTful APIs
- 📱 Responsive Design
- 🔒 Role-Based Access Control

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates further development.

---

# 👨‍💻 Author

**Gnana Deep**

🎓 Computer Science Student  
💻 Full Stack Developer  
🚀 MERN Stack Enthusiast

---

<div align="center">

## 🎉 Simplifying Digital Coupon Management

**A secure and scalable MERN Stack application for creating, managing, and tracking promotional coupons with ease.**

Made with ❤️ using React.js, Node.js, Express.js & MongoDB

</div>
