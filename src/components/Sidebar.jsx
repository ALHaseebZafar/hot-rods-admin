import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toggle Button for Mobile */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden px-4 py-2 bg-gray-800 text-white rounded"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-40 w-full bg-gray-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 md:translate-x-0 md:relative md:flex md:w-64`}
      >
        <div className="flex flex-col min-w-full h-full">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <span className="text-white font-bold uppercase">ADMIN PANEL</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex flex-col space-y-2 px-2 py-4 bg-gray-800 w-full">
              {/* Navigation Links */}
              <Link
                to="/professionals"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  Professional
                </button>
              </Link>

              <Link
                to="/inquiry"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  Online/Manual Booking
                </button>
              </Link>

              <Link
                to="/services"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  Services
                </button>
              </Link>

              <Link
                to="/appointments"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  Appointment
                </button>
              </Link>

              <Link
                to="/ordersummary"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  Order Summary
                </button>
              </Link>

              <Link
                to="/contactus"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  ContactUs
                </button>
              </Link>

              <Link
                to="/shoptiming"
                className="w-full hover:bg-gray-700 transition-all duration-300"
              >
                <button className="w-full text-gray-100 px-4 py-2 text-left">
                  ShopTiming
                </button>
              </Link>
              
              
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
