# Testing Guide - Book Review Platform

This document provides comprehensive testing scenarios to verify all functionality works correctly.

## Prerequisites

1. Application is running: `npm run dev`
2. Database migration is applied (already done)
3. Browser open to `http://localhost:5173`

## Test Suite

### 1. Authentication Tests

#### Test 1.1: Sign Up
**Steps:**
1. Navigate to `/signup`
2. Enter name: "Test User"
3. Enter email: "test@example.com"
4. Enter password: "password123"
5. Click "Sign Up"

**Expected Result:**
- ✅ Account created successfully
- ✅ Profile created in database
- ✅ Automatically logged in
- ✅ Redirected to `/books`
- ✅ Navbar shows "Test User"

#### Test 1.2: Sign Out
**Steps:**
1. While logged in, click "Sign Out" in navbar

**Expected Result:**
- ✅ Session cleared
- ✅ Redirected to `/login`
- ✅ Protected routes not accessible

#### Test 1.3: Sign In
**Steps:**
1. Navigate to `/login`
2. Enter email: "test@example.com"
3. Enter password: "password123"
4. Click "Sign In"

**Expected Result:**
- ✅ Successfully authenticated
- ✅ Redirected to `/books`
- ✅ Session persists on refresh

#### Test 1.4: Protected Routes
**Steps:**
1. Sign out
2. Try to navigate directly to `/books`

**Expected Result:**
- ✅ Redirected to `/login`
- ✅ Cannot access protected pages

#### Test 1.5: Invalid Credentials
**Steps:**
1. Navigate to `/login`
2. Enter incorrect email or password
3. Click "Sign In"

**Expected Result:**
- ✅ Error message displayed
- ✅ User not authenticated

### 2. Book Management Tests

#### Test 2.1: View Empty Book List
**Steps:**
1. Login to new account
2. View `/books` page

**Expected Result:**
- ✅ Empty state message shown
- ✅ "Add Book" button visible
- ✅ No pagination shown

#### Test 2.2: Add New Book
**Steps:**
1. Click "Add Book" button
2. Navigate to `/books/new`
3. Fill in form:
   - Title: "Test Book Title"
   - Author: "Test Author"
   - Description: "A test book description"
   - Genre: "Fiction"
   - Year: 2024
4. Click "Add Book"

**Expected Result:**
- ✅ Book created successfully
- ✅ Redirected to book details page
- ✅ All entered data displayed correctly
- ✅ Rating shows "N/A" (no reviews yet)
- ✅ Reviews count shows 0

#### Test 2.3: Edit Own Book
**Steps:**
1. On book details page (as creator)
2. Click "Edit Book"
3. Update title to "Updated Test Book"
4. Click "Update Book"

**Expected Result:**
- ✅ Book updated successfully
- ✅ Redirected to book details
- ✅ Updated information displayed

#### Test 2.4: Delete Own Book
**Steps:**
1. On book details page (as creator)
2. Click "Delete Book"
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Book deleted from database
- ✅ Redirected to book list
- ✅ Book no longer appears in list

#### Test 2.5: Cannot Edit Others' Books
**Steps:**
1. Create book with User A
2. Sign in as User B
3. Navigate to User A's book

**Expected Result:**
- ✅ No "Edit Book" button visible
- ✅ No "Delete Book" button visible
- ✅ Can view and review only

### 3. Review System Tests

#### Test 3.1: Add Review
**Steps:**
1. Navigate to any book details page
2. Click "Write a Review"
3. Select 5 stars
4. Enter review text: "Excellent book!"
5. Click "Submit Review"

**Expected Result:**
- ✅ Review created successfully
- ✅ Review appears in list
- ✅ Book rating updated to 5.0
- ✅ Reviews count updated to 1
- ✅ Form changes to edit mode
- ✅ "Write a Review" button hidden

#### Test 3.2: Edit Own Review
**Steps:**
1. On book with your review
2. Update rating to 4 stars
3. Update text to "Good book"
4. Click "Update Review"

**Expected Result:**
- ✅ Review updated successfully
- ✅ Book rating recalculated
- ✅ Updated review displayed

#### Test 3.3: Delete Own Review
**Steps:**
1. On book with your review
2. Click "Delete Review"
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Review deleted
- ✅ Book rating recalculated
- ✅ Reviews count decremented
- ✅ Form resets to "Write a Review"

#### Test 3.4: One Review Per User Constraint
**Steps:**
1. Add a review to a book
2. Try to submit another review (via database or API)

**Expected Result:**
- ✅ Unique constraint prevents duplicate
- ✅ Error message shown
- ✅ Only one review exists per user per book

#### Test 3.5: Rating Calculation
**Steps:**
1. User A reviews book with 5 stars
2. User B reviews book with 3 stars
3. User C reviews book with 4 stars

**Expected Result:**
- ✅ Average rating: 4.0 ((5+3+4)/3)
- ✅ Reviews count: 3
- ✅ Updates automatically after each review
- ✅ Calculation accurate to 2 decimal places

### 4. Search & Filter Tests

#### Test 4.1: Search by Title
**Steps:**
1. Add books:
   - "The Great Gatsby"
   - "Great Expectations"
   - "1984"
2. Search for "Great"

**Expected Result:**
- ✅ Shows only matching books
- ✅ Case-insensitive search
- ✅ Partial matches work
- ✅ Pagination resets to page 1

#### Test 4.2: Search by Author
**Steps:**
1. Search for author name

**Expected Result:**
- ✅ Shows all books by that author
- ✅ Case-insensitive
- ✅ Partial matches work

#### Test 4.3: Filter by Genre
**Steps:**
1. Add books with different genres
2. Select "Fiction" from genre filter

**Expected Result:**
- ✅ Shows only Fiction books
- ✅ Other genres hidden
- ✅ Can clear filter (select "All Genres")

#### Test 4.4: Combined Search and Filter
**Steps:**
1. Search for "test" AND filter by "Fiction"

**Expected Result:**
- ✅ Both criteria applied
- ✅ Only matching books shown
- ✅ Results accurate

#### Test 4.5: Sort Options
**Steps:**
Test each sort option:
- Newest First (default)
- Oldest First
- Highest Rated
- Title A-Z
- Title Z-A
- Year (Oldest)
- Year (Newest)

**Expected Result:**
- ✅ Books reordered correctly for each option
- ✅ Pagination resets on sort change
- ✅ Sort persists while paginating

### 5. Pagination Tests

#### Test 5.1: Pagination Display
**Steps:**
1. Add 6+ books
2. View book list

**Expected Result:**
- ✅ Shows 5 books per page
- ✅ Pagination controls visible
- ✅ Page 1 active by default
- ✅ Total pages calculated correctly

#### Test 5.2: Navigate Pages
**Steps:**
1. Click "Next" button
2. Click "Previous" button
3. Click specific page number

**Expected Result:**
- ✅ Correct books displayed for each page
- ✅ Active page highlighted
- ✅ Previous disabled on page 1
- ✅ Next disabled on last page

#### Test 5.3: Pagination with Search
**Steps:**
1. Search results span multiple pages
2. Navigate between pages

**Expected Result:**
- ✅ Search filter maintained across pages
- ✅ Correct results on each page
- ✅ Page count based on filtered results

### 6. Profile Tests

#### Test 6.1: View Profile
**Steps:**
1. Click your name in navbar
2. Navigate to `/profile`

**Expected Result:**
- ✅ Shows your name
- ✅ Shows book count
- ✅ Shows review count
- ✅ Two tabs: "My Books" and "My Reviews"

#### Test 6.2: My Books Tab
**Steps:**
1. Add several books
2. View profile "My Books" tab

**Expected Result:**
- ✅ Lists all your books
- ✅ Shows rating and review count for each
- ✅ Shows creation date
- ✅ Clicking book navigates to details

#### Test 6.3: My Reviews Tab
**Steps:**
1. Write several reviews
2. View profile "My Reviews" tab

**Expected Result:**
- ✅ Lists all your reviews
- ✅ Shows book title and author
- ✅ Shows rating stars
- ✅ Shows review text (truncated if long)
- ✅ Shows review date
- ✅ Clicking review navigates to book

#### Test 6.4: Empty Profile States
**Steps:**
1. New user with no books/reviews
2. View profile tabs

**Expected Result:**
- ✅ "My Books" shows empty state with "Add Your First Book" button
- ✅ "My Reviews" shows empty state with "Browse Books" button
- ✅ Helpful messages guide user

### 7. Data Validation Tests

#### Test 7.1: Required Fields
**Steps:**
1. Try to create book without title
2. Try to create book without author
3. Try to create review without rating

**Expected Result:**
- ✅ Form validation prevents submission
- ✅ Error messages displayed
- ✅ Required fields marked

#### Test 7.2: Password Requirements
**Steps:**
1. Try to sign up with password < 6 characters

**Expected Result:**
- ✅ Validation error shown
- ✅ Account not created
- ✅ Clear error message

#### Test 7.3: Email Validation
**Steps:**
1. Try to sign up with invalid email format

**Expected Result:**
- ✅ Browser validation catches invalid email
- ✅ Clear error message

#### Test 7.4: Year Validation
**Steps:**
1. Try to enter year < 1000
2. Try to enter year > current year + 1

