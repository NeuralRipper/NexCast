import { NavLink } from 'react-router-dom';
import { Play, History, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SideBar = () => {
  const navItems = [
    { path: '/playground', label: 'Playground', Icon: Play },
    { path: '/history', label: 'Session History', Icon: History },
    { path: '/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <Card className="w-64 bg-gray-800 border-gray-700 h-screen flex flex-col flex-shrink-0 rounded-none border-l-0 border-t-0 border-b-0">
      {/* Logo/Brand */}
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-4xl font-bold text-gray-400 text-center">NexCast</h1>
        <p className="text-xl text-gray-400 text-center">Live Commentary</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all no-underline ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
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
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">© 2025 NexCast</p>
      </div>
    </Card>
  );
};

export default SideBar;
