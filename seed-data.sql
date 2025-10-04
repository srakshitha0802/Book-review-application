-- Book Review Platform - Sample Data Seed Script
-- Run this in your Supabase SQL Editor to populate the database with sample data

-- Note: You'll need to sign up first to create a user account
-- Then replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users

-- Insert sample profile (replace with your actual user ID)
-- INSERT INTO profiles (id, name) VALUES ('YOUR_USER_ID_HERE', 'Demo User');

-- Insert sample books
INSERT INTO books (title, author, description, genre, year, added_by) VALUES
(
  'The Great Gatsby',
  'F. Scott Fitzgerald',
  'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
  'Fiction',
  1925,
  NULL  -- Replace with your user ID if you want to own this book
),
(
  '1984',
  'George Orwell',
  'A dystopian social science fiction novel that explores themes of totalitarianism, surveillance, and individual freedom.',
  'Science Fiction',
  1949,
  NULL
),
(
  'To Kill a Mockingbird',
  'Harper Lee',
  'A gripping tale of racial injustice and childhood innocence set in the Depression-era South.',
  'Fiction',
  1960,
  NULL
),
(
  'Pride and Prejudice',
  'Jane Austen',
  'A romantic novel that explores the manners and matrimonial machinations of British high society in the early 19th century.',
  'Romance',
  1813,
  NULL
),
(
  'The Hobbit',
  'J.R.R. Tolkien',
  'A fantasy adventure following Bilbo Baggins on his unexpected journey with dwarves to reclaim their mountain home.',
  'Fantasy',
  1937,
  NULL
),
(
  'Harry Potter and the Sorcerer''s Stone',
  'J.K. Rowling',
  'The first book in the beloved series about a young wizard discovering his magical heritage.',
  'Fantasy',
  1997,
  NULL
),
(
  'The Da Vinci Code',
  'Dan Brown',
  'A mystery thriller following symbologist Robert Langdon as he investigates a murder in the Louvre Museum.',
  'Mystery',
  2003,
  NULL
),
(
  'The Catcher in the Rye',
  'J.D. Salinger',
  'A controversial novel following teenager Holden Caulfield''s experiences in New York City.',
  'Fiction',
  1951,
  NULL
),
(
  'Sapiens: A Brief History of Humankind',
  'Yuval Noah Harari',
  'An exploration of the history and impact of Homo sapiens on the world.',
  'Non-Fiction',
  2011,
  NULL
),
(
  'Educated',
  'Tara Westover',
  'A memoir about a young woman who grows up in a survivalist family and eventually escapes to pursue education.',
  'Biography',
  2018,
  NULL
),
(
  'The Martian',
  'Andy Weir',
  'A science fiction novel about an astronaut stranded on Mars who must use his ingenuity to survive.',
  'Science Fiction',
  2011,
  NULL
),
(
  'Gone Girl',
  'Gillian Flynn',
  'A psychological thriller about a woman who goes missing on her fifth wedding anniversary.',
  'Thriller',
  2012,
  NULL
);

-- Sample reviews (you'll need to replace 'YOUR_USER_ID_HERE' with your actual user ID)
-- Get book IDs first by querying: SELECT id, title FROM books;

-- Example reviews - uncomment and update IDs after creating books:
/*
INSERT INTO reviews (book_id, user_id, rating, review_text) VALUES
(
  (SELECT id FROM books WHERE title = 'The Great Gatsby' LIMIT 1),
  'YOUR_USER_ID_HERE',
  5,
  'A timeless classic that captures the essence of the American Dream. Fitzgerald''s prose is beautiful and the story is haunting.'
),
(
  (SELECT id FROM books WHERE title = '1984' LIMIT 1),
  'YOUR_USER_ID_HERE',
  5,
  'A chilling and prophetic vision of a totalitarian future. More relevant today than ever before.'
),
(
  (SELECT id FROM books WHERE title = 'The Hobbit' LIMIT 1),
  'YOUR_USER_ID_HERE',
  5,
  'A delightful adventure that appeals to readers of all ages. Tolkien created a rich and immersive world.'
);
*/

-- To use this seed data:
-- 1. Sign up for an account in the app
-- 2. Get your user ID from the profiles table or from the app
-- 3. Update the SQL above with your user ID where indicated
-- 4. Run this script in Supabase SQL Editor

-- Verify the data was inserted:
SELECT COUNT(*) as book_count FROM books;
SELECT title, author, genre, year FROM books ORDER BY year DESC;
