# User Management Application

A React application that integrates with the Reqres API to perform basic user management functions. The application includes authentication, user listing with pagination, and user management features (edit/delete).

## Live Demo
[View Live Demo](http://employwise-eta.vercel.app/)

## GitHub Repository
[View Source Code](https://github.com/bhupesh-roushan/employwiseassignment)

## Features

- User Authentication
  - Secure login system
  - Token-based authentication
  - Protected routes
  - Automatic redirection to login page
  - Persistent session management

- User Management
  - View user profiles with avatars
  - Edit user information (first name, last name, email)
  - Delete users with confirmation dialog
  - Real-time updates after operations
  - Success/error notifications using toast messages

- User Listing
  - Infinite scroll loading
  - Responsive grid layout (2 columns)
  - Search functionality (by name or email)
  - Loading states with spinners
  - "No more users" indicator

- UI/UX Features
  - Modern and clean design
  - Responsive layout for all screen sizes
  - Smooth animations and transitions
  - Interactive hover effects
  - Custom delete confirmation dialog
  - Loading indicators
  - Error handling with user-friendly messages

- Additional Features
  - Client-side search and filtering
  - Lazy loading for better performance
  - Toast notifications for user feedback
  - Error boundary handling
  - Responsive navigation bar

## Technologies Used

- React
- Vite
- TailwindCSS
- React Router
- Context API
- Axios
- React Hot Toast

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The application uses the following Reqres API endpoints:

- POST /api/login - User authentication
- GET /api/users - Fetch users list
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user

## Default Credentials

- Email: eve.holt@reqres.in
- Password: cityslicka

## Project Structure

```
├── public/
│   └── react.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Users.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Features Implementation

### Level 1: Authentication
- Login screen with email and password
- Token storage in localStorage
- Protected routes
- Automatic redirection to login page when token is missing

### Level 2: User Listing
- Infinite scroll loading
- Responsive grid layout
- User information display (avatar, name, email)
- Search and filtering functionality
- Loading states and indicators

### Level 3: User Management
- Edit user information
- Delete user with custom confirmation dialog
- Success/error toast notifications
- Real-time updates after operations
- Client-side search and filtering


