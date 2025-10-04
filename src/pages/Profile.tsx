import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Star, MessageSquare } from 'lucide-react';

interface UserBook {
  id: string;
  title: string;
  author: string;
  avg_rating: number;
  reviews_count: number;
  created_at: string;
}

interface UserReview {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  books: {
    id: string;
    title: string;
    author: string;
  };
}

export function Profile() {
  const { profile } = useAuth();
  const [books, setBooks] = useState<UserBook[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'books' | 'reviews'>('books');

  useEffect(() => {
    if (profile) {
      fetchUserData();
    }
  }, [profile]);

  const fetchUserData = async () => {
    if (!profile) return;

    try {
      const [booksResult, reviewsResult] = await Promise.all([
        supabase
          .from('books')
          .select('id, title, author, avg_rating, reviews_count, created_at')
          .eq('added_by', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('reviews')
          .select(`
            id,
            rating,
            review_text,
            created_at,
            books (id, title, author)
          `)
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false }),
      ]);

      if (booksResult.error) throw booksResult.error;
      if (reviewsResult.error) throw reviewsResult.error;

      setBooks(booksResult.data || []);
      setReviews(reviewsResult.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name}</h1>
        <div className="flex gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>{books.length} books added</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>{reviews.length} reviews written</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'books'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Books ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Reviews ({reviews.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'books' && (
            <div className="space-y-4">
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't added any books yet</p>
                  <Link
                    to="/books/new"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                books.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-gray-600 mb-2">by {book.author}</p>
                        <p className="text-sm text-gray-500">
                          Added {new Date(book.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-lg font-semibold text-gray-900">
                            {book.avg_rating > 0 ? book.avg_rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{book.reviews_count} reviews</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't written any reviews yet</p>
                  <Link
                    to="/books"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Books
                  </Link>
                </div>
              ) : (
                reviews.map((review) => (
                  <Link
                    key={review.id}
                    to={`/books/${review.books.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{review.books.title}</h3>
                      <p className="text-sm text-gray-600">by {review.books.author}</p>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
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
                    {review.review_text && (
                      <p className="text-gray-700 mb-2 line-clamp-2">{review.review_text}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
