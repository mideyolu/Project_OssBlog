import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import {FaMoon, FaSun} from 'react-icons/fa'

const Navbar = ({ toggleDarkMode, isDarkMode }) => {
  const [open, setOpen] = useState(false); // State to manage the visibility of the license menu

  const menu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="navbar py-4 rounded-md shadow-md text-black dark:text-white">
      <div className="flex items-center justify-around gap-1">
        <div className="text-lg font-bold">OSS BLOG</div>
        <div className="block md:hidden relative cursor-pointer" onClick={menu}>
          {open ? (
            <RxCross1 className="text-[1.7rem]" />
          ) : (
            <IoMenu className="text-[2rem]" />
          )}
        </div>
        <div className="hidden md:flex items-center justify-between gap-[4rem]">
          <Link to={"/"}>Home</Link>
          <Link to={"/projects"}>Projects</Link>
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-900 text-white rounded"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <div
          className={`${
            open ? "top-[10%] shadow-md" : "-top-[100%]"
          } absolute mt-2 right-[20%] flex flex-col items-center
            justify-between gap-[4rem] py-2 px-8 w-[25%] rounded-md transition-all duration-300 z-100
            ease-in-out md:hidden  shadow-xl text-black dark:text-white`}
        >
          <Link to={"/"} onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to={"/projects"} onClick={() => setOpen(false)}>
            Projects
          </Link>
          {/* Dark Mode Toggle Button for Mobile */}
          <button
            onClick={() => {
              toggleDarkMode();
              setOpen(false);
            }}
            className="px-4 py-2 mt-4 bg-gray-900 text-white rounded"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
