# Data Dictionary

## Users Table
| Field Name     | Data Type   | Constraints                    | Description                                    |
|----------------|-------------|--------------------------------|------------------------------------------------|
| id             | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each user               |
| username       | TEXT        | NOT NULL, UNIQUE               | User's chosen username                        |
| email          | TEXT        | NOT NULL, UNIQUE               | User's email address                          |
| password_hash  | TEXT        | NOT NULL                       | Hashed password for user security             |
| is_admin       | INTEGER     | DEFAULT 0                      | Flag for admin privileges (0 = No, 1 = Yes)    |
| last_login     | TEXT        |                                | Timestamp of last login                       |
| session_token  | TEXT        |                                | Session token used for user authentication    |
| created_at     | TEXT        | NOT NULL                       | Timestamp of when the user was created        |

## Services Table
| Field Name    | Data Type   | Constraints                    | Description                                    |
|---------------|-------------|--------------------------------|------------------------------------------------|
| id            | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each service            |
| name          | TEXT        | NOT NULL                       | Name of the service                           |
| description   | TEXT        |                                | Detailed description of the service           |
# Data Dictionary

## Users Table
| Field Name     | Data Type   | Constraints                    | Description                                    |
|----------------|-------------|--------------------------------|------------------------------------------------|
| id             | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each user               |
| username       | TEXT        | NOT NULL, UNIQUE               | User's chosen username                        |
| email          | TEXT        | NOT NULL, UNIQUE               | User's email address                          |
| password_hash  | TEXT        | NOT NULL                       | Hashed password for user security             |
| is_admin       | INTEGER     | DEFAULT 0                      | Flag for admin privileges (0 = No, 1 = Yes)    |
| last_login     | TEXT        |                                | Timestamp of last login                       |
| session_token  | TEXT        |                                | Session token used for user authentication    |
| created_at     | TEXT        | NOT NULL                       | Timestamp of when the user was created        |

## Services Table
| Field Name    | Data Type   | Constraints                    | Description                                    |
|---------------|-------------|--------------------------------|------------------------------------------------|
| id            | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each service            |
| name          | TEXT        | NOT NULL                       | Name of the service                           |
| description   | TEXT        |                                | Detailed description of the service           |
| price         | REAL        | NOT NULL                       | Price of the service                          |
| updated_at    | TEXT        | NOT NULL                       | Timestamp of when the service was last updated|

## Blog Posts Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each blog post          |
| title        | TEXT        | NOT NULL                       | Title of the blog post                        |
| content      | TEXT        | NOT NULL                       | Content of the blog post                      |
| author_id    | INTEGER     | FOREIGN KEY (users(id))        | ID of the user who authored the blog post     |
| image_url    | TEXT        |                                | URL of the image associated with the blog post|
| created_at   | TEXT        | NOT NULL                       | Timestamp of when the blog post was created   |
| updated_at   | TEXT        | NOT NULL                       | Timestamp of the last blog post update        |

## Refresh Tokens Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each refresh token      |
| user_id      | INTEGER     | FOREIGN KEY (users(id))        | ID of the user associated with the refresh token |
| token        | TEXT        | NOT NULL                       | The refresh token                             |
| created_at   | DATETIME    | DEFAULT CURRENT_TIMESTAMP      | Timestamp of when the refresh token was created|

## Feedback Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each feedback entry     |
| user_id      | INTEGER     | FOREIGN KEY (users(id))        | ID of the user who left the feedback          |
| content      | TEXT        | NOT NULL                       | Content of the feedback                       |
| status       | TEXT        | DEFAULT 'pending'              | Status of the feedback (e.g., 'pending', 'resolved') |
| image_url    | TEXT        |                                | URL of the image associated with the feedback |
| created_at   | TEXT        | NOT NULL                       | Timestamp of when the feedback was created    |

| price         | REAL        | NOT NULL                       | Price of the service                          |
| updated_at    | TEXT        | NOT NULL                       | Timestamp of when the service was last updated|

## Blog Posts Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each blog post          |
| title        | TEXT        | NOT NULL                       | Title of the blog post                        |
| content      | TEXT        | NOT NULL                       | Content of the blog post                      |
| author_id    | INTEGER     | FOREIGN KEY (users(id))        | ID of the user who authored the blog post     |
| image_url    | TEXT        |                                | URL of the image associated with the blog post|
| created_at   | TEXT        | NOT NULL                       | Timestamp of when the blog post was created   |
| updated_at   | TEXT        | NOT NULL                       | Timestamp of the last blog post update        |

## Refresh Tokens Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each refresh token      |
| user_id      | INTEGER     | FOREIGN KEY (users(id))        | ID of the user associated with the refresh token |
| token        | TEXT        | NOT NULL                       | The refresh token                             |
| created_at   | DATETIME    | DEFAULT CURRENT_TIMESTAMP      | Timestamp of when the refresh token was created|

## Feedback Table
| Field Name   | Data Type   | Constraints                    | Description                                    |
|--------------|-------------|--------------------------------|------------------------------------------------|
| id           | INTEGER     | PRIMARY KEY, AUTOINCREMENT     | Unique identifier for each feedback entry     |
| user_id      | INTEGER     | FOREIGN KEY (users(id))        | ID of the user who left the feedback          |
| content      | TEXT        | NOT NULL                       | Content of the feedback                       |
| status       | TEXT        | DEFAULT 'pending'              | Status of the feedback (e.g., 'pending', 'resolved') |
| image_url    | TEXT        |                                | URL of the image associated with the feedback |
| created_at   | TEXT        | NOT NULL                       | Timestamp of when the feedback was created    |

