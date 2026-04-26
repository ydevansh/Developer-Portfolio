import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaBlog, FaEnvelope, FaCode, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (desktop) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FaProjectDiagram, label: 'Projects', path: '/admin/projects' },
    { icon: FaBlog, label: 'Blogs', path: '/admin/blogs' },
    { icon: FaEnvelope, label: 'Messages', path: '/admin/messages' },
    { icon: FaCode, label: 'Skills', path: '/admin/skills' },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;
  const showSidebarText = !isDesktop || sidebarOpen;

  const handleNavigate = (path) => {
    navigate(path);

    if (!isDesktop) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-primary-900 overflow-hidden">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-72 md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'} fixed md:static inset-y-0 left-0 z-40 bg-primary-950 border-r border-primary-500/20 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              DY
            </div>
            {showSidebarText && (
              <div>
                <h2 className="text-lg font-bold">Admin</h2>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  active
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:bg-primary-500/10 hover:text-primary-400'
                }`}
              >
                <Icon size={20} />
                {showSidebarText && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <FaSignOutAlt size={20} />
            {showSidebarText && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="hidden md:block p-4 border-t border-primary-500/20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg transition-all"
          >
            {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="md:hidden sticky top-0 z-20 bg-primary-950/95 backdrop-blur border-b border-primary-500/20 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 transition-colors"
            aria-label="Open sidebar"
          >
            <FaBars size={18} />
          </button>

          <p className="text-sm font-semibold text-gray-200">Admin Panel</p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
