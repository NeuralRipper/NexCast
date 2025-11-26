import { NavLink } from 'react-router-dom';
import { Play, History, Settings } from 'lucide-react';

export const SideBar = () => {
  const navItems = [
    { path: '/playground', label: 'Playground', Icon: Play },
    { path: '/history', label: 'Session History', Icon: History },
    { path: '/settings', label: 'Settings', Icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-gray-700 bg-gray-800 h-screen flex flex-col flex-shrink-0">
      {/* Logo/Brand */}
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-4xl font-bold text-gray-400 text-center">NexCast</h1>
        <p className="text-xl text-gray-400 text-center">Live Commentary</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-xl font-medium transition-colors no-underline ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2025 NexCast</p>
      </div>
    </aside>
  );
};

export default SideBar;