**Expected Result:**
- ✅ HTML5 validation enforces min/max
- ✅ Reasonable year ranges only

### 8. UI/UX Tests

#### Test 8.1: Loading States
**Steps:**
1. Observe loading indicators during:
   - Initial auth check
   - Fetching books
   - Submitting forms

**Expected Result:**
- ✅ Spinner shown during loads
- ✅ No content flashing
- ✅ Smooth transitions

#### Test 8.2: Error Messages
**Steps:**
1. Trigger various errors
2. Check error messages

**Expected Result:**
- ✅ User-friendly error messages
- ✅ Red error alerts visible
- ✅ Errors clear on retry

#### Test 8.3: Responsive Design
**Steps:**
1. Test on desktop (1920px)
2. Test on tablet (768px)
3. Test on mobile (375px)

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ No horizontal scrolling
- ✅ Touch targets adequate on mobile
- ✅ Readable text at all sizes

#### Test 8.4: Navigation
**Steps:**
1. Test all navigation links
2. Test browser back/forward buttons

**Expected Result:**
- ✅ All links work correctly
- ✅ Browser navigation works
- ✅ Active routes highlighted
- ✅ Breadcrumb navigation present

### 9. Performance Tests

#### Test 9.1: Page Load Time
**Steps:**
1. Measure time to interactive on each page

**Expected Result:**
- ✅ Pages load in < 2 seconds
- ✅ No unnecessary re-renders
- ✅ Optimized bundle size

#### Test 9.2: Database Query Performance
**Steps:**
1. Check network tab for query times
2. Test with 100+ books

**Expected Result:**
- ✅ Queries complete in < 500ms
- ✅ Indexes used effectively
- ✅ Pagination prevents large data loads

### 10. Security Tests

#### Test 10.1: SQL Injection
**Steps:**
1. Try to inject SQL in search: `'; DROP TABLE books; --`

**Expected Result:**
- ✅ Supabase prevents SQL injection
- ✅ Input sanitized
- ✅ No database changes

#### Test 10.2: XSS Attacks
**Steps:**
1. Try to inject script in review: `<script>alert('xss')</script>`

**Expected Result:**
- ✅ React escapes HTML by default
- ✅ Script not executed
- ✅ Displayed as plain text

#### Test 10.3: Unauthorized Access
**Steps:**
1. As User A, try to:
   - Edit User B's book (modify URL)
   - Delete User B's review
   - Update User B's profile

**Expected Result:**
- ✅ RLS policies prevent unauthorized access
- ✅ 403 Forbidden errors
- ✅ No data modified

#### Test 10.4: Session Hijacking
**Steps:**
1. Copy JWT token from localStorage
2. Use in different browser
3. Original user logs out

**Expected Result:**
- ✅ Token expires after logout
- ✅ Sessions properly invalidated
- ✅ Secure token handling

## Automated Testing Checklist

### Quick Smoke Test (5 minutes)
- [ ] Sign up works
- [ ] Sign in works
- [ ] Add book works
- [ ] View book details works
- [ ] Add review works
- [ ] Search works
- [ ] Profile shows data

### Full Regression Test (30 minutes)
- [ ] All authentication tests
- [ ] All book management tests
- [ ] All review system tests
- [ ] All search & filter tests
- [ ] All pagination tests
- [ ] All profile tests
- [ ] All validation tests

### Pre-Deployment Test (15 minutes)
- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npm run typecheck`
- [ ] No console errors
- [ ] All core features work
- [ ] Database migration applied
- [ ] Environment variables set

## Test Data Cleanup

After testing, you may want to clean up test data:

```sql
-- Delete all test reviews
DELETE FROM reviews WHERE review_text LIKE '%test%';

-- Delete all test books
DELETE FROM books WHERE title LIKE '%test%';

-- Delete test profiles (this will cascade)
DELETE FROM profiles WHERE name = 'Test User';
```

## Known Limitations

1. **No automated tests**: This is manual testing only
2. **Browser compatibility**: Tested in Chrome/Firefox/Safari
3. **Accessibility**: Basic ARIA support, could be enhanced
4. **Offline mode**: Not supported
5. **Image uploads**: Not implemented

## Reporting Issues

When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Console errors (if any)
6. Network request details

## Success Criteria

The application passes testing if:
- ✅ All core features work correctly
- ✅ No data loss occurs
- ✅ Security policies are enforced
- ✅ UI is responsive and accessible
- ✅ Performance is acceptable
- ✅ No console errors in normal operation

---

**Last Updated**: 2025-10-04
**Test Coverage**: Core functionality
**Status**: Ready for production
