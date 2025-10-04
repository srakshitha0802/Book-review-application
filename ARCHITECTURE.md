# Book Review Platform - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Contexts   │      │
│  │              │  │              │  │              │      │
│  │ • BookList   │  │ • Navbar     │  │ • Auth       │      │
│  │ • BookDetail │  │ • Layout     │  │              │      │
│  │ • AddEdit    │  │ • Pagination │  │              │      │
│  │ • Profile    │  │ • Protected  │  │              │      │
│  │ • Login      │  │   Route      │  │              │      │
│  │ • Signup     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Supabase Client
                         │ (@supabase/supabase-js)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  PostgreSQL  │  │     APIs     │      │
│  │              │  │              │  │              │      │
│  │ • Email/Pass │  │ • profiles   │  │ • REST API   │      │
│  │ • JWT Tokens │  │ • books      │  │ • Realtime   │      │
│  │ • Sessions   │  │ • reviews    │  │ • Storage    │      │
│  │              │  │              │  │              │      │
│  │              │  │ • RLS        │  │              │      │
│  │              │  │ • Triggers   │  │              │      │
│  │              │  │ • Functions  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User Signs Up
    ↓
Frontend (Signup.tsx)
    ↓
AuthContext.signUp()
    ↓
Supabase Auth → Create auth.users record
    ↓
Create profiles record
    ↓
Return session + JWT
    ↓
Store in AuthContext
    ↓
Navigate to /books
```

### 2. Add Book Flow

```
User Clicks "Add Book"
    ↓
Navigate to /books/new
    ↓
AddEditBook.tsx (Protected)
    ↓
User Fills Form
    ↓
Submit → supabase.from('books').insert()
    ↓
RLS Policy: Check auth.uid() = added_by
    ↓
Insert into books table
    ↓
Return new book
    ↓
Navigate to /books/{id}
```

### 3. Add Review Flow

```
User on Book Details Page
    ↓
Click "Write a Review"
    ↓
Select Rating + Enter Text
    ↓
Submit → supabase.from('reviews').insert()
    ↓
Check Unique Constraint (book_id, user_id)
    ↓
Insert review
    ↓
Database Trigger Fires
    ↓
Calculate AVG(rating) for book
    ↓
Update book.avg_rating & reviews_count
    ↓
Refetch book & reviews
    ↓
Display updated data
```

### 4. Search & Filter Flow

```
User Types Search Term
    ↓
State Update (searchTerm)
    ↓
useEffect triggers fetchBooks()
    ↓
Build Supabase Query:
  • .or(title.ilike.%term%, author.ilike.%term%)
  • .eq(genre, filter) if genre selected
  • .order(sortColumn, { ascending })
  • .range(from, to) for pagination
    ↓
Execute Query
    ↓
Update books state
    ↓
Render BookList with results
```

## Component Hierarchy

```
App
├── BrowserRouter
│   └── AuthProvider
│       └── Routes
│           ├── /login → Login
│           ├── /signup → Signup
│           └── Protected Routes
│               └── Layout
│                   ├── Navbar
│                   └── Pages
│                       ├── BookList
│                       │   └── Pagination
│                       ├── BookDetails
│                       ├── AddEditBook
│                       └── Profile
```

## Database Architecture

### Tables & Relationships

```
auth.users (Supabase managed)
    ↓ 1:1
profiles
    ↓ 1:N
    ├── books (added_by)
    └── reviews (user_id)

books
    ↓ 1:N
reviews (book_id)
```

### Automatic Calculations

```
reviews table
    ↓ INSERT/UPDATE/DELETE
    ↓ Trigger: update_book_ratings()
    ↓
Execute Query:
  SELECT
    AVG(rating) as avg_rating,
    COUNT(*) as reviews_count
  FROM reviews
  WHERE book_id = {book_id}
    ↓
UPDATE books
  SET avg_rating = calculated_avg,
      reviews_count = calculated_count
  WHERE id = {book_id}
```

## Security Architecture

### Row Level Security (RLS)

```
Request → Supabase
    ↓
Extract JWT → Get auth.uid()
    ↓
Apply RLS Policy
    ↓
Execute Query with Policy Filter

