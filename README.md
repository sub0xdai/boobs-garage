# Bob's Garage Technical Architecture

## Tech Stack
```javascript
frontend: {
  framework: "React (Vite)",
  styling: "Tailwind CSS",
  routing: "React Router v6",
  stateManagement: "Context API",
  theme: "Tailwind Dark Mode"
},

backend: {
  runtime: "Node.js",
  framework: "Express",
  database: "SQLite",
  auth: "JWT",
  security: {
    password: "bcryptjs",
    middleware: "express-validator"
  }
}
```

## Project Structure
```
bobs-garage/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── admin/    # Admin-specific components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── context/      # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/        # Custom React hooks
│   │   │   └── useAuth.js
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                # Backend Express application
    ├── src/
    │   ├── config/       # Configuration files
    │   │   └── database.js
    │   ├── controllers/  # Route controllers
    │   │   └── authController.js
    │   ├── middleware/   # Express middleware
    │   │   ├── sessionMiddleware.js
    │   │   └── adminMiddleware.js
    │   ├── routes/       # API routes
    │   │   ├── authRoutes.js
    │   │   └── serviceRoutes.js
    │   └── db/          # SQLite database file
    ├── .env             # Environment variables
    └── server.js        # Main server file
```

## Key Features
1. Authentication Flow:
   ```javascript
   client -> JWT -> middleware -> protected routes
   ```

2. Theme System:
   ```javascript
   ThemeProvider -> Tailwind -> dark:classes
   ```

3. Database Schema:
```sql
tables: [
  users,
  services,
  blog_posts,
  feedback
]
```

4. Protected Routes:
```javascript
routes: {
  public: ["/", "/services", "/blog", "/contact"],
  auth: ["/profile", "/feedback"],
  admin: ["/admin/*"]
}
```

## Configuration Files
1. Vite Config (Frontend):
- Hot Module Replacement
- React plugin
- Source maps

2. Tailwind Config:
- Dark mode settings
- Custom colors
- Content paths

3. Server Config:
- Environment variables
- Database connection
- JWT secret
- CORS settings

## Development Tools
- VSCode/nvim for IDE
- Git for version control
- Postman for API testing
- Browser DevTools for debugging
- SQLite Browser for database management

