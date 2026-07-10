import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiList,
  FiGrid,
  FiBarChart2,
  FiSettings,
  FiBook,
  FiHelpCircle,
  FiLogOut,
  FiGithub,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ Menu items matching your design
  const menuItems = [
    { path: '/dashboard', label: 'Client Portal', icon: FiLayout },
    { path: '/dashboard/support', label: 'Support Queue', icon: FiList },
    { path: '/dashboard/backlog', label: 'Dev Backlog', icon: FiGrid },
    { path: '/dashboard/performance', label: 'Performance', icon: FiBarChart2 },
    { path: '/dashboard/admin', label: 'Admin Settings', icon: FiSettings },
  ];

  // ✅ Resources section
  const resourceItems = [
    { path: '/knowledge-base', label: 'Knowledge Base', icon: FiBook },
    { path: '/support', label: 'Support', icon: FiHelpCircle },
  ];

  // ✅ Bottom section (Settings and Logout)
  const bottomItems = [
    { path: '/settings', label: 'Settings', icon: FiSettings },
    { path: '/logout', label: 'Logout', icon: FiLogOut, action: handleLogout },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0A1628] border-r border-[#2D3748] overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2D3748]">
        <h1 className="text-2xl font-bold text-white">
          Java<span className="text-[#2563EB]">PA</span>
        </h1>
        {user && (
          <p className="text-xs text-[#94A3B8] mt-1 truncate">
            Welcome, {user.full_name || user.name || user.email}
          </p>
        )}
      </div>

      {/* Navigation - Flex grow to push bottom items down */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {/* DASHBOARDS Section */}
        <p className="text-xs font-semibold text-[#4A5568] uppercase tracking-wider mb-3">
          DASHBOARDS
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563EB]/10 text-[#2563EB]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1A202C]'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* RESOURCES Section */}
        <p className="text-xs font-semibold text-[#4A5568] uppercase tracking-wider mt-6 mb-3">
          RESOURCES
        </p>
        {resourceItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563EB]/10 text-[#2563EB]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1A202C]'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section - Settings and Logout */}
      <div className="p-4 border-t border-[#2D3748] space-y-1">
        {/* Settings */}
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-[#1A202C] transition-all duration-200"
        >
          <FiSettings size={18} />
          <span>Settings</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-[#1A202C] transition-all duration-200"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#2D3748]">
          <p className="text-[10px] text-[#4A5568] leading-relaxed">
            © 2024 JavaPA Software Limited.
          </p>
          <div className="flex gap-3 mt-1 text-[10px] text-[#4A5568]">
            <a href="#" className="hover:text-[#94A3B8] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#94A3B8] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#94A3B8] transition-colors">SLA Policy</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


