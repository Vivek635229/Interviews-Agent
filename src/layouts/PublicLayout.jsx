import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/**
 * PublicLayout — Navbar + Footer for landing and auth pages.
 */
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-[56px]">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
