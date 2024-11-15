# Bob's Garage

Bob's Garage is a full-stack web application that provides an online presence for a mechanics workshop. It allows customers to view services, prices, staff information, and company history, as well as leave feedback and read blog posts. The application also enables the workshop owner, Bob, to easily update prices and post blog content.

## Features
- Public-facing pages for company info, services, and blog
- User authentication and authorization
- Customer feedback system with image support
- Admin dashboard for managing services, blog, and user feedback

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, React Hook Form, Yup
- **Backend**: Node.js, Express, SQLite, JWT, bcryptjs, express-validator

## Project Structure
- `client/`: React app with pages, components, context, and utils
- `server/`: Express app with routes, controllers, middleware, and models

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher)
- SQLite

### Installation
1. Clone the repository:
   ```
   git clone git@github.com:sub0xdai/boobs-garage.git
   ```
2. Navigate to the project directory:
   ```
   cd boobs-garage
   ```
3. Install the dependencies:
   - For the client:
     ```
     cd client
     npm install
     ```
   - For the server:
     ```
     cd server
     npm install
     ```

### Running the Application
1. Start the backend server:
   ```
   cd server
   node server.js
   ```
2. Start the frontend development server:
   ```
   cd client
   npm run dev
   ```
3. The application should now be accessible at `http://localhost:5173`.

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




