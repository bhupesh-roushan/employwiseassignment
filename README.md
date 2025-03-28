# User Management Application

A React application that integrates with the Reqres API to perform basic user management functions. The application includes authentication, user listing with pagination, and user management features (edit/delete).

## Features

- User authentication
- Paginated user listing
- User profile editing
- User deletion
- Responsive design
- Protected routes
- Token-based authentication

## Technologies Used

- React
- Vite
- TailwindCSS
- React Router
- Context API
- Axios

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
src/
├── components/
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   └── Users.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```

## Features Implementation

### Level 1: Authentication
- Login screen with email and password
- Token storage in localStorage
- Protected routes
- Automatic redirection to login page when token is missing

### Level 2: User Listing
- Paginated display of users
- Responsive grid layout
- User information display (avatar, name, email)
- Navigation between pages

### Level 3: User Management
- Edit user information
- Delete user with confirmation
- Success/error message handling
- Real-time updates after operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
