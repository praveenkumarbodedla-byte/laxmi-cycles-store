import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import LoadingScreen from './components/layout/LoadingScreen';
import WhatsAppButton from './components/layout/WhatsAppButton';

// Public Pages
import Home from './pages/Home';
import Cycles from './pages/Cycles';
import CycleDetail from './pages/CycleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import Compare from './pages/Compare';
import Login from './pages/Login';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';

/* ── Admin-only protected route ─────────────────────────────────────────
   Allows access only when the user is both authenticated AND an admin.
   Redirects unauthenticated users to /login.                           */
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

/* ── Public layout wrapper ───────────────────────────────────────────────
   All public pages are now fully accessible without login.
   Authentication is only required when performing protected actions
   (e.g., submitting an enquiry, writing a review).                     */
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const hideFooterRoutes = ['/cycles', '/collection', '/compare', '/reviews', '/gallery'];
  const showFooter = !hideFooterRoutes.includes(location.pathname) && !location.pathname.startsWith('/cycles/');

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
      <WhatsAppButton />
    </>
  );
};

// AppRoutes uses useLocation inside BrowserRouter context
function AppRoutes() {
  const location = useLocation();
  return (
    <Routes location={location}>
      {/* ── Fully public routes — no login required to browse ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/cycles" element={<PublicLayout><Cycles /></PublicLayout>} />
      <Route path="/collection" element={<PublicLayout><Cycles /></PublicLayout>} />
      <Route path="/cycles/:id" element={<PublicLayout><CycleDetail /></PublicLayout>} />
      <Route path="/compare" element={<PublicLayout><Compare /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* ── Admin routes — protected, admin credentials required ── */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

      {/* ── 404 ── */}
      <Route path="*" element={
        <PublicLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-8xl font-display font-bold gradient-text mb-4">404</h1>
              <p className="text-gray-400 text-xl mb-8">Page not found</p>
              <Link to="/" className="btn-primary">Go Home</Link>
            </div>
          </div>
        </PublicLayout>
      } />
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <BrowserRouter>
        <AuthProvider>
          <CompareProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0A1628',
                  color: '#fff',
                  border: '1px solid rgba(0,102,255,0.3)',
                  borderRadius: '12px',
                },
                success: { iconTheme: { primary: '#0066FF', secondary: '#fff' } },
                error: { iconTheme: { primary: '#FF4444', secondary: '#fff' } },
              }}
            />
            <AppRoutes />
          </CompareProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
