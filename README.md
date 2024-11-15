
# Bob's Garage Technical Architecture

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, React Hook Form, Yup
- **Backend**: Node.js, Express, SQLite, JWT, bcryptjs, express-validator

## Project Structure
- `client/`: React app with pages, components, context, and utils
- `server/`: Express app with routes, controllers, middleware, and models

## Key Features
1. **Authentication**: JWT-based auth with protected routes
2. **Theme System**: Tailwind-powered dark/light modes with the 'nord' palette
3. **Database**: SQLite for storing users, services, blog posts, feedback
4. **File Uploads**: Multer-based handling for blog images

## Configuration
- **Vite**: HMR, React plugin, source maps
- **Tailwind**: Dark mode, custom colors, content paths
- **Server**: ENV vars, DB connection, JWT secret, CORS

## Development Tools
- **IDE**: VSCode/nvim
- **Version Control**: Git
- **API Testing**: Postman
- **Debugging**: Browser DevTools
- **DB Management**: SQLite Browser
