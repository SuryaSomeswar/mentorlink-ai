# 🎓 MentorLink AI – Smart Alumni-Student Mentorship Scheduler

MentorLink AI is a modern mentorship scheduling platform that connects students with alumni mentors for career guidance, knowledge sharing, and professional networking.

Built with Firebase Authentication, Cloud Firestore, Vanilla JavaScript, HTML5, and Tailwind CSS, the platform enables real-time mentorship session booking, profile management, and role-based dashboards.

---

## 🚀 Features

### Authentication

* User Registration
* User Login
* Secure Firebase Authentication
* Role-Based Access Control

  * Student
  * Alumni

### Student Features

* Discover Alumni Mentors
* Search Alumni by Name
* Search Alumni by Email
* View Alumni Profiles
* Book Mentorship Sessions
* View Upcoming Sessions

### Alumni Features

* View Session Requests
* View Upcoming Sessions
* Manage Profile Information
* Real-Time Booking Updates

### Booking System

* Date Selection
* Time Slot Selection
* Session Scheduling
* Duplicate Booking Prevention
* Real-Time Firestore Synchronization

### Profile Management

* Update Name
* Update Bio
* Update Profile Image URL
* Real-Time Profile Updates

### User Experience

* Responsive Design
* Glassmorphism UI
* Dark Mode Support
* Toast Notifications
* Real-Time Updates
* Mobile Friendly Layout

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* Tailwind CSS
* Vanilla JavaScript (ES6+)

### Backend

* Firebase Authentication
* Firebase Cloud Firestore

### Architecture

* Single Page Application (SPA)
* Component-Based Rendering
* Event Driven UI
* Real-Time Data Synchronization

---

## 📂 Project Structure

```text
MentorLink-AI/
│
├── index.html
├── app.js
└── README.md
```

---

## 🔥 Firebase Services Used

### Authentication

* createUserWithEmailAndPassword
* signInWithEmailAndPassword
* signOut
* onAuthStateChanged

### Firestore

Collections:

### users

```json
{
  "uid": "",
  "fullName": "",
  "email": "",
  "role": "",
  "profilePhoto": "",
  "bio": "",
  "createdAt": ""
}
```

### bookings

```json
{
  "bookingId": "",
  "studentId": "",
  "studentName": "",
  "alumniId": "",
  "alumniName": "",
  "date": "",
  "time": "",
  "status": "Confirmed",
  "createdAt": ""
}
```

---

## 💻 Local Development

Run the project using VS Code Live Server.

Local URL:

```text
http://127.0.0.1:5500/index.html
```

---

## ⚙️ Firebase Setup

1. Create a Firebase Project
2. Enable Authentication
3. Enable Email/Password Sign-In
4. Create Firestore Database
5. Configure Firestore Rules
6. Copy Firebase Configuration
7. Paste Configuration Inside app.js

---

## 📸 Screenshots

Add screenshots here after deployment.

Suggested screenshots:

* Login Page
* Signup Page
* Student Dashboard
* Alumni Dashboard
* Session Booking Modal
* Sessions Page
* Profile Page

---

## 🎯 Future Enhancements

* Session Rescheduling
* Session Cancellation
* Firebase Storage Integration
* Email Notifications
* Admin Dashboard
* Alumni Availability Management
* Google Authentication
* Video Meeting Integration

---

## 👨‍💻 Author

**Shannu**

Passionate about Web Development, AI, and Building Real-World Applications.

GitHub: https://github.com/

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
