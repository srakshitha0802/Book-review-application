# Quick Start Guide

Get your Book Review Platform up and running in 5 minutes!

## Step 1: Environment Setup (2 minutes)

1. Your Supabase database is already configured with all tables, triggers, and security policies

2. Make sure your `.env` file contains your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Step 2: Install Dependencies (1 minute)

```bash
npm install
```

## Step 3: Seed Sample Data (1 minute) - Optional

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `seed-data.sql`
3. Run the script to populate with sample books
4. Note: You'll need to create an account first to add reviews

## Step 4: Start Development Server (1 minute)

```bash
npm run dev
```

Visit `http://localhost:5173`

## Step 5: Test the Application

### Create Your First Account
1. Click "Sign up"
2. Enter name, email, and password
3. You'll be automatically logged in

### Add Your First Book
1. Click "Add Book" button
2. Fill in book details (title and author are required)
3. Click "Add Book"

### Write Your First Review
1. Click on any book
2. Click "Write a Review"
3. Select a rating (1-5 stars)
4. Write your thoughts
5. Click "Submit Review"
6. Watch the book's rating update automatically!

### Explore Features
- **Search**: Try searching for books by title or author
- **Filter**: Filter books by genre
- **Sort**: Sort by rating, date, title, or year
- **Profile**: View your books and reviews
- **Edit**: Edit or delete your books and reviews

## Common Operations

### View All Books
```
Navigate to: /books
```

### Add a Book
```
Click: "Add Book" button
Fill form and submit
```

### View Book Details
```
Click: Any book card
See: Reviews, rating, description
```

### Write a Review
```
On book details page
Click: "Write a Review"
Rate and submit
```

### View Your Profile
```
Click: Your name in navbar
See: Your books and reviews
```

## Testing Checklist

Try these actions to verify everything works:

- [ ] Sign up for a new account
- [ ] Log out and log back in
- [ ] Add a new book
- [ ] Search for the book you added
- [ ] Click on the book to view details
- [ ] Write a review for the book
- [ ] Edit your review
- [ ] View your profile
- [ ] Edit your book
- [ ] Add another book
- [ ] Browse books with pagination
- [ ] Filter books by genre
- [ ] Sort books by rating

## Build for Production

```bash
npm run build
npm run preview
```

## Troubleshooting

**Issue**: "Missing Supabase environment variables"
**Solution**: Check your `.env` file exists and has correct values

**Issue**: Can't see any books
**Solution**: Add your first book or run the seed script

**Issue**: Can't add a review
**Solution**: Make sure you're logged in and haven't already reviewed the book

**Issue**: Database errors
**Solution**: Check that the migration was applied successfully in Supabase

## Next Steps

1. Add more books to build your library
2. Invite friends to join and review books
3. Customize the styling to match your preferences
4. Deploy to Vercel or Netlify
5. Explore the code and add new features!

## Getting Help

- Check `README.md` for detailed documentation
- Review the database schema in `seed-data.sql`
- Inspect `src/` directory for code structure
- Check browser console for errors
- Review Supabase logs for database issues

Happy Reading! 📚
