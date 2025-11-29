# 🚗⛽ FuelEase – CNG & Petrol Station Slot Booking System

FuelEase is a modern web application that allows customers to **book time slots** at **CNG and Petrol stations**, reducing long queues and ensuring efficient service.  
Admins can manage stations, control capacity, monitor bookings, and update booking statuses.

Built with **Next.js, Prisma, Neon Database, Clerk Authentication, and TailwindCSS**.

---

## ⭐ Features

### 🔹 User Features
- Create an account & log in securely using **Clerk Auth**
- View available CNG/Petrol stations
- Select a time slot for refueling
- Prevent double-booking of the same time
- View personal bookings
- Receive approval/cancellation updates from admin

### 🔹 Admin Features
- Create new CNG/Petrol stations  
- Set station capacity (vehicles per slot)  
- View all bookings from all users  
- Approve, complete, or cancel bookings  
- Manage station and user data  
- Prevent overbooking based on station capacity  

---

## 🛠️ Tech Stack

| Category   | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Database  | PostgreSQL (Neon Serverless) |
| ORM       | Prisma |
| Auth      | Clerk |
| Styling   | TailwindCSS |
| Deployment| Vercel (recommended) |

---

## 📌 System Workflow

### 1️⃣ Admin creates a station
- Name, Address, Capacity  

### 2️⃣ User logs in using Clerk
- Clerk ID is synced to the database
- User profile is created automatically

### 3️⃣ User books a refueling slot
- Select station and time slot  
- System checks capacity & duplicate bookings  

### 4️⃣ Admin reviews bookings
- Approve, Complete, Cancel  

### 5️⃣ Users see updated booking status

---



