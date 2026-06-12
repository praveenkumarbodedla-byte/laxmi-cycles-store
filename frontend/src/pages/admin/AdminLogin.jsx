import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import LogoMark from '../../components/layout/LogoMark';

export default function AdminLogin() {
  const { login, logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }) => {
    try {
      const response = await login(email, password);
      if (response.user.role !== 'admin') {
        logout();
        throw new Error('Access denied: Admin role required');
      }
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-accent/8 rounded-full blur-[80px]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(0,102,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-24 h-20 mx-auto mb-4 flex items-center justify-center">
            <LogoMark width={72} height={72} className="animate-pulse" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-widest text-white">LAXMI CYCLES</h1>
          <p className="text-accent text-xs font-semibold tracking-[0.3em] mt-1">ADMIN PANEL</p>
        </div>

        <div className="glass-card-dark border border-primary/20 p-8 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={20} className="text-primary" />
            <h2 className="font-bold text-white text-lg">Secure Admin Access</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@laxmicycles.com"
                  {...register('email', { required: 'Email required' })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your admin password"
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3.5 justify-center text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Login to Admin Panel'}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-5">
            🔒 This area is restricted to authorized administrators only.
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">← Back to Website</a>
        </p>
      </motion.div>
    </div>
  );
}
