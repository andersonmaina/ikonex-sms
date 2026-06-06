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
      <div className="w-[280px] bg-primary text-on-primary py-xl flex flex-col items-center justify-center mb-xl shadow-md -mt-lg -mx-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-on-primary text-primary flex items-center justify-center shadow-lg mb-md relative z-10">
          <span className="material-symbols-outlined text-4xl">school</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight relative z-10">Ikonex</h1>
        <p className="font-label-md text-label-md text-primary-container relative z-10 tracking-widest uppercase mt-xs">Academic Management</p>
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
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
