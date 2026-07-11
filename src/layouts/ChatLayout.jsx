import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

/**
 * ChatLayout — split-pane for interview chat.
 * Full height layout, containing a top sticky header and scroll-locked main outlet.
 */
const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-canvas overflow-hidden transition-colors duration-base">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col h-full ml-0 md:ml-[260px] transition-all duration-base">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
