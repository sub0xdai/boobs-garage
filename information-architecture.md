# Boobs Garage - Information Architecture Documentation

## 1. Site Structure Overview

### Navigation Hierarchy
| Level | Page Name | URL Path | Access Level | Parent Page |
|-------|-----------|----------|--------------|-------------|
| 1 | Home | / | Public | - |
| 1 | Services | /services | Public | - |
| 1 | Blog | /blog | Public | - |
| 1 | Contact | /contact | Public | - |
| 1 | About | /about | Public | - |
| 2 | About Us | /about/us | Public | About |
| 2 | Our Team | /about/team | Public | About |
| 1 | Staff | /staff | Public | - |
| 1 | Login | /login | Public | - |
| 1 | Register | /register | Public | - |
| 2 | Blog Post | /blog/:id | Public | Blog |
| 2 | Admin Dashboard | /admin | Admin Only | - |
| 2 | Feedback | /feedback | Public | - |
| 2 | Privacy Policy | /privacy | Public | Footer |
| 2 | Terms of Service | /terms | Public | Footer |

## 2. Page Details

### Home Page
- **Purpose**: Main landing page introducing the garage services
- **Key Components**:
  - Hero section
  - Featured services
  - Latest blog posts
  - Call to action buttons
- **Target Audience**: Potential customers, returning customers
- **Key Functionality**: Quick access to services, blog, and contact information

### Services Page
- **Purpose**: Showcase available garage services
- **Key Components**:
  - Service listings
  - Service descriptions
  - Pricing information
  - Booking/Contact options
- **Target Audience**: Customers looking for specific services
- **Key Functionality**: Service information, service requests

### Blog Page
- **Purpose**: Share automotive knowledge and garage updates
- **Key Components**:
  - Blog post listings
  - Categories
  - Search functionality
- **Target Audience**: Customers interested in automotive knowledge
- **Key Functionality**: Content browsing, sharing

### Contact Page
- **Purpose**: Allow customers to reach out
- **Key Components**:
  - Contact form
  - Location information
  - Business hours
  - Contact methods
- **Target Audience**: All users
- **Key Functionality**: Communication with the garage

### About Page
- **Purpose**: Share company information and values
- **Key Components**:
  - About Us section
    - Company history
    - Mission statement
    - Values
  - Our Team section
    - Team overview
    - Certifications
    - Expertise areas
- **Target Audience**: Potential customers, partners
- **Key Functionality**: Building trust and credibility

### Staff Page
- **Purpose**: Introduce the garage team
- **Key Components**:
  - Staff profiles
  - Expertise areas
  - Certifications
- **Target Audience**: Customers wanting to know the team
- **Key Functionality**: Team showcase

### Admin Dashboard
- **Purpose**: Manage website content and users
- **Key Components**:
  - Services manager
  - User manager
  - Blog manager
  - Feedback manager
  - Home image manager
- **Target Audience**: Admin users
- **Key Functionality**: Content management, user management

## 3. Component Relationships

### Shared Components
1. **Navbar**
   - Present on all pages
   - Contains main navigation links
   - Theme toggle
   - Authentication status

2. **Footer**
   - Present on all pages
   - Secondary navigation
     - About Us
     - Our Team
     - Privacy Policy
     - Terms of Service
   - Contact information
   - Social media links
     - Facebook
     - Twitter
     - Instagram
   - Feedback form link

3. **Layout**
   - Wraps all pages
   - Maintains consistent structure
   - Handles theme context

## 4. User Flows

### Public User Flow
1. Home → Services → Contact
2. Home → Blog → Individual Blog Post
3. Home → About → About Us
4. Home → About → Our Team

### Admin User Flow
1. Login → Admin Dashboard → Content Management
2. Admin Dashboard → Services Manager
3. Admin Dashboard → Blog Manager

## 5. Content Types

### Blog Posts
- Title
- Content
- Author
- Date
- Categories
- Featured image

### Services
- Service name
- Description
- Price range
- Service image
- Duration

### Feedback
- Customer name
- Rating
- Comment
- Date
- Service related

### User Profiles
- Username
- Email
- Role (Admin/User)
- Profile information

## 6. Technical Components

### Authentication
- Login system
- Registration system
- Protected routes
- Admin routes

### Theme System
- Light/Dark mode
- Theme persistence
- Styled components

### Responsive Design
- Mobile-first approach
- Breakpoints
- Navigation adaptation

## 7. Future Considerations
- [ ] Online booking system
- [ ] Customer portal
- [ ] Service history tracking
- [ ] Newsletter integration
- [ ] Live chat support

## 8. SEO & Metadata
| Page | Title | Description | Keywords |
|------|--------|-------------|-----------|
| Home | Boobs Garage - Professional Auto Services | Your trusted auto repair and service center | auto repair, garage, car service |
| Services | Our Services - Boobs Garage | Complete list of our professional auto services | car repair, maintenance, diagnostics |
| Blog | Auto Care Blog - Boobs Garage | Expert automotive tips and insights | car tips, auto maintenance, car care |
| Contact | Contact Us - Boobs Garage | Get in touch with our expert team | contact garage, auto service contact |
| About | About Us - Boobs Garage | Learn about our history and expertise | auto shop history, car experts |
| About Us | About Us - Boobs Garage | Company history, mission statement, and values | company history, mission statement, values |
| Our Team | Our Team - Boobs Garage | Meet our team of experts | team overview, certifications, expertise areas |
