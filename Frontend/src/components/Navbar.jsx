import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTicketAlt,
  FaEmpire,
  FaDashcube,
} from "react-icons/fa";
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
    <>
      {/* <div className='flex h-5 bg-transparent z-50 backdrop-blur-md fixed'></div> */}
      <nav className='bg-transparent border border-zinc-600 px-4 md:px-6 py-4 w-1/2 rounded-full backdrop-blur-md fixed z-50 mt-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Link to='/' className='flex items-center space-x-2'>
              <FaDashcube className='text-blue-600 h-8 md:h-11' />
              <h1 className='text-xl font-bold text-gray-100 max-md:hidden'>
                Event Wave
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-6'>
            <Link
              to='/my-events'
              className={`flex items-center space-x-2 ${
                window.location.pathname === "/my-events"
                  ? "text-gray-300 underline underline-offset-4"
                  : "text-gray-100"
              } hover:text-gray-300`}
            >
              <FaTicketAlt />
              <span>My Events</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to='/dashboard'
                className={`flex items-center space-x-2 ${
                  window.location.pathname === "/dashboard"
                    ? "text-gray-300 underline underline-offset-4"
                    : "text-gray-100"
                } hover:text-gray-300`}
              >
                <FaEmpire />
                <span>Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className='bg-gray-200 px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-300'
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-gray-600'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden mt-4 space-y-4 bg-transparent'>
            <div className='flex flex-col space-y-4'>
              <Link
                to='/my-events'
                className='flex items-center space-x-2 px-4 py-2 text-zinc-50'
                onClick={() => setIsOpen(false)}
              >
                <FaTicketAlt />
                <span>My Events</span>
              </Link>

              {user?.role === "admin" && (
                <Link
                  to='/dashboard'
                  className='flex items-center space-x-2 px-4 py-2 text-zinc-50'
                  onClick={() => setIsOpen(false)}
                >
                  <FaDashcube />
                  <span>Dashboard</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className='bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-center w-full'
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
