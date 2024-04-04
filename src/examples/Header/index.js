import MDButton from "components/MDButton";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navLinks = [
  {
    key: 1,
    path: "/workout-builder",
    label: "workout builder",
  },
  {
    key: 2,
    path: "/workouts",
    label: "workouts",
  },
  {
    key: 3,
    path: "/about-us",
    label: "about us",
  },
];

const Header = () => {
  const location = useLocation();
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
        isScrolled ? "bg-[#7560C5]" : "bg-white "
      }`}
    >
      <div className="flex justify-between items-center container mx-auto">
        {/* Logo or Title */}
        <NavLink to="/">
          <div
            className={`${isScrolled ? "text-white" : "text-[#7560C5]"} text-[25px] cursor-pointer`}
          >
            <span className="">Drag</span>
            <span className="font-semibold">Drop</span>
            <span className="font-bold">Workout</span>
          </div>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8 text-sm">
          {navLinks.map((nav) => (
            <NavLink
              key={nav.key}
              to={nav.path}
              className={`${isScrolled ? "text-white" : "text-[#7560C5]"} ${
                location.pathname === nav.path ? "font-bold" : "font-normal"
              } transition duration-300 ease-in-out uppercase`}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin Button */}
      </div>
    </header>
  );
};

export default Header;
