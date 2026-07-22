-- Run this once to add Google OAuth support to the users table
-- Safe to run multiple times (IF NOT EXISTS guards)

-- Add google_id column
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE AFTER reset_token_expires;

-- Allow password to be NULL (for OAuth users)
ALTER TABLE users
  MODIFY COLUMN password VARCHAR(255) NULL;
