import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bike, MessageSquare, Star, PlusCircle, Settings,
  LogOut, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LogoMark from './LogoMark';

// Import Admin pages directly
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminCycles from '../../pages/admin/AdminCycles';
import AdminEnquiries from '../../pages/admin/AdminEnquiries';
import AdminReviews from '../../pages/admin/AdminReviews';

const AdminSettings = () => (
  <div className="glass-card p-8 text-center max-w-md mx-auto mt-12 border border-primary/20">
    <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
    <p className="text-gray-400 mb-6">Manage showroom application settings, admin password, and system credentials.</p>
    <p className="text-xs text-primary font-semibold">Settings panel coming soon in the next release!</p>
  </div>
);

export default function AdminLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openAddModal, setOpenAddModal] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cycles', label: 'Manage Cycles', icon: Bike },
    { id: 'add_cycle', label: 'Add New Cycle', icon: PlusCircle },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050A14] flex flex-col text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-[100] flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080F1E]/90 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-blue overflow-hidden">
            <LogoMark width={30} height={30} />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-wider text-white block">LAXMI CYCLES</span>
            <span className="text-[9px] text-accent font-semibold tracking-wider block">BUSINESS CENTER</span>
          </div>
        </div>

        {/* Profile Dropdown Control Center */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-dark-700/50 hover:bg-dark-700 hover:border-primary/40 transition-all font-semibold text-sm text-white focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold border border-primary/30">
              👤
            </div>
            <span className="hidden sm:inline">Admin</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Overlay to close */}
                <div className="fixed inset-0 z-[105]" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0A1628]/95 border border-white/10 shadow-xl backdrop-blur-md p-2 z-[110] space-y-1"
                >
                  {menuItems.map((item) => {
                    const active = activeTab === item.id || (item.id === 'add_cycle' && openAddModal);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setDropdownOpen(false);
                          if (item.id === 'add_cycle') {
                            setActiveTab('cycles');
                            setOpenAddModal(true);
                          } else {
                            setActiveTab(item.id);
                          }
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 text-left ${
                          active
                            ? 'text-white bg-primary/20 border border-primary/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}

                  <div className="border-t border-white/5 my-1" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 text-sm font-semibold text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <AdminDashboard
                setActiveTab={setActiveTab}
                setOpenAddModal={setOpenAddModal}
              />
            )}
            {activeTab === 'cycles' && (
              <AdminCycles
                openAddModal={openAddModal}
                setOpenAddModal={setOpenAddModal}
              />
            )}
            {activeTab === 'enquiries' && <AdminEnquiries />}
            {activeTab === 'reviews' && <AdminReviews />}
            {activeTab === 'settings' && <AdminSettings />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
