import { NavLink } from 'react-router-dom';
import { Play, History, Mic2, Settings } from 'lucide-react';

export const SideBar = () => {
  const navItems = [
    { path: '/playground', label: 'Playground', Icon: Play },
    { path: '/history', label: 'Session History', Icon: History },
    { path: '/library', label: 'Voice Library', Icon: Mic2 },
    { path: '/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-gray-600 h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-gray-300">NexCast</h1>
        <p className="text-xl text-gray-500 mt-0.5">Live Commentary</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-xl font-medium transition-all no-underline ${
                      isActive
                        ? 'bg-gray-800 text-gray-50 border border-gray-700'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-50 border border-transparent'
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">© 2025 NexCast</p>
      </div>
    </aside>
  );
};

export default SideBar;