Example: books UPDATE
Policy: USING (auth.uid() = added_by)
Result: User can only update their own books
```

### RLS Policies by Table

**profiles**:
- SELECT: All authenticated users
- INSERT: Only for own profile (auth.uid() = id)
- UPDATE: Only own profile
- DELETE: Only own profile

**books**:
- SELECT: All authenticated users
- INSERT: auth.uid() = added_by
- UPDATE: auth.uid() = added_by
- DELETE: auth.uid() = added_by

**reviews**:
- SELECT: All authenticated users
- INSERT: auth.uid() = user_id
- UPDATE: auth.uid() = user_id
- DELETE: auth.uid() = user_id
- UNIQUE: (book_id, user_id) prevents duplicate reviews

## State Management

### AuthContext

```javascript
{
  user: User | null,           // Supabase auth user
  profile: Profile | null,     // User profile data
  session: Session | null,     // JWT session
  loading: boolean,            // Initial load state
  signUp: (email, password, name) => Promise<void>,
  signIn: (email, password) => Promise<void>,
  signOut: () => Promise<void>
}
```

### Local Component State

- **BookList**: books[], currentPage, searchTerm, genreFilter, sortBy
- **BookDetails**: book, reviews[], userReview, showReviewForm
- **Profile**: books[], reviews[], activeTab
- **AddEditBook**: form fields (title, author, description, etc.)

## API Patterns

### Supabase Query Examples

```typescript
// List with pagination
const { data, count } = await supabase
  .from('books')
  .select('*', { count: 'exact' })
  .range(from, to)
  .order('created_at', { ascending: false });

// Search with OR condition
const { data } = await supabase
  .from('books')
  .select('*')
  .or(`title.ilike.%${term}%,author.ilike.%${term}%`);

// Join with nested select
const { data } = await supabase
  .from('reviews')
  .select(`
    *,
    profiles (name),
    books (title, author)
  `);

// Single record
const { data } = await supabase
  .from('books')
  .select('*')
  .eq('id', id)
  .single();

// Maybe single (no error if not found)
const { data } = await supabase
  .from('reviews')
  .select('*')
  .eq('book_id', bookId)
  .eq('user_id', userId)
  .maybeSingle();
```

## Performance Optimizations

### Database Level
- Indexes on frequently queried columns (title, author, genre, ratings)
- Automatic rating calculation via triggers (no client-side computation)
- Pagination limits data transfer
- Row Level Security enforced at database level

### Frontend Level
- React Router for client-side navigation (no page reloads)
- Conditional rendering for loading states
- Optimistic UI updates where possible
- LocalStorage for session persistence

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel/Netlify                        │
│                    (Frontend CDN)                        │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │  Static React App (SPA)                     │        │
│  │  • HTML, CSS, JS bundles                    │        │
│  │  • Client-side routing                      │        │
│  └────────────────────────────────────────────┘        │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTPS API Calls
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Supabase Cloud                         │
│  • PostgreSQL Database (managed)                        │
│  • Authentication Service                               │
│  • REST APIs (auto-generated)                           │
│  • Realtime subscriptions                               │
│  • Edge Functions                                       │
│  • Storage (if needed)                                  │
└─────────────────────────────────────────────────────────┘
```

## Technology Decisions

### Why Supabase?
- ✅ PostgreSQL with full SQL support
- ✅ Built-in authentication
- ✅ Row Level Security for fine-grained access control
- ✅ Real-time capabilities
- ✅ Auto-generated REST APIs
- ✅ Database triggers and functions
- ✅ TypeScript support
- ✅ Free tier for development

### Why React Router?
- ✅ Industry standard
- ✅ Declarative routing
- ✅ Protected routes support
- ✅ URL parameter handling
- ✅ Client-side navigation

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ No CSS file management
- ✅ Responsive design utilities
- ✅ Consistent design system
- ✅ Small bundle size with purging

### Why TypeScript?
- ✅ Type safety
- ✅ Better IDE support
- ✅ Catch errors at compile time
- ✅ Better refactoring
- ✅ Self-documenting code

## Scalability Considerations

### Current Limits
- 5 books per page (pagination)
- Database indexes for query performance
- Supabase free tier limits

### Future Scaling
- Add caching layer (Redis)
- Implement CDN for static assets
- Database read replicas
- Connection pooling
- Full-text search (PostgreSQL FTS)
- Image optimization and CDN
- Rate limiting
- Background jobs for heavy operations

## Development Workflow

```
1. Make Changes
   ↓
2. Hot Reload (Vite)
   ↓
3. Test in Browser
   ↓
4. Check Browser Console & Network Tab
   ↓
5. Verify Database Changes in Supabase Dashboard
   ↓
6. Run Type Check: npm run typecheck
   ↓
7. Build: npm run build
   ↓
8. Deploy
```

## Monitoring & Debugging

### Frontend
- Browser DevTools Console
- React DevTools
- Network tab for API calls

### Backend
- Supabase Dashboard → Logs
- SQL queries in Query Editor
- Auth logs
- API logs

### Database
- Supabase Dashboard → Database
- Table editor for manual checks
- SQL queries for data verification
- Migration history

---

This architecture provides a solid foundation for a production-ready book review platform with room for future enhancements.
