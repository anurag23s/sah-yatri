# 🌍 Sah-Yatri  
### **Smart Cab-Pooling & Ride-Share Web App (MERN Stack)**  

Sah-Yatri is a real-world ride-sharing and cab-pooling platform built using the MERN stack.  
It enables students and professionals to **offer rides, find rides, manage requests, join cab groups**, and safely connect with verified users.

This project focuses on **safety, transparency, and convenience**, with features like profile completion checks, email-based password reset, request moderation, and protected routes.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based login & registration  
- Protected routes (backend + frontend)  
- Password hashing (bcrypt)  
- Forgot & Reset Password (via email using Nodemailer)  
- Profile completion enforcement (temp token flow)

---

### 🚗 Offer a Ride
Ride owners can:
- Create a ride with pickup, destination, date, seats  
- View all rides they have offered  
- Manage pending requests  
- Accept / Reject ride requests  
- Mark a ride as completed  

---

### 🧭 Find Rides
Users can:
- Browse all active rides  
- View full ride details  
- Request to join a ride  
- Track request status (Pending / Accepted / Rejected)

---

### 👥 Requests Management
- Ride owners can manage all incoming requests  
- Requesters are notified of acceptance/rejection  
- Prevents duplicate requests  
- Ensures only owners can modify ride requests  

---

### 🔒 Contact Sharing Logic
Contact details (email/phone) are only visible when:
- You are the ride owner **or**
- Your request is **accepted**

All other users see **Access Denied**.

---

### 👤 Profile Management
- View and update profile  
- Add bio, gender, contact details  
- Mark contact as verified  
- Securely stored user info  

---

### 🧩 Cab Groups (Optional Feature)
- Create cab groups  
- Join/leave groups  
- View group members  
- Coordinate rides easily  

---

## 🏗️ Tech Stack

### **Frontend**
- React.js  
- React Router  
- Axios  
- TailwindCSS  
- Context API & LocalStorage Authentication  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Bcrypt  
- Nodemailer  

---

## 💡 Why Sah-Yatri?

- Solves daily travel issues for students & employees  
- Reduces cost through cab sharing  
- Avoids WhatsApp group chaos  
- Ensures safety via verified profiles  
- Transparent request handling  
- Clean & intuitive UI  

---

## 🚀 Future Enhancements
- Real-time notifications  
- In-app chat (Socket.io)  
- Live location tracking  
- Payment splitting  
- Rating and reviews  
