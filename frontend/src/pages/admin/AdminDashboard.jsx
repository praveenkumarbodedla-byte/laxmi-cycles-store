import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, MessageSquare, Star, Eye, Clock, CheckCircle2, AlertTriangle, PlusCircle, Settings } from 'lucide-react';
import api from '../../api/axios';

export default function AdminDashboard({ setActiveTab, setOpenAddModal }) {
  const [stats, setStats] = useState({
    totalCycles: 0,
    availableCycles: 0,
    oosCycles: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, enquiriesRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/enquiries', { params: { limit: 5 } }),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (enquiriesRes.data.success) {
          setRecentEnquiries(enquiriesRes.data.data?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { icon: Bike, label: 'Total Cycles', value: stats.totalCycles, color: 'from-primary to-accent', tab: 'cycles' },
    { icon: CheckCircle2, label: 'Available Cycles', value: stats.availableCycles, color: 'from-green-500 to-emerald-400', tab: 'cycles' },
    { icon: AlertTriangle, label: 'Out of Stock Cycles', value: stats.oosCycles, color: 'from-red-500 to-rose-400', tab: 'cycles' },
    { icon: Star, label: 'Total Reviews', value: stats.totalReviews, color: 'from-yellow-500 to-amber-300', tab: 'reviews' },
    { icon: MessageSquare, label: 'Total Enquiries', value: stats.totalEnquiries, badge: stats.newEnquiries > 0 ? `${stats.newEnquiries} new` : null, color: 'from-orange-500 to-amber-400', tab: 'enquiries' },
  ];

  const statusColors = {
    new: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    read: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    replied: 'text-green-400 bg-green-400/10 border-green-400/30',
    closed: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back to Laxmi Cycles Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setActiveTab(card.tab)}
              className="w-full text-left block glass-card p-5 glow-border hover:scale-105 transition-transform duration-300 group focus:outline-none"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-glow-blue`}>
                <card.icon size={20} className="text-white" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display font-bold text-3xl text-white">{loading ? '...' : card.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{card.label}</p>
                </div>
                {card.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                    {card.badge}
                  </span>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* 5 Large Action Cards */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl text-white mb-6">Manage Store</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <button
            onClick={() => setActiveTab('cycles')}
            className="text-left glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-primary/50 transition-all group min-h-[180px] w-full focus:outline-none"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Bike size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Manage Cycles</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Update inventory specifications and availability states.</p>
            </div>
            <span className="text-primary text-xs font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              Go to Inventory &rarr;
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cycles');
              setOpenAddModal(true);
            }}
            className="text-left glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-accent/50 transition-all group min-h-[180px] w-full focus:outline-none"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                <PlusCircle size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Add New Cycle</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Instantly add a new model to the showroom catalogue.</p>
            </div>
            <span className="text-accent text-xs font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              Open Creator &rarr;
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className="text-left glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-orange-500/50 transition-all group min-h-[180px] w-full focus:outline-none"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Enquiries</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Monitor general showroom enquiries and model requests.</p>
            </div>
            <span className="text-orange-400 text-xs font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              Open Messages &rarr;
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className="text-left glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-yellow-500/50 transition-all group min-h-[180px] w-full focus:outline-none"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                <Star size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Reviews</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Moderate customer reviews, approvals, and ratings.</p>
            </div>
            <span className="text-yellow-400 text-xs font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              Moderate Reviews &rarr;
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="text-left glass-card p-6 flex flex-col justify-between hover:scale-[1.02] hover:border-gray-500/50 transition-all group min-h-[180px] w-full focus:outline-none"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center mb-4 text-gray-400 group-hover:bg-gray-500 group-hover:text-white transition-colors">
                <Settings size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Settings</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Configure app preferences and edit admin details.</p>
            </div>
            <span className="text-gray-400 text-xs font-semibold mt-4 inline-flex items-center gap-1 hover:underline">
              System Settings &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* Recent Enquiries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-white">Recent Enquiries</h2>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="text-sm text-primary hover:text-accent transition-colors flex items-center gap-1 focus:outline-none"
          >
            View all <Eye size={14} />
          </button>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No enquiries yet</p>
        ) : (
          <div className="space-y-3">
            {recentEnquiries.map((e) => (
              <div key={e._id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-dark-700/50 border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold text-primary text-sm">
                    {e.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{e.name}</p>
                    <p className="text-gray-400 text-xs truncate">{e.cycleName}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {new Date(e.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-lg border font-semibold capitalize ${statusColors[e.status] || statusColors.new}`}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
