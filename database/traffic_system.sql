-- Smart Traffic Violation Reporting System Database Schema
CREATE DATABASE IF NOT EXISTS `traffic_violation_system`;
USE `traffic_violation_system`;

-- Table 1: Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `address` TEXT,
  `role` ENUM('citizen', 'police', 'admin') DEFAULT 'citizen',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 2: Police Officers
CREATE TABLE IF NOT EXISTS `police_officers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `badge_number` VARCHAR(50) NOT NULL UNIQUE,
  `station_name` VARCHAR(100) NOT NULL,
  `rank` VARCHAR(50) DEFAULT 'Inspector',
  `zone` VARCHAR(50) DEFAULT 'Central Zone',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_police_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 3: Vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `vehicle_number` VARCHAR(30) NOT NULL UNIQUE,
  `owner_name` VARCHAR(100) NOT NULL,
  `vehicle_type` VARCHAR(50) NOT NULL,
  `model` VARCHAR(100),
  `color` VARCHAR(50),
  `registration_date` DATE,
  INDEX `idx_vehicles_number` (`vehicle_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4: Violations
CREATE TABLE IF NOT EXISTS `violations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `violation_number` VARCHAR(50) NOT NULL UNIQUE,
  `vehicle_number` VARCHAR(30) NOT NULL,
  `vehicle_type` VARCHAR(50) NOT NULL,
  `violation_type` ENUM(
    'Speeding',
    'Signal Jump',
    'No Helmet',
    'No Seat Belt',
    'Wrong Parking',
    'Drunk Driving',
    'Driving Without License',
    'Triple Riding',
    'Wrong Side Driving',
    'Mobile Phone Usage'
  ) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `violation_date` DATE NOT NULL,
  `violation_time` TIME NOT NULL,
  `description` TEXT,
  `fine_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Pending Verification', 'Approved', 'Rejected', 'Paid') DEFAULT 'Pending Verification',
  `evidence_image` VARCHAR(255),
  `reported_by_police_id` INT NULL,
  `user_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_violations_vehicle` (`vehicle_number`),
  INDEX `idx_violations_status` (`status`),
  INDEX `idx_violations_date` (`violation_date`),
  CONSTRAINT `fk_violations_police` FOREIGN KEY (`reported_by_police_id`) REFERENCES `police_officers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_violations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 5: Payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_number` VARCHAR(50) NOT NULL UNIQUE,
  `violation_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('UPI', 'Card', 'Net Banking') NOT NULL,
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('PAID', 'FAILED') DEFAULT 'PAID',
  CONSTRAINT `fk_payments_violation` FOREIGN KEY (`violation_id`) REFERENCES `violations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 6: Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
