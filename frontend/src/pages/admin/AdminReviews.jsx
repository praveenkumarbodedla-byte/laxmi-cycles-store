import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter !== '') params.isApproved = filter;
      const res = await api.get('/api/reviews/all', { params });
      setReviews(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const toggleApprove = async (review) => {
    try {
      await api.put(`/api/reviews/${review._id}/approve`, { isApproved: !review.isApproved });
      toast.success(review.isApproved ? 'Review unapproved' : 'Review approved!');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success('Deleted');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">{pagination.total} total reviews</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[{ label: 'All', value: '' }, { label: 'Approved', value: 'true' }, { label: 'Pending', value: 'false' }].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${filter === f.value ? 'bg-primary/20 border-primary/40 text-white' : 'border-white/10 text-gray-400 hover:border-primary/30'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-5 border-l-4 ${review.isApproved ? 'border-l-green-500' : 'border-l-yellow-500'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white flex-shrink-0">
                    {review.customerName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-white">{review.customerName}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-600'} />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${review.isApproved ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'}`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleApprove(review)}
                    title={review.isApproved ? 'Unapprove' : 'Approve'}
                    className={`p-2 rounded-lg border transition-all ${review.isApproved ? 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20' : 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20'}`}
                  >
                    {review.isApproved ? <X size={14} /> : <Check size={14} />}
                  </button>
                  <button onClick={() => handleDelete(review._id)}
                    className="p-2 rounded-lg border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
