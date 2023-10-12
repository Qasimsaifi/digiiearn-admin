import React from "react";

const Navbar = () => {
  return (
    <div>
      <header className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
       
          <div>
            <a href="/withdrawal" className="text-white font-bold text-lg hover:underline">
              Withdraw
            </a>
          </div>
          <div>
            <a href="/course" className="text-white font-bold text-lg hover:underline ml-8">
              Course
            </a>
          </div>
          <div>
            <a href="/" className="text-white font-bold text-lg hover:underline ml-8">
              Home
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
