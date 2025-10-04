/*
  # Book Review Platform - Complete Database Schema

  ## Overview
  Creates a complete database schema for a book review platform with user authentication,
  book management, and review system with automatic rating calculations.

  ## Tables Created

  ### 1. profiles
  Extends Supabase auth.users with additional profile information
  - `id` (uuid, primary key, references auth.users)
  - `name` (text, required)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. books
  Stores book information and metadata
  - `id` (uuid, primary key)
  - `title` (text, required)
  - `author` (text, required)
  - `description` (text)
  - `genre` (text)
  - `year` (integer)
  - `added_by` (uuid, references profiles)
  - `avg_rating` (numeric, computed from reviews)
  - `reviews_count` (integer, computed from reviews)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. reviews
  Stores user reviews and ratings for books
  - `id` (uuid, primary key)
  - `book_id` (uuid, references books)
  - `user_id` (uuid, references profiles)
  - `rating` (integer, 1-5)
  - `review_text` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - **UNIQUE CONSTRAINT**: (book_id, user_id) - one review per user per book

  ## Functions

  ### update_book_ratings()
  Automatically recalculates avg_rating and reviews_count when reviews change
  Triggered after INSERT, UPDATE, or DELETE on reviews table

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with policies for:
  - Public read access to books and reviews
  - Authenticated users can create profiles, books, and reviews
  - Users can only update/delete their own content

  ## Indexes
  - books: title, author, genre, avg_rating, created_at
  - reviews: book_id, user_id, created_at
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  genre text,
  year integer,
  added_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  avg_rating numeric(3,2) DEFAULT 0.00,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table with unique constraint
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(book_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_avg_rating ON books(avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Function to automatically update book ratings
CREATE OR REPLACE FUNCTION update_book_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update avg_rating and reviews_count for the affected book
  UPDATE books
  SET 
    avg_rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ), 0),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update book ratings after review changes
DROP TRIGGER IF EXISTS trigger_update_book_ratings ON reviews;
CREATE TRIGGER trigger_update_book_ratings
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_book_ratings();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Books policies
CREATE POLICY "Books are viewable by everyone"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Book creators can update their books"
  ON books FOR UPDATE
  TO authenticated
  USING (auth.uid() = added_by)
  WITH CHECK (auth.uid() = added_by);

CREATE POLICY "Book creators can delete their books"
  ON books FOR DELETE
  TO authenticated
  USING (auth.uid() = added_by);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Review authors can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Review authors can delete their reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);