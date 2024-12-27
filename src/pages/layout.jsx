import React from "react";
import Header from "../components/Header"; // Import Header component
import Sidebar from "../components/Sidebar";
function Layout({ children }) {
  return (
    <div>
      <Header /> {/* Add the Header component */}
      <div className="w-full flex min-h-screen ">
        <div className="max-w-max ">
          <Sidebar />
        </div>
        <div className="w-[80%]">{children}</div>
      </div>
    </div>
  );
}
export default Layout;