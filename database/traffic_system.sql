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

-- ========================================================
-- Seed Initial Demo Data
-- ========================================================

-- 1. Seed Users (passwords: admin123, police123, user123)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `phone`, `address`, `role`, `status`) VALUES
(1, 'System Administrator', 'admin@traffic.gov.in', '$2a$10$AvBU2VO7CHHU5PxFT8f5oOqPyECapSJ95/enPhoZAWDn8TEEOpUJ.', '9876543210', 'Traffic HQ, City Center', 'admin', 'active'),
(2, 'Inspector R. Kumar', 'officer.kumar@police.gov.in', '$2a$10$Vldhs/C3OLtmVPGv9QNVdeEG7mhpE8Dr2.heWvzj.zW9Om/bUUAce', '9876543211', 'Central Police Station', 'police', 'active'),
(3, 'Sub-Inspector Priya Sharma', 'officer.priya@police.gov.in', '$2a$10$Vldhs/C3OLtmVPGv9QNVdeEG7mhpE8Dr2.heWvzj.zW9Om/bUUAce', '9876543212', 'West Traffic Division', 'police', 'active'),
(4, 'John Doe', 'john.doe@example.com', '$2a$10$rjaYLc75tNg9aUtpjups6O2b4WNGtPvXKpaZPD.A0OSacBxveG70q', '9876543213', '12 Park Avenue, Metro City', 'citizen', 'active'),
(5, 'Sarah Smith', 'sarah.smith@example.com', '$2a$10$rjaYLc75tNg9aUtpjups6O2b4WNGtPvXKpaZPD.A0OSacBxveG70q', '9876543214', '45 Green Ridge', 'citizen', 'active')
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- 2. Seed Police Officers
INSERT INTO `police_officers` (`id`, `user_id`, `badge_number`, `station_name`, `rank`, `zone`) VALUES
(1, 2, 'POL-4092', 'Central Police Station', 'Inspector', 'Central Zone'),
(2, 3, 'POL-5011', 'West Traffic Division', 'Sub-Inspector', 'West Zone')
ON DUPLICATE KEY UPDATE `badge_number`=VALUES(`badge_number`);

-- 3. Seed Vehicles
INSERT INTO `vehicles` (`id`, `vehicle_number`, `owner_name`, `vehicle_type`, `model`, `color`, `registration_date`) VALUES
(1, 'TN 01 AB 1234', 'John Doe', 'Car', 'Honda City', 'Midnight Blue', '2021-05-15'),
(2, 'TN 09 CB 5678', 'John Doe', 'Two Wheeler', 'Yamaha FZ', 'Matte Black', '2022-08-20'),
(3, 'TN 02 XY 9999', 'Sarah Smith', 'Car', 'Hyundai Creta', 'Polar White', '2023-01-10'),
(4, 'MH 12 DL 4321', 'Rajesh Patel', 'Commercial Truck', 'Tata Signa', 'Yellow', '2019-11-05')
ON DUPLICATE KEY UPDATE `owner_name`=VALUES(`owner_name`);

-- 4. Seed Violations
INSERT INTO `violations` (`id`, `violation_number`, `vehicle_number`, `vehicle_type`, `violation_type`, `location`, `violation_date`, `violation_time`, `description`, `fine_amount`, `status`, `evidence_image`, `reported_by_police_id`, `user_id`) VALUES
(1, 'VIO-2026-001', 'TN 01 AB 1234', 'Car', 'Speeding', 'Anna Salai Junction, Central Sector', '2026-03-01', '10:30:00', 'Vehicle clocked at 92 km/h in a designated 50 km/h urban speed limit zone.', 2000.00, 'Approved', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop', 1, 4),
(2, 'VIO-2026-002', 'TN 01 AB 1234', 'Car', 'Signal Jump', 'Mount Road Traffic Signal 4', '2026-03-05', '14:15:00', 'Crossed red light traffic intersection while traffic was moving.', 1500.00, 'Pending Verification', 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop', 1, 4),
(3, 'VIO-2026-003', 'TN 09 CB 5678', 'Two Wheeler', 'No Helmet', 'GST Road Flyover, Guindy', '2026-02-18', '09:45:00', 'Rider operating motor two-wheeler without standard protective headgear.', 1000.00, 'Paid', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop', 2, 4),
(4, 'VIO-2026-004', 'TN 02 XY 9999', 'Car', 'Wrong Parking', 'T-Nagar Commercial Plaza Road', '2026-03-08', '16:20:00', 'Parked in no-parking tow-away zone obstructing emergency access lane.', 500.00, 'Approved', 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop', 2, 5),
(5, 'VIO-2026-005', 'MH 12 DL 4321', 'Commercial Truck', 'Drunk Driving', 'NH-44 Toll Plaza Checkpoint', '2026-03-10', '23:10:00', 'Breathalyzer test recorded 0.08% BAC exceeding maximum allowable legal limits.', 10000.00, 'Approved', 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop', 1, NULL),
(6, 'VIO-2026-006', 'TN 01 AB 1234', 'Car', 'Mobile Phone Usage', 'Kamarajar Salai Beach Road', '2026-02-10', '18:30:00', 'Driver holding and speaking on mobile phone while driving through intersection.', 1500.00, 'Rejected', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop', 2, 4)
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- 5. Seed Payments
INSERT INTO `payments` (`id`, `payment_number`, `violation_id`, `user_id`, `amount`, `payment_method`, `transaction_id`, `status`) VALUES
(1, 'PAY-2026-8801', 3, 4, 1000.00, 'UPI', 'TXN9928103948', 'PAID')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- 6. Seed Notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`) VALUES
(1, 4, 'Violation Alert', 'A new violation VIO-2026-002 has been logged for vehicle TN 01 AB 1234.', 0),
(2, 4, 'Payment Confirmation', 'Payment of ₹1,000.00 for violation VIO-2026-003 was successfully received.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

