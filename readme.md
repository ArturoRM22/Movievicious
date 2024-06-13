# Setting Up the Project

# Clone the repository:
- git clone <repository-url>
- cd api
# Install dependencies:
- npm i
# Create a .env file in the root directory of the api with the following environment variables:
- HOST = localhost
- USER = root
- PASSWORD =
- DATABASE = movicious
- PORT =
- DB_PORT = 3306
- API_KEY_AUTH = token for access to The Movie Database API
- ACCESS_TOKEN_AUTH = token for access to The Movie Database API
# Ensure MySQL is configured (e.g., XAMPP, AMPPS, etc.).
# Create a database named movicious and add the following tables:

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Ranks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tmdb_id INT NOT NULL,
    ranking INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    UNIQUE (user_id, tmdb_id)
);

- cd api
- npm run dev



# Install
