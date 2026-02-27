import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Gamepad2, 
  Shield, 
  Settings, 
  LogOut, 
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home Feed', icon: <Home size={22} />, path: '/' },
    { id: 'community', label: 'Community Feed', icon: <Users size={22} />, path: '/community' },
    { id: 'scenarios', label: 'Scenario Arena', icon: <Gamepad2 size={22} />, path: '/scenarios' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-[#0b0813] border-r border-[#1a1425] flex flex-col sticky top-0 h-screen p-6 z-50">
      
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
          Main Menu
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
        
        <button 
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-4 px-5 py-3 text-[#907aa9] hover:text-white transition-all text-sm font-bold"
        >
          <Settings size={20} /> Settings
        </button>
        
        <div className="p-4 bg-gradient-to-br from-[#1a1425] to-[#15101f] rounded-[24px] border border-[#2d2438] flex items-center gap-3">
          
          <div className="w-10 h-10 rounded-xl bg-[#2d2438] flex items-center justify-center text-[#ff4b91] border border-[#ff4b91]/20">
            <UserCircle size={24} />
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase">
              {user?.username || 'Guest'}
            </p>
            <p className="text-[10px] text-[#907aa9] font-bold">
              {user?.email || ''}
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
};

export default Sidebar;