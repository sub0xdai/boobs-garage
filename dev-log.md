# 10.29
- Set up structure of project yesterday
    - Architecture:
        - Vite React frontend lurking on port 5173
        - Express backend stalking port 5000
        - SQLite DB 
- Basic frontend with dependancies and dynamic ui 
- Created essential components and enhanced them
- Set up strucutre for backend
- Imported dictionary (SQLite)
- Fixed tailwind issue
- Added form handling and validation
- Setup state management for auth
- Setup backend
- Setup auth routes and controllers
- Tested using curl and postman

# 10.31 
- JWT tokens 
- Protected routes 
- Auth context
- Tested user in DB 
- Login mechanism is purring like a kitten 
- Registration system works
- Navbar now with ID crisis management 
- Login form has functionality 
- Hooks extracted and isolated 

## Next 
- User sessions
- Admin priviliges 
- Form validation
- Add assets
- Different themes/selector


# 11.01
- User sessions
- From validation 
- Admin priviliges

# 11.04
- Implemented full dashboard with tab interface
- Created components for services, users, blog, feedback
- Set up protected admin routes
- Implemented inline editing 
- Added image support for blogs 
- Created filtering system for feedback 
- Set up backend routes for all admin functions

## Issues
- Light and dark mode need to be standard for each component 
- Atm light mode doesnt really work, dark mode only effects the navbar. Site is optimised for darkmode but the dark mode doesn't redner across the site

# 11.06
- [x] Complete theme context implementation
- [x] Complete remaining admin functionality
- [x] Add loading states and error handling if appropriate
- [ ] User customization feature
- [x] Test

# 11.07
- Auth flow
- Admin dashboard
- Security improvements
- Documentation (api endpoint)
- Enhanced error handling
- JWT token validation issue 
- Implemented token refresh mechanism

## Issues 
- Error creating service: {"message":"Invalid session"} - resolved
- Cannot create a service after logging in as admin. Still debugging this process - resolved
- Testing, iterating, and logging errors in the console -resolved


## Issues
- When I log in to admin dashboard, it is not displaying the correct behavio - resolved

# 11.08
- Admin dashboard
- Fixed session middleware authentication by separating user lookup and last_login update to avoid "no such     column" error in SQLite
- Fixed service creation by adding try-catch blocks for price validation and API requests, resolving syntax errors that blocked form submission
- Standardized UserManager component by implementing consistent styling with ServicesManager, adding dark mode support, and improving error handling while maintaining core user management functionality

## Issues 
    Issue: useAuth must be used within an AuthProvider error when using useAuth in the Navbar component.
    Cause: Navbar component is attempting to access authentication context outside of the AuthProvider.
    Error Locations:
        useAuth.js:8
        Navbar.jsx:23
    Current Action: Working on the blog section of the admin dashboard, implementing authentication-related features (user sessions, JWT tokens).
    Additional Errors: Issues with React's source maps and connections to Vite hot reloading.

# 11.09
- Resolved issues with AuthProvider and useAuth
- Fixed styling issues 
- All admin components are now standardised and seemingly work 
- Created feedback section and button on navbar
- Feedback form works admin and client side (yet to try to post with image) 

## Issues
- File uploads are causing a 500 error due to server misconfiguration in handling or storing uploaded files
- Logout returns 401 Unauthorized, possibly due to missing session/token clearance, frontend state not updating, or incorrect CORS/cookie settings - resolved

# 11.10
- Fix issues
- Verify feedback management 
- UI improvements
- Refactored code to ES from common JS on server side

## Issues 
- Error likely caused by improper handling of asynchronous database connections or incorrect module imports/exports after refactoring to ES modules. DB not connecting after refactoring - resolved

# Task List

## Critical Features
1. Feedback System
   - [x] Test feedback creation with images
   - [x] Verify admin feedback management (delete working)
   - [x] Test feedback notifications

2. Blog System
   - [x] Complete blog post creation with images
   - [x] Test blog post editing
   - [x] Verify blog deletion
   - [x] Add blog listing page

3. Services Page
   - [ ] Complete price updates functionality
   - [ ] Add service categories (if required)
   - [ ] Test service image uploads

## Authentication & Security
1. User Management
   - [ ] Verify password reset flow
   - [ ] Test user profile updates
   - [ ] Complete admin user management

2. Authorization
   - [ ] Test role-based access
   - [ ] Verify protected routes
   - [ ] Test token refresh mechanism

## UI/UX
1. Dark Mode
   - [x] Test all components in dark mode
   - [x] Fix any remaining dark mode issues

2. Responsive Design
   - [ ] Test on mobile devices
   - [ ] Test tablet layouts
   - [ ] Fix any responsive issues

## Testing
1. Integration Tests
   - [ ] Test all API endpoints
   - [ ] Test file uploads
   - [ ] Test auth flows

2. Error Handling
   - [ ] Add error boundaries
   - [ ] Improve error messages
   - [ ] Test network error scenarios

## Final Steps
1. Cleanup
   - [ ] Remove console.logs
   - [ ] Clean up comments
   - [ ] Organize imports

2. Documentation
   - [ ] Update README
   - [ ] Add API documentation
   - [ ] Add setup instructions


# 11.11
_Blog Posts_
- Image URL instead of upload 
- Does not reflect on client side 
- Blog functionality is just placeholders for now, need to add dynamic functionality
- Will need to do similar for services
- After this is just testing and cleanup

## Todo 
### Services
Primary: "Bob wants to be able to change the prices on the site without contacting the webmaster"
- Need to implement price update functionality first
- Service images are secondary but similar to blog implementation
- Categories can be added if time permits

### Authentication & Security
Most Critical:
- Verify protected routes (required by brief)
- Test role-based access (admin vs user permissions)
- Token refresh mechanism (already partially implemented in fetchWithAuth.js)

Less Critical:
- Password reset (not mentioned in brief)
- User profile updates (not specifically required)
- Admin user management (basic admin exists)
