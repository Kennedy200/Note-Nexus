import React, { useState, useEffect } from 'react';
import { Search, Star, Download, Coins, Loader2, Eye, X, MessageSquare } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface Note {
  id: number;
  title: string;
  description: string;
  course_code: string;
  department: string;
  level: string;
  file_url: string;
  thumbnail: string;
  price: number;
  rating: number;
  rating_count: number;
  download_count: number;
}

interface Rating {
  id: number;
  rating: number;
  review: string;
  user_name: string;
  created_at: string;
}

const BrowseNotes: React.FC = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [purchasedNotes, setPurchasedNotes] = useState<number[]>([]);

  const user = JSON.parse(localStorage.getItem('notenexus_user') || '{}');

  useEffect(() => {
    fetchNotes();
    fetchSearchHistory();
    fetchPurchasedNotes();
  }, []);

  const fetchNotes = () => {
    fetch('http://localhost:8000/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => {
        console.error('Failed to fetch notes:', err);
        showToast('error', 'Failed to load notes', 'Please refresh the page');
      });
  };

  const fetchPurchasedNotes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/purchases/${user.id}`);
      const data = await res.json();
      const purchasedIds = data.map((purchase: any) => purchase.note.id);
      setPurchasedNotes(purchasedIds);
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/search/history/${user.id}`);
      const data = await res.json();
      setSearchHistory(data.map((item: any) => item.search_query).slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch search history:', err);
    }
  };

  const saveSearchQuery = async (query: string) => {
    if (!query.trim()) return;

    try {
      const formData = new FormData();
      formData.append('user_id', user.id.toString());
      formData.append('search_query', query);

      await fetch('http://localhost:8000/api/search/history', {
        method: 'POST',
        body: formData
      });

      fetchSearchHistory();
    } catch (err) {
      console.error('Failed to save search:', err);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      saveSearchQuery(value);
    }
  };

  const isPurchased = (noteId: number) => {
    return purchasedNotes.includes(noteId);
  };

  const handleAction = async (note: Note) => {
    // If note is free, just open it
    if (note.price === 0) {
      window.open(note.file_url, '_blank');
      showToast('success', 'Opening free note', 'Enjoy your download!');
      return;
    }

    // If already purchased, just download
    if (isPurchased(note.id)) {
      window.open(note.file_url, '_blank');
      showToast('success', 'Opening purchased note', 'Enjoy your download!');
      return;
    }

    // Otherwise, proceed with purchase
    setLoadingId(note.id);
    try {
      const res = await fetch(`http://localhost:8000/api/notes/purchase/${note.id}/${user.id}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast('success', 'Purchase successful!', `New Balance: ${data.new_balance} NC`);
        const updatedUser = { ...user, coin_balance: data.new_balance };
        localStorage.setItem('notenexus_user', JSON.stringify(updatedUser));
        window.open(note.file_url, '_blank');
        
        // Add to purchased list
        setPurchasedNotes([...purchasedNotes, note.id]);
        
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showToast('error', 'Purchase failed', data.detail || 'Unable to complete purchase');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setLoadingId(null);
    }
  };

  const openRatingModal = async (note: Note) => {
    setSelectedNote(note);
    setShowRatingModal(true);
    setUserRating(0);
    setUserReview('');

    // Fetch ratings for this note
    try {
      const res = await fetch(`http://localhost:8000/api/notes/${note.id}/ratings`);
      const data = await res.json();
      setRatings(data);
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
    }
  };

  const submitRating = async () => {
    if (userRating === 0) {
      showToast('warning', 'Select a rating', 'Please select a star rating');
      return;
    }

    if (!selectedNote) return;

    setSubmittingRating(true);

    try {
      const formData = new FormData();
      formData.append('user_id', user.id.toString());
      formData.append('rating', userRating.toString());
      formData.append('review', userReview);

      const res = await fetch(`http://localhost:8000/api/notes/${selectedNote.id}/rate`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Rating submitted!', `Average rating: ${data.new_average} ⭐`);
        setShowRatingModal(false);
        fetchNotes(); // Refresh notes to show new rating
      } else {
        showToast('error', 'Rating failed', data.detail || 'Unable to submit rating');
      }
    } catch (err) {
      showToast('error', 'Connection error', 'Unable to connect to server');
    } finally {
      setSubmittingRating(false);
    }
  };

  const departments = ['ALL', 'Computer Science', 'Law', 'Mass Comm', 'Business', 'Accounting', 'Chemistry', 'Engineering', 'Economics'];
  const levels = ['ALL', '100L', '200L', '300L', '400L', '500L'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.course_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'ALL' || n.department === filterDept;
    const matchesLevel = filterLevel === 'ALL' || n.level === filterLevel;
    return matchesSearch && matchesDept && matchesLevel;
  });

  const getButtonText = (note: Note) => {
    if (note.price === 0 || isPurchased(note.id)) return 'Download';
    return 'Unlock';
  };

  const getButtonIcon = (note: Note) => {
    if (loadingId === note.id) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (note.price === 0 || isPurchased(note.id)) return <Download className="w-4 h-4" />;
    return <Coins className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-[1000] text-gray-900 tracking-tighter uppercase italic">📚 Note Library</h2>
        <p className="text-gray-500 font-bold italic underline decoration-blue-200">
          {filteredNotes.length} notes available • Explore, Learn, Excel
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search by Course Code or Title..."
            className="w-full pl-16 pr-8 py-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 font-bold text-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Search History Dropdown */}
          {searchHistory.length > 0 && searchTerm === '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl p-4 z-10">
              <p className="text-xs font-black text-gray-400 uppercase mb-2">Recent Searches</p>
              <div className="space-y-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(query)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-700 transition-all"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <select 
            className="px-6 py-3 bg-white rounded-xl border border-gray-100 font-black text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select 
            className="px-6 py-3 bg-white rounded-xl border border-gray-100 font-black text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group">
            {/* Thumbnail */}
            <div className="h-48 relative overflow-hidden">
              <img src={note.thumbnail} alt={note.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {note.level}
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-black">{note.download_count}</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-blue-50 rounded-lg text-[10px] font-black text-blue-600 uppercase">
                  {note.course_code}
                </div>
                <button
                  onClick={() => openRatingModal(note)}
                  className="flex items-center gap-1 ml-auto text-amber-500 font-black hover:scale-110 transition-transform"
                >
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-sm">{note.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({note.rating_count})</span>
                </button>
              </div>

              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 line-clamp-2">{note.title}</h3>
              <p className="text-sm text-gray-500 font-semibold mb-6 line-clamp-2">{note.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <Coins className={`w-5 h-5 ${note.price > 0 ? 'text-amber-500' : 'text-green-500'}`} />
                  <span className="font-black text-gray-900">{note.price === 0 ? 'FREE' : `${note.price} NC`}</span>
                </div>
                <button 
                  onClick={() => handleAction(note)}
                  disabled={loadingId === note.id}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl disabled:opacity-50"
                >
                  {getButtonIcon(note)}
                  {loadingId === note.id ? 'Processing' : getButtonText(note)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg font-bold">No notes found matching your criteria</p>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-bounceIn">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedNote.title}</h2>
                <p className="text-gray-500 font-bold">Rate this note and share your feedback</p>
              </div>
              <button
                onClick={() => setShowRatingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Rating Form */}
            <div className="bg-blue-50 rounded-3xl p-8 mb-8">
              <p className="text-sm font-black text-gray-700 uppercase mb-4">Your Rating</p>
              <div className="flex items-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= userRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Write your review (optional)..."
                rows={4}
                className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold resize-none"
              />

              <button
                onClick={submitRating}
                disabled={submittingRating || userRating === 0}
                className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingRating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Submit Rating
                  </>
                )}
              </button>
            </div>

            {/* Existing Ratings */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-6 h-6 text-gray-400" />
                <h3 className="text-xl font-black text-gray-900">Reviews ({ratings.length})</h3>
              </div>

              {ratings.length === 0 ? (
                <p className="text-center text-gray-400 py-10 font-bold">No reviews yet. Be the first to rate!</p>
              ) : (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-black text-gray-900">{rating.user_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(rating.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-bold">
                          {new Date(rating.created_at).toLocaleDateString('en-NG', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {rating.review && (
                        <p className="text-sm text-gray-700 font-medium leading-relaxed">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseNotes;