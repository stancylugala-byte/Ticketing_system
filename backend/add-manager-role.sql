-- Run this once in MySQL Workbench to add the Manager role to the users table ENUM
ALTER TABLE `sts`.`users`
MODIFY COLUMN `role` ENUM('Client', 'SupportOfficer', 'Developer', 'Manager', 'Admin')
NOT NULL DEFAULT 'Client';
