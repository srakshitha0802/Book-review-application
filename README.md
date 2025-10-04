# Book Review Platform

A full-featured book review platform built with React, TypeScript, Tailwind CSS, and Supabase. Users can discover books, write reviews, rate books, and manage their personal library.

## Features

- **Authentication**: Secure email/password authentication with Supabase Auth
- **Book Management**: Add, edit, and delete books with detailed information
- **Review System**: Write, edit, and delete reviews with 1-5 star ratings
- **Automatic Rating Calculation**: Book ratings update automatically based on all reviews
- **One Review Per User**: Database-enforced constraint prevents duplicate reviews
- **Pagination**: Browse books with 5 items per page
- **Search & Filter**: Search by title/author and filter by genre
- **Sorting**: Sort books by rating, date, title, or year
- **User Profile**: View your added books and written reviews
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Database Schema

### Tables

#### profiles
- `id` (uuid) - References auth.users
- `name` (text) - User's display name
- `created_at`, `updated_at` (timestamptz)

#### books
- `id` (uuid) - Primary key
- `title` (text) - Book title
- `author` (text) - Author name
- `description` (text) - Book description
- `genre` (text) - Genre category
- `year` (integer) - Publication year
- `added_by` (uuid) - References profiles
- `avg_rating` (numeric) - Automatically calculated
- `reviews_count` (integer) - Automatically calculated
- `created_at`, `updated_at` (timestamptz)

#### reviews
- `id` (uuid) - Primary key
- `book_id` (uuid) - References books
- `user_id` (uuid) - References profiles
- `rating` (integer) - 1-5 stars
- `review_text` (text) - Review content
- `created_at`, `updated_at` (timestamptz)
- **UNIQUE CONSTRAINT**: (book_id, user_id)

### Automatic Features

- **Rating Calculation**: Database trigger automatically updates `avg_rating` and `reviews_count` when reviews are added, updated, or deleted
- **Timestamps**: Automatic `updated_at` timestamp updates
- **Row Level Security**: All tables protected with RLS policies

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Environment Setup

1. Copy the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings > API
- Copy the Project URL and anon/public key

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Usage Guide

### 1. Sign Up / Login
- Create an account with email, password, and name
- Login with your credentials
- Authentication persists across sessions

### 2. Browse Books
- View all books with pagination (5 per page)
- Search by title or author
- Filter by genre
- Sort by rating, date, title, or year

### 3. View Book Details
- See book information and average rating
- Read all reviews from other users
- Add your review (one per book)
- Edit or delete your review

### 4. Add Books
- Click "Add Book" from the book list
- Fill in title, author, description, genre, and year
- Only you can edit or delete books you added

### 5. Manage Your Profile
- View all books you've added
- See all reviews you've written
- Navigate to books/reviews by clicking them

## API Structure

The application uses Supabase's auto-generated REST API:

### Books
- `GET /rest/v1/books` - List books (with pagination, search, filter, sort)
- `GET /rest/v1/books?id=eq.{id}` - Get single book
- `POST /rest/v1/books` - Create book (authenticated)
- `PATCH /rest/v1/books?id=eq.{id}` - Update book (owner only)
- `DELETE /rest/v1/books?id=eq.{id}` - Delete book (owner only)

### Reviews
- `GET /rest/v1/reviews?book_id=eq.{id}` - Get reviews for a book
- `POST /rest/v1/reviews` - Create review (authenticated)
- `PATCH /rest/v1/reviews?id=eq.{id}` - Update review (author only)
- `DELETE /rest/v1/reviews?id=eq.{id}` - Delete review (author only)

### Profiles
- `GET /rest/v1/profiles?id=eq.{id}` - Get user profile
- `POST /rest/v1/profiles` - Create profile (during signup)
- `PATCH /rest/v1/profiles?id=eq.{id}` - Update profile (owner only)

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with strict policies:

**Books**:
- Anyone (authenticated) can view books
- Only authenticated users can create books
- Only the book creator can update/delete their books

**Reviews**:
- Anyone (authenticated) can view reviews
- Only authenticated users can create reviews
- Only the review author can update/delete their reviews
- Database enforces one review per user per book

**Profiles**:
- Authenticated users can view all profiles
- Users can only create, update, or delete their own profile

### Authentication
- Passwords hashed with bcrypt via Supabase Auth
- JWT tokens for session management
- Protected routes require authentication
- Tokens stored in localStorage

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation bar
│   ├── Pagination.tsx  # Pagination controls
│   └── ProtectedRoute.tsx  # Auth route guard
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── database.types.ts  # TypeScript types
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   ├── BookList.tsx    # Book listing with search
│   ├── BookDetails.tsx # Book details with reviews
│   ├── AddEditBook.tsx # Add/edit book form
│   └── Profile.tsx     # User profile page
├── App.tsx             # Main app with routing
└── main.tsx           # Entry point
```

## Database Migration

The database schema is automatically created via Supabase migrations. The migration includes:

1. Table creation with proper relationships
2. Indexes for query optimization
3. Triggers for automatic rating updates
4. Row Level Security policies
5. Timestamp management functions

## Testing

### Manual Testing Checklist

**Authentication**:
- ✅ Sign up with new account
- ✅ Login with existing account
- ✅ Logout
- ✅ Protected routes redirect to login
- ✅ Authentication persists after refresh

**Books**:
- ✅ View book list with pagination
- ✅ Search books by title/author
- ✅ Filter books by genre
- ✅ Sort books by various fields
- ✅ Add new book
- ✅ Edit own book
- ✅ Delete own book
- ✅ Cannot edit/delete other users' books

**Reviews**:
- ✅ View book reviews
- ✅ Add review with rating
- ✅ Edit own review
- ✅ Delete own review
- ✅ Cannot add duplicate review (enforced)
- ✅ Rating updates automatically
- ✅ Reviews count updates automatically

**Profile**:
- ✅ View own books
- ✅ View own reviews
- ✅ Navigate to books/reviews

## Deployment

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Supabase Setup

Your Supabase database is already configured with the migration. No additional setup needed.

## Performance Optimizations

- Database indexes on frequently queried columns
- Pagination limits data fetching to 5 items
- Automatic rating calculation via database triggers
- Optimized queries with proper joins
- React Router for client-side navigation

## Future Enhancements

Potential features to add:
- Book cover images
- User avatars
- Bookmarks/favorites
- Comments on reviews
- Email notifications
- Social sharing
- Advanced search (full-text)
- Reading lists
- Book recommendations
- Import from APIs (Google Books, OpenLibrary)

## Contributing

This is a demonstration project built for educational purposes. Feel free to fork and extend it!

## License

MIT License - feel free to use this code for your own projects.

## Support

For issues related to:
- **Supabase**: Check the [Supabase documentation](https://supabase.com/docs)
- **React Router**: See [React Router docs](https://reactrouter.com/)
- **Tailwind CSS**: Visit [Tailwind documentation](https://tailwindcss.com/docs)

---

Built with ❤️ using React, TypeScript, and Supabase
