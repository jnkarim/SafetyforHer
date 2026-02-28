import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Layers,
  Shield,
  Settings,
  LogOut,
  UserCircle,
  ShieldAlert,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const menuItems = [
    { id: 'home',      label: t('sidebar.home'),      icon: <Home size={22} />,       path: '/' },
    { id: 'community', label: t('sidebar.community'), icon: <Users size={22} />,      path: '/community' },
    { id: 'series',    label: t('sidebar.series'),    icon: <Layers size={22} />,     path: '/scenarios' },
    { id: 'report',    label: t('sidebar.report'),    icon: <ShieldAlert size={22} />,path: '/report' },
    { id: 'status',    label: t('sidebar.status'),    icon: <Search size={22} />,     path: '/status' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <aside className="w-72 bg-[#0b0813] border-r border-[#1a1425] flex flex-col h-full p-6 z-50">

      {/* Brand */}
      <div
        className="flex items-center gap-3 mb-12 px-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] p-2.5 rounded-2xl shadow-lg shadow-[#ff4b91]/20">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter leading-none">
            Safety<span className="text-[#ff4b91]">for</span>Her
          </h1>
          <p className="text-[9px] text-[#907aa9] mt-1 font-black uppercase tracking-[0.2em]">
            Guardians of Digital Space
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-[#3e324d] uppercase tracking-[0.25em] mb-6 ml-3">
          {t('sidebar.main_menu')}
        </p>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full group flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-[#ff4b91]/10 text-[#ff4b91] border border-[#ff4b91]/20'
                : 'text-[#907aa9] hover:bg-[#1a1425] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`${isActive(item.path) ? 'text-[#ff4b91]' : 'group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
            {isActive(item.path) && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff4b91]" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4 pt-6 border-t border-[#1a1425]">

        <div className="p-4 bg-gradient-to-br from-[#1a1425] to-[#15101f] rounded-[24px] border border-[#2d2438] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2d2438] flex items-center justify-center text-[#ff4b91] border border-[#ff4b91]/20">
            <UserCircle size={24} />
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-xs font-black text-white truncate uppercase">
              {user?.username || t('sidebar.guest')}
            </p>
            <p className="text-[10px] text-[#907aa9] font-bold truncate">
              {user?.email || t('sidebar.anonymous')}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#3e324d] hover:text-red-500 transition-colors active:scale-90"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP: static sidebar ── */}
      <div className="hidden lg:flex h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* ── MOBILE: top navbar + slide-in drawer ── */}
      <div className="lg:hidden">

        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0b0813] border-b border-[#1a1425] flex items-center justify-between px-5">
          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-br from-[#ff4b91] to-[#7c3aed] p-2 rounded-xl shadow-lg shadow-[#ff4b91]/20">
              <Shield size={18} className="text-white" />
            </div>
            <h1 className="text-base font-black text-white tracking-tighter leading-none">
              Safety<span className="text-[#ff4b91]">for</span>Her
            </h1>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-[#907aa9] hover:text-white hover:bg-[#1a1425] transition-all"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Spacer so page content clears the fixed bar */}
        <div className="h-16" />

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-[-48px] z-10 p-2 rounded-xl bg-[#1a1425] text-[#907aa9] hover:text-white transition-all border border-white/5"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;