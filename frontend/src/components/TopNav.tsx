import React from 'react';

const TopNav = () => {
  return (
    <header className="w-full top-0 sticky z-40 bg-surface shadow-sm h-16">
      <div className="flex justify-between items-center px-lg h-full w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-md flex-1">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-full font-body-md text-body-md focus:ring-2 focus:ring-primary-container outline-none transition-shadow"
              placeholder="Search students, IDs, or classes..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low px-sm py-1 rounded-full transition-colors">
            <span className="font-label-md text-label-md font-bold text-primary">Admin</span>
            <span className="material-symbols-outlined text-[32px] text-primary">account_circle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
