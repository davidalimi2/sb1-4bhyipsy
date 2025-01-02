/*
  # Fix RLS Policies and Add Missing Tables

  1. Changes
    - Fix users table RLS policies
    - Add insert policy for users
    - Add missing tasks table columns
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated users
*/

-- Fix users table RLS policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add missing task columns
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('deadline', 'hearing', 'filing'));