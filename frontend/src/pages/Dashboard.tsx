import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

const Dashboard = () => {
  return (
    <div className="space-y-lg max-w-[1440px] mx-auto w-full">
      {/* Welcome Section */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Academic Overview</h2>
          <p className="text-on-surface-variant font-body-lg">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
        <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md flex items-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
          <span className="material-symbols-outlined">add</span>
          Generate Report
        </button>
      </section>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Total Students */}
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-headline-md">group</span>
            </div>
            <span className="flex items-center text-secondary font-bold text-label-md bg-secondary-container px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span> 5%
            </span>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Total Students</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">1,284</h3>
          </div>
        </div>

        {/* Active Streams */}
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-headline-md">hub</span>
            </div>
            <span className="text-label-md text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-full">8 New Units</span>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Active Class Streams</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">42</h3>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-surface-tint group-hover:bg-surface-tint group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-headline-md">star</span>
            </div>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Average GPA</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">3.4</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
