import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * AppLayout — Sidebar + Header + content area for authenticated pages.
 * Desktop: fixed sidebar on the left, top sticky header on the right, scrollable content.
 * Mobile: slide-over drawer sidebar, sticky top header, scrollable content.
 */
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-base">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col min-h-screen">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="ml-0 md:ml-[260px] pt-[56px] min-h-screen transition-all duration-base">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
