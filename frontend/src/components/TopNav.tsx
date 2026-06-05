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
          <div className="flex items-center gap-sm">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-outline-variant"></div>
          <div className="flex items-center gap-md cursor-pointer hover:bg-surface-container-low px-sm py-1 rounded-full transition-colors">
            <div className="text-right hidden sm:block">
              <p className="font-label-md text-label-md font-bold text-primary">Admin Profile</p>
              <p className="text-[10px] leading-tight text-on-surface-variant">Principal Office</p>
            </div>
            <img
              alt="Administrator profile photo"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxPa-tpnaAofIF5LienDa6KCT2jZmK780pXHb4-VYiLjJav-AYOb-IxQ783tHaMdVfmoclMMwEn_DFpEuy8qngzHi212O6bNxSAlKHCTxjLL3CYBZvzbOCbLDmQOB78u3_C1XLCTiSlgTE3J22mgM9xLGu4-XJdg3ZWfwf9gGfdl0yOKbZkj3rGPfjzJnVRLnn8e9Slfv1CdFmOqwAIV0GKDkwX-uZJsHbPmyKFIdv8Bxnai1fUBHQBM_1zuStkp2VrWLOcGu2oVMj"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
