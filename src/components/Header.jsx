import React from 'react';

function Header() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[100px] h-[90px]">  {/* Increased the width and height */}
        <img 
          src="/logo.png"
          alt="Description of image"
          className="w-full h-full object-contain"  
        />
      </div>
    </div>
  );
}

export default Header;
