import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toggle Button for Mobile */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden px-4 py-2 bg-[#4B2E2E] text-white rounded-lg shadow-md transition-all duration-300 hover:bg-brown-primary"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-40 w-full bg-[#4B2E2E] transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:relative md:flex md:w-64`}
      >
        <div className="flex flex-col min-w-full h-full">
          <div className="flex items-center justify-center h-16 bg-brown-primary shadow-md">
            <span className="text-white font-montserrat font-bold uppercase tracking-widest">ADMIN PANEL</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex flex-col space-y-2 px-2 py-4">
              {/* Navigation Links */}
              {[
                { path: '/professionals', label: 'Professional' },
                { path: '/inquiry', label: 'Online/Manual Booking' },
                { path: '/services', label: 'Services' },
                { path: '/appointments', label: 'Appointment' },
                { path: '/ordersummary', label: 'Order Summary' },
                { path: '/contactus', label: 'Contact Us' },
                { path: '/shoptiming', label: 'Shop Timing' },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="w-full hover:bg-[#6A4C4C] transition-all duration-300 rounded-lg"
                >
                  <button className="w-full text-gray-100 px-4 py-2 text-left font-montserrat tracking-tight">
                    {link.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
