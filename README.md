# E-Commerce API (Node.js + Express + MongoDB)

A backend API for an **Ecommerce system**, built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.  
This project handles **users, authentication, carts, orders, and email confirmation**, with proper security practices.  

---

## E-Commerce Frontend:
An E-Commerce Frontend Project was implemented For this Backend using `Angular.js` and `Bootstrap` , take a quick look at the Frontend Repo
```
https://github.com/omniafarouk/E-Commerce-Frontend.git
```

## Features

### Authentication & User Management
- Register new users with hashed passwords (bcrypt).  
- Login with JWT authentication.  
- Email confirmation (`isConfirmed` boolean in DB).  
- Restrict placing orders if email is not confirmed.  
- Update profile (name, email, etc.) via `PUT /updateProfile`.  
- Change password securely via `PUT /updatePassword`:  
  - Requires `newPassword`.  
  - Passwords are always hashed before saving.
  - A reset your password email is sent
  - Invalidates old sessions after password change.  

### Carts
- Create a cart for a user.  
- Get cart by userId.  
- Delete cart by **userId** (not cartId) → frontend doesn’t need to store cartId.  
  - Example: `DELETE /cart/:userId`  
- Ensures one cart per user.  

### Orders
- Place an order only if:  
  - User is authenticated (`verifyToken`).  
  - User has confirmed email (`isConfirmed: true`).  
- Orders link to user + cart.  
- Cancel / update orders supported.  

### Middleware
- `verifyToken` → validates JWT, attaches decoded user info to `req.decoded`.  
- `checkAdmin(role)` → role-based access control for admin-only routes.  
- Chained middleware supported (e.g., `verifyToken` → `checkAdmin`).  

Example:
router.delete("/user/:id", verifyToken, checkAdmin("admin"), deleteUser);


# Email Confirmation & E-Commerce API

## Email Confirmation Flow
- Users receive a **confirmation email** after signup.
- Backend sets `isConfirmed: false` until the user confirms.
- If the user does not confirm, the account **remains active** but **cannot place orders**.  
  ( Account is **not** auto-deleted)

---

## Tech Stack
- **Backend:** Node.js, Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT + bcrypt  
- **Validation:** Express middleware  
- **Email Service:** Nodemailer (confirmation links)  

---

Project Structure
```
ecommerce-api/
├── models/
│ ├── userModel.js
│ ├── cartModel.js
│ └── orderModel.js
├── routes/
│ ├── authRoutes.js
│ ├── userRoutes.js
│ ├── cartRoutes.js
│ └── orderRoutes.js
├── controllers/
│ ├── authController.js
│ ├── userController.js
│ ├── cartController.js
│ └── orderController.js
├── middleware/
│ ├── verifyToken.js
│ └── checkAdmin.js
├── config/
│ └── db.js
└── server.js
```

 API Endpoints

---

## API Endpoints

### Auth
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/auth/register`     | Register new user        |
| POST   | `/auth/login`        | Login user + get JWT     |
| GET    | `/auth/confirm/:id`  | Confirm email            |

### Users
| Method | Endpoint                 | Description                       |
|--------|---------------------------|-----------------------------------|
| PUT    | `/user/updateProfile`    | Update profile (name, email, etc.) |
| PUT    | `/user/updatePassword`   | Change password (old + new req.)   |

### Cart
| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| POST   | `/cart`         | Create new cart         |
| GET    | `/cart/:userId` | Get cart by `userId`    |
| DELETE | `/cart/:userId` | Delete cart by `userId` |

### Orders
| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/order`        | Place order (requires confirmed email) |
| GET    | `/order/:id`    | Get order details                    |
| PUT    | `/order/:id`    | Update or cancel order               |

---

## Getting Started

### 1. Clone repo
```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api

Getting Started
1. Clone repo
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api

2. Install dependencies
npm install
npm i jsonwebtoken
npm i mongoose
npm i bcrypt
npm i express
npm i nodemon

if anything not working correctly 
1) use -> nmp i -g instead
2) add -> "type" : "module"  above dependenices section in package.json

4. Run server
node script.js
or
nodemon script.js
```
Security Best Practices

Passwords are always hashed with bcrypt.

Password updates require old password verification.

JWT tokens protect routes.

Role-based middleware prevents unauthorized actions.

Email confirmation required before placing orders.
