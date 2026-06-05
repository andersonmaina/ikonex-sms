import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/' },
  { name: 'Class Streams', icon: 'account_tree', path: '/class-streams' },
  { name: 'Students', icon: 'groups', path: '/students' },
  { name: 'Subjects', icon: 'book', path: '/subjects' },
  { name: 'Assessments', icon: 'assignment', path: '/assessments' },
  { name: 'Analytics', icon: 'analytics', path: '/analytics' },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-[280px] h-screen sticky left-0 top-0 bg-surface-container-low border-r border-outline-variant flex-col py-lg px-md gap-sm z-50 no-print">
      <div className="flex items-center gap-md px-md mb-xl">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-lg">
          <span className="material-symbols-outlined">school</span>
        </div>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">Ikonex SMS</h1>
          <p className="font-label-md text-label-md text-on-surface-variant">Academic Management</p>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-xs">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg transition-all active:scale-[0.98] ${
                isActive || (item.path !== '/' && window.location.pathname.startsWith(item.path))
                  ? 'text-primary font-bold bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={(isActive || (item.path !== '/' && window.location.pathname.startsWith(item.path))) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-lg border-t border-outline-variant flex flex-col gap-xs">
        <a
          href="#"
          className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
