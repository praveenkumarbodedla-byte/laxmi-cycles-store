import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Eye, Trash2, X, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  read: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  replied: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  closed: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400' },
};

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';

function EnquiryDetailModal({ enquiry, onClose, onUpdate }) {
  const [notes, setNotes] = useState(enquiry.adminNotes || '');
  const [status, setStatus] = useState(enquiry.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/api/enquiries/${enquiry._id}`, { status, adminNotes: notes });
      toast.success('Updated successfully');
      onUpdate();
      onClose();
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const whatsappMsg = encodeURIComponent(`Hi ${enquiry.name}! Thank you for your enquiry about ${enquiry.cycleName}. `);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg glass-card-dark border border-primary/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-white">Enquiry Details</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="glass-card p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Name</p><p className="text-white font-semibold">{enquiry.name}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Cycle</p><p className="text-white font-semibold">{enquiry.cycleName}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5 flex items-center gap-1"><Mail size={10} /> Email</p><p className="text-white">{enquiry.email}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5 flex items-center gap-1"><Phone size={10} /> Phone</p><p className="text-white">{enquiry.phone}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs mb-0.5 flex items-center gap-1"><Clock size={10} /> Date</p><p className="text-white">{new Date(enquiry.createdAt).toLocaleString('en-IN')}</p></div>
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="text-gray-400 text-xs mb-2">Message</p>
            <p className="text-white text-sm leading-relaxed">{enquiry.message}</p>
          </div>

          {/* Quick reply WhatsApp */}
          <a
            href={`https://wa.me/91${enquiry.phone}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all text-sm font-semibold"
          >
            <MessageCircle size={16} /> Reply via WhatsApp
          </a>

          {/* Status update */}
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Update Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50">
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Admin Notes</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes..."
              className="w-full px-3 py-2 rounded-xl bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 resize-none" />
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [statusCounts, setStatusCounts] = useState({});
  const [selected, setSelected] = useState(null);

  const fetchEnquiries = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/api/enquiries', { params });
      setEnquiries(res.data.data);
      setPagination(res.data.pagination);
      setStatusCounts(res.data.statusCounts || {});
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api.delete(`/api/enquiries/${id}`);
      toast.success('Deleted');
      fetchEnquiries();
    } catch { toast.error('Failed'); }
  };

  const filterTabs = [
    { label: 'All', value: '', count: Object.values(statusCounts).reduce((a, b) => a + b, 0) },
    { label: 'New', value: 'new', count: statusCounts.new || 0 },
    { label: 'Read', value: 'read', count: statusCounts.read || 0 },
    { label: 'Replied', value: 'replied', count: statusCounts.replied || 0 },
    { label: 'Closed', value: 'closed', count: statusCounts.closed || 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Enquiries</h1>
        <p className="text-gray-400 text-sm mt-1">{pagination.total} total enquiries</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filterTabs.map((tab) => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${statusFilter === tab.value ? 'bg-primary/20 border-primary/40 text-white' : 'border-white/10 text-gray-400 hover:border-primary/30 hover:text-white'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${tab.value === 'new' && tab.count > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-lg animate-pulse bg-white/5" />)}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Contact', 'Cycle', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => {
                  const c = STATUS_COLORS[e.status] || STATUS_COLORS.new;
                  return (
                    <tr key={e._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{e.name[0]}</div>
                          <span className="text-white font-medium">{e.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-300">{e.phone}</p>
                        <p className="text-gray-500 text-xs">{e.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-[150px] truncate">{e.cycleName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-lg border capitalize font-semibold ${c.bg} ${c.border} ${c.text}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(e)} className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-primary/50 hover:text-primary transition-all">
                            <Eye size={13} />
                          </button>
                          <button onClick={() => handleDelete(e._id)} className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <EnquiryDetailModal enquiry={selected} onClose={() => setSelected(null)} onUpdate={() => { fetchEnquiries(); setSelected(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
