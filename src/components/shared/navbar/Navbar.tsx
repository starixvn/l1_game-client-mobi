import React from "react";
import Account from "../account";

const Navbar = () => {
  return (
    <nav className="navbar pb-3">
      <div className="relative flex h-8 sm:h-8 items-center justify-between">
        <div className="flex items-center sm:justify-between"></div>
        <Account />
      </div>
    </nav>
  );
};

export default Navbar;
