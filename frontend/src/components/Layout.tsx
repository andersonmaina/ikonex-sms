import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="bg-background text-on-surface flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="p-lg overflow-y-auto custom-scrollbar flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
