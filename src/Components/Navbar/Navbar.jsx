import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComputer,
  faDashboard,
  faDesktop,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
function Navbar() {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (theme === "system" && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="fixed top-0 z-50 w-full dark:bg-gray-800 bg-white  border-b-2  border-gray-500 dark:border-gray-200  ">
  <div className="px-3 py-1 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          type="button" 
          className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path clipRule="evenodd" fillRule="evenodd" d="..." />
          </svg>
        </button>
        <a href="#" className="flex ms-2 md:me-24">
       
          <span className="self-center text-xl font-bold sm:text-2xl whitespace-nowrap dark:text-white text-[#612bc5]">
           Dsport Admin
          </span>
        </a>
      </div>
      
      {/* <div className="flex items-center gap-4">
        <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-xl dark:text-white text-[#612bc5] " />
        </button>
  
      </div> */}
    </div>
  </div>
</nav>

  );
}

export default Navbar;
