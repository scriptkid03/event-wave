import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHouseUser,
} from "react-icons/fa";
import { MdHive } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='bg-white px-4 md:px-6 py-4'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-4'>
        <Link to='/' className='flex items-center r space-x-2'>
          <h1 className='text-xl font-bold text-Eventgray'>Event <span className="text-Eventhive">Hive</span></h1>
          <MdHive className='text-Eventhive h-8 md:h-11' />
        </Link>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-6'>
          <Link
            to='/my-events'
            className={`flex items-center space-x-2 ${
              window.location.pathname === "/my-events"
                ? "text-Eventchar"
                : "text-Eventchar"
            } hover:text-Eventchar`}
          >
            <IoBookmarksSharp />
            <span>My Reservations</span>
          </Link>

          {user?.role === "admin" && (
            <Link
              to='/dashboard'
              className={`flex items-center space-x-2 ${
                window.location.pathname === "/dashboard"
                  ? "text-Eventchar"
                  : "text-Eventchar"
              } hover:text-Eventchar`}
            >
              <FaHouseUser />
              <span>Dashboard</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className='bg-Eventchar px-4 py-2 rounded-lg text-white hover:bg-Eventhive'
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-Eventchar'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden mt-4 space-y-4'>
          <div className='flex flex-col space-y-4'>
            <Link
              to='/my-events'
              className={`flex items-center space-x-2 px-4 py-2 ${
                window.location.pathname === "/my-events"
                  ? "text-Eventchar"
                  : "text-Eventchar"
              } hover:text-Eventchar`}
              onClick={() => setIsOpen(false)}
            >
              <IoBookmarksSharp />
              <span>My Reservations</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to='/dashboard'
                className={`flex items-center space-x-2 px-4 py-2 ${
                  window.location.pathname === "/dashboard"
                    ? "text-Eventchar"
                    : "text-Eventchar"
                } hover:text-Eventchar`}
                onClick={() => setIsOpen(false)}
              >
                <FaHouseUser />
                <span>Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className='bg-Eventchar px-4 py-2 rounded-lg text-white hover:bg-Eventhive w-full'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
