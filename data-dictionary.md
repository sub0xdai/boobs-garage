# Bob's Garage Data Dictionary

## Users Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each user |
| username | VARCHAR(50) | NOT NULL, UNIQUE | User's chosen username |
| email | VARCHAR(100) | NOT NULL, UNIQUE | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password for security |
| is_admin | BOOLEAN | DEFAULT FALSE | Flag for admin privileges |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of user creation |

## Services Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each service |
| name | VARCHAR(100) | NOT NULL | Name of the service |
| description | TEXT | | Detailed description of the service |
| price | DECIMAL(10, 2) | NOT NULL | Price of the service |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of service creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of last update |

## Blog Posts Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each blog post |
| title | VARCHAR(255) | NOT NULL | Title of the blog post |
| content | TEXT | NOT NULL | Content of the blog post |
| author_id | INTEGER | REFERENCES users(id) | ID of the user who wrote the post |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of post creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of last update |

## Feedback Table
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier for each feedback |
| user_id | INTEGER | REFERENCES users(id) | ID of the user who left the feedback |
| content | TEXT | NOT NULL | Content of the feedback |
| rating | INTEGER | CHECK (rating >= 1 AND rating <= 5) | Rating given by the user |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Time of feedback submission |
