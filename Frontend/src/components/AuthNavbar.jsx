import React from "react";
import { Link } from "react-router-dom";
import { MdHive } from "react-icons/md";

const AuthNavbar = () => {
  return (
    <nav className='bg-white px-4 md:px-6 py-4'>
      <div className='flex w-full items-center justify-center space-x-4'>
        <Link to='/' className='flex items-center r space-x-2'>
          <h1 className='text-xl font-bold text-Eventgray'>Event <span className="text-Eventhive">Hive</span></h1>
          <MdHive className='text-Eventhive h-8 md:h-11' />
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
