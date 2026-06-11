import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import LogoMark from '../components/layout/LogoMark';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const { login, register: signUpUser, forgotPassword, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // If already logged in, redirect to correct dashboard/home page
  if (user) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        const isAdminEmail = data.email.trim().toLowerCase() === 'admin@laxmicycles.com';
        const role = isAdminEmail ? 'admin' : 'user';
        await login(data.email, data.password, role);
        if (isAdminEmail) {
          toast.success(t('login.loginSuccessAdmin'));
          navigate('/admin');
        } else {
          toast.success(t('login.loginSuccess'));
          navigate('/');
        }
      } else if (mode === 'signup') {
        await signUpUser(data.name, data.email, data.password);
        toast.success(t('login.signupSuccess'));
        navigate('/');
      } else if (mode === 'forgot') {
        await forgotPassword(data.name, data.email, data.newPassword);
        toast.success(t('login.resetSuccess'));
        setMode('login');
        reset();
      }
    } catch (err) {
      const errMsg = err.message || 'Action failed';
      let displayMsg = errMsg;
      if (errMsg.toLowerCase().includes('invalid credentials') || errMsg.toLowerCase().includes('incorrect password')) {
        displayMsg = t('login.errorInvalidCredentials', '❌ Invalid email or password');
      } else if (errMsg.toLowerCase().includes('account not found') || errMsg.toLowerCase().includes('no matching account')) {
        displayMsg = t('login.errorAccountNotFound', '❌ Account not found');
      } else if (errMsg.toLowerCase().includes('user already exists')) {
        displayMsg = t('login.errorUserExists', '❌ User already exists with this email');
      } else {
        displayMsg = `${t('login.actionFailed', 'Action failed')}: ${errMsg}`;
      }
      toast.error(displayMsg);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#050A14] flex items-center justify-center px-4 relative overflow-hidden bg-noise">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,102,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-20 mx-auto mb-4 flex items-center justify-center">
            <LogoMark width={72} height={72} className="animate-pulse" />
          </div>
          <h1 className="font-display font-bold text-3xl tracking-widest text-white">LAXMI CYCLES</h1>
          <p className="text-primary text-xs font-semibold tracking-[0.4em] mt-1.5 uppercase">{t('login.brandTagline')}</p>
        </div>

        <div className="glass-card-dark border border-white/10 p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Form Title */}
              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-2xl">
                  {mode === 'login' && t('login.welcomeBack')}
                  {mode === 'signup' && t('login.createAccount')}
                  {mode === 'forgot' && t('login.resetPassword')}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {mode === 'login' && t('login.subtitleLogin')}
                  {mode === 'signup' && t('login.subtitleSignup')}
                  {mode === 'forgot' && t('login.subtitleForgot')}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name field (for Signup and Forgot password verification) */}
                {(mode === 'signup' || mode === 'forgot') && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wider uppercase">{t('login.fullName')}</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                         type="text"
                        placeholder={t('login.fullNamePlaceholder')}
                        {...register('name', { required: t('login.nameRequired') })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700/50 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wider uppercase">{t('login.emailAddress')}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      {...register('email', { required: t('login.emailRequired') })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-700/50 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                {mode !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">{t('login.password')}</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => toggleMode('forgot')}
                          className="text-xs text-primary hover:text-accent font-semibold transition-colors"
                        >
                          {t('login.forgot')}
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password', {
                          required: t('login.passwordRequired'),
                          minLength: { value: 6, message: t('login.minLength') }
                        })}
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-dark-700/50 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                )}

                {/* New Password Field (for Forgot mode) */}
                {mode === 'forgot' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wider uppercase">{t('login.newPassword')}</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('newPassword', {
                          required: t('login.newPasswordRequired'),
                          minLength: { value: 6, message: t('login.minLength') }
                        })}
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-dark-700/50 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-3.5 justify-center text-sm font-bold tracking-wider mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('login.processing') : (
                    mode === 'login' ? t('login.loginBtn') :
                    mode === 'signup' ? t('login.signupBtn') : t('login.resetBtn')
                  )}
                </motion.button>
              </form>

              {/* Mode Toggle Footer */}
              <div className="mt-6 pt-5 border-t border-white/5 text-center text-sm">
                {mode === 'login' && (
                  <p className="text-gray-400">
                    {t('login.noAccount')}{' '}
                    <button
                      onClick={() => toggleMode('signup')}
                      className="text-primary hover:text-accent font-semibold transition-colors"
                    >
                      {t('login.signUp')}
                    </button>
                  </p>
                )}
                {mode === 'signup' && (
                  <p className="text-gray-400">
                    {t('login.haveAccount')}{' '}
                    <button
                      onClick={() => toggleMode('login')}
                      className="text-primary hover:text-accent font-semibold transition-colors"
                    >
                      {t('login.logIn')}
                    </button>
                  </p>
                )}
                {mode === 'forgot' && (
                  <button
                    onClick={() => toggleMode('login')}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-semibold transition-colors uppercase tracking-wider"
                  >
                    <ArrowLeft size={12} /> {t('login.backToLogin')}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
