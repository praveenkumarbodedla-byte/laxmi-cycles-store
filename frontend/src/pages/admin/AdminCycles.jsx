import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, CheckCircle, XCircle, X, Image, Search } from 'lucide-react';
import api from '../../api/axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const BRANDS = ['Hero', 'Vesco', 'Sun Bride', 'Afro', 'Atlas', 'Avon', 'BSA', 'Firefox', 'Hercules', 'Montra', 'Other'];
const CATEGORIES = ['Mountain', 'Road', 'Kids', 'Sports', 'Electric', 'Hybrid', 'City'];

function CycleModal({ cycle, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: cycle ? {
      brand: cycle.brand || '',
      model: cycle.model || cycle.name || '',
      size: cycle.size || '',
      color: cycle.color || '',
      price: cycle.price || '',
      description: cycle.description || '',
      availability: cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock'),
      imageUrl: cycle.imageUrl || cycle.images?.[0]?.url || '',
      category: cycle.category || 'Hybrid',
      isFeatured: cycle.isFeatured ? 'true' : 'false',
    } : { brand: '', model: '', size: '', color: '', price: '', description: '', availability: 'available', imageUrl: '', category: 'Hybrid', isFeatured: 'false' },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        name: data.model, // sync model name to name
        price: Number(data.price),
        isFeatured: data.isFeatured === 'true',
      };

      if (cycle) {
        await api.put(`/api/cycles/${cycle._id}`, payload);
        toast.success('Cycle updated!');
      } else {
        await api.post('/api/cycles', payload);
        toast.success('Cycle added!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-3xl glass-card-dark border border-primary/30 rounded-2xl overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-display font-bold text-xl text-white">{cycle ? 'Edit Cycle' : 'Add New Cycle'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-70px)]">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Brand *</label>
                <select {...register('brand', { required: true })} className={inputClass}>
                  <option value="">Select Brand</option>
                  {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.brand && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Model *</label>
                <input placeholder="e.g. Sprint Pro" {...register('model', { required: true })} className={inputClass} />
                {errors.model && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Size *</label>
                <input placeholder="e.g. 26 inch" {...register('size', { required: true })} className={inputClass} />
                {errors.size && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Colour *</label>
                <input placeholder="e.g. Matte Black" {...register('color', { required: true })} className={inputClass} />
                {errors.color && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Price *</label>
                <input type="number" placeholder="e.g. 12500" {...register('price', { required: true, min: 0 })} className={inputClass} />
                {errors.price && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Category *</label>
                <select {...register('category', { required: true })} className={inputClass}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Availability *</label>
                <select {...register('availability', { required: true })} className={inputClass}>
                  <option value="available">Available</option>
                  <option value="limited_stock">Limited Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Featured</label>
                <select {...register('isFeatured')} className={inputClass}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Image URL *</label>
              <input
                type="url"
                placeholder="e.g. https://images.unsplash.com/photo-..."
                {...register('imageUrl', { required: true })}
                className={inputClass}
              />
              {errors.imageUrl && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Description *</label>
              <textarea rows={4} placeholder="Describe the cycle features..." {...register('description', { required: true })} className={`${inputClass} resize-none`} />
              {errors.description && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>
          </div>

          <div className="p-6 border-t border-white/10">
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 justify-center disabled:opacity-60">
              {isSubmitting ? 'Saving...' : cycle ? 'Save Changes' : 'Add Cycle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminCycles({ openAddModal, setOpenAddModal }) {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [modal, setModal] = useState({ open: false, cycle: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (openAddModal) {
      setModal({ open: true, cycle: null });
      setOpenAddModal(false);
    }
  }, [openAddModal, setOpenAddModal]);

  const fetchCycles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/api/cycles', { params: { page, limit: 10, search } });
      setCycles(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCycles(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCycles]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/cycles/${id}`);
      toast.success('Cycle deleted');
      fetchCycles(pagination.page);
      setDeleteConfirm(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleFeatured = async (cycle) => {
    try {
      await api.put(`/api/cycles/${cycle._id}`, { isFeatured: !cycle.isFeatured });
      toast.success(cycle.isFeatured ? 'Removed from featured' : 'Set as featured');
      fetchCycles(pagination.page);
    } catch {
      toast.error('Failed to update featured state');
    }
  };

  const handleAvailabilityChange = async (cycle, val) => {
    try {
      await api.put(`/api/cycles/${cycle._id}`, { availability: val });
      toast.success('Availability updated!');
      fetchCycles(pagination.page);
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'%3E%3Crect width='60' height='45' fill='%230A1628'/%3E%3C/svg%3E";

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Cycles</h1>
          <p className="text-gray-400 text-sm mt-1">{pagination.total} cycles in inventory</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm transition-all"
            />
          </div>
          <button onClick={() => setModal({ open: true, cycle: null })} className="btn-primary flex-shrink-0">
            <Plus size={18} /> Add New Cycle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card h-16 animate-pulse w-full" />
          ))}
        </div>
      ) : cycles.length === 0 ? (
        <div className="text-center py-24 glass-card">
          <Image size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No cycles match your query</p>
          <button onClick={() => setModal({ open: true, cycle: null })} className="btn-primary">Add Cycle</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-dark-900/60 backdrop-blur-xl">
          <table className="w-full border-collapse text-left text-sm text-gray-400">
            <thead className="bg-dark-900/80 text-xs uppercase tracking-wider text-gray-500 border-b border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Image</th>
                <th scope="col" className="px-6 py-4 font-semibold">Brand</th>
                <th scope="col" className="px-6 py-4 font-semibold">Model</th>
                <th scope="col" className="px-6 py-4 font-semibold">Size</th>
                <th scope="col" className="px-6 py-4 font-semibold">Price</th>
                <th scope="col" className="px-6 py-4 font-semibold">Availability</th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">Edit</th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {cycles.map((cycle) => {
                const availability = cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock');
                return (
                  <tr key={cycle._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={cycle.imageUrl || cycle.images?.[0]?.url || PLACEHOLDER}
                        alt={cycle.model || cycle.name}
                        className="w-16 h-12 object-cover rounded-lg border border-white/10"
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {cycle.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {cycle.model || cycle.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cycle.size || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">
                      ₹{cycle.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={availability}
                        onChange={(e) => handleAvailabilityChange(cycle, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border bg-dark-800 font-semibold cursor-pointer transition-all ${
                          availability === 'available'
                            ? 'text-green-400 border-green-500/25 focus:border-green-500'
                            : availability === 'limited_stock'
                            ? 'text-yellow-400 border-yellow-500/25 focus:border-yellow-500'
                            : 'text-red-400 border-red-500/25 focus:border-red-500'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="limited_stock">Limited Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleFeatured(cycle)}
                          title={cycle.isFeatured ? 'Remove from featured' : 'Set as featured'}
                          className={`p-2 rounded-lg border transition-all ${cycle.isFeatured ? 'border-gold/50 text-gold bg-gold/10' : 'border-white/10 text-gray-400 hover:border-gold/50 hover:text-gold'}`}
                        >
                          {cycle.isFeatured ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
                        </button>
                        <button
                          onClick={() => setModal({ open: true, cycle })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-all"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setDeleteConfirm(cycle._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all mx-auto"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => fetchCycles(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${pagination.page === i + 1 ? 'bg-primary text-white' : 'border border-white/10 text-gray-400 hover:border-primary/50'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal.open && (
          <CycleModal cycle={modal.cycle} onClose={() => setModal({ open: false, cycle: null })} onSuccess={() => fetchCycles(pagination.page)} />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 z-50 bg-black/70" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto glass-card-dark border border-red-500/30 p-6 rounded-2xl">
              <h3 className="font-bold text-white text-lg mb-2">Delete Cycle?</h3>
              <p className="text-gray-400 text-sm mb-6">This will permanently remove the cycle from inventory.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-semibold text-sm transition-all">Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
