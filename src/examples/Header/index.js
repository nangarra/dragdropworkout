import MDButton from "components/MDButton";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ease-in-out py-4 ${
        isScrolled ? "bg-[#192043]" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center container mx-auto">
        {/* Logo or Title */}
        <NavLink to="/">
          <div className="text-white text-[25px] cursor-pointer">
            <span className="">Drag</span>
            <span className="font-semibold">Drop</span>
            <span className="font-bold">Workout</span>
          </div>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm">
          <a
            href="#"
            className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
          >
            Features
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition duration-300 ease-in-out"
          >
            About Us
          </a>
        </nav>

        {/* Admin Button */}
        <div className="flex items-center gap-4">
          <NavLink to="/">
            <MDButton size="small" variant="contained" color="white" type="submit">
              Workout Builder
            </MDButton>
          </NavLink>

          {/* <NavLink to="/admin/sign-in">
            <MDButton size="small" variant="text" color="white" type="submit">
              Admin
            </MDButton>
          </NavLink> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
