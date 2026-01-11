CREATE DATABASE IF NOT EXISTS srms;

USE srms;

CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT,
  course VARCHAR(100)
);

-- Insert a default admin user (username: admin, password: admin123)
INSERT INTO admin (username, password) VALUES ('admin', '$2b$10$5ezhOW3p6YxhJXoGhNBefeeebB3WhIb5FUBhWSgi7o3O9VqaDVwHO') ON DUPLICATE KEY UPDATE username=username;