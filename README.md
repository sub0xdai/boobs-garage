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
+  │   │   │   └── BlogManager.jsx    # Blog post management
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Blog.jsx
+   │   │   │   └── BlogPost.jsx    # Individual post view
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminDashboard.jsx
└── server/                # Backend Express application
    ├── src/
    │   ├── routes/       # API routes
    │   │   ├── authRoutes.js
    │   │   ├── serviceRoutes.js
+   │   │   └── blogRoutes.js    # Blog CRUD operations
    │   ├── middleware/   # Express middleware
    │   │   ├── sessionMiddleware.js
    │   │   ├── adminMiddleware.js
+   │   │   └── multerConfig.js    # File upload handling
+   ├── uploads/         # Media storage directory
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

5. Backend:
```javascript
backend: {
  runtime: "Node.js",
  framework: "Express",
  database: "SQLite",
  auth: "JWT",
  security: {
    password: "bcryptjs",
    middleware: "express-validator"
  },
+ fileUploads: "multer"
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

