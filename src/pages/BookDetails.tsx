import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Star, CreditCard as Edit2, Trash2, ArrowLeft } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  genre: string | null;
  year: number | null;
  added_by: string | null;
  avg_rating: number;
  reviews_count: number;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles: {
    name: string;
  };
}

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (name)
        `)
        .eq('book_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);

      const myReview = data?.find((r) => r.user_id === user?.id);
      if (myReview) {
        setUserReview(myReview);
        setRating(myReview.rating);
        setReviewText(myReview.review_text || '');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setSubmitting(true);
    try {
      if (userReview) {
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            review_text: reviewText,
          })
          .eq('id', userReview.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('reviews').insert({
          book_id: id,
          user_id: user.id,
          rating,
          review_text: reviewText,
        });

        if (error) throw error;
      }

      setShowReviewForm(false);
      fetchBookDetails();
      fetchReviews();
    } catch (error: any) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !confirm('Are you sure you want to delete your review?')) return;

    try {
      const { error } = await supabase.from('reviews').delete().eq('id', userReview.id);

      if (error) throw error;

      setUserReview(null);
      setRating(5);
      setReviewText('');
      setShowReviewForm(false);
      fetchBookDetails();
      fetchReviews();
    } catch (error: any) {
      alert(error.message || 'Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    if (!book || !confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error } = await supabase.from('books').delete().eq('id', book.id);

      if (error) throw error;
      navigate('/books');
    } catch (error: any) {
      alert(error.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Book not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/books"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Books
      </Link>

      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            <div className="flex items-center gap-4 mb-4">
              {book.genre && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {book.genre}
                </span>
              )}
              {book.year && <span className="text-gray-500">{book.year}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Star className="w-8 h-8 fill-current" />
              <span className="text-3xl font-bold text-gray-900">
                {book.avg_rating > 0 ? book.avg_rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <p className="text-gray-500">{book.reviews_count} reviews</p>
          </div>
        </div>

        {book.description && <p className="text-gray-700 leading-relaxed mb-6">{book.description}</p>}

        {user?.id === book.added_by && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link
              to={`/books/${book.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Book
            </Link>
            <button
              onClick={handleDeleteBook}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Book
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {!userReview && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {(showReviewForm || userReview) && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {userReview ? 'Edit Your Review' : 'Write Your Review'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts about this book..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </button>
              {userReview && (
                <button
                  type="button"
                  onClick={handleDeleteReview}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Review
                </button>
              )}
              {!userReview && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.profiles.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.review_text && <p className="text-gray-700">{review.review_text}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
