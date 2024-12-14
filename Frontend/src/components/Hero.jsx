import React from "react";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Floating Circles */}
      <div className="absolute inset-0">
        <div className="absolute h-[150px] md:h-[300px] w-[150px] md:w-[300px] rounded-full bg-Eventhive/20 -top-20 -left-20 animate-float-slow"></div>
        <div className="absolute h-[100px] md:h-[200px] w-[100px] md:w-[200px] rounded-full bg-Eventblue/10 top-40 right-20 animate-float-medium"></div>
        <div className="absolute h-[75px] md:h-[150px] w-[75px] md:w-[150px] rounded-full bg-Eventchar/15 bottom-20 left-40 animate-float-fast"></div>
        <div className="absolute h-[125px] md:h-[250px] w-[125px] md:w-[250px] rounded-full bg-Eventhive/10 -bottom-20 -right-20 animate-float-slow"></div>
        <div className="absolute h-[90px] md:h-[180px] w-[90px] md:w-[180px] rounded-full bg-Eventblue/20 top-1/2 left-1/3 animate-float-medium"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-8xl font-extrabold leading bg-gradient-to-r from-Eventhive to-Eventblue bg-clip-text text-transparent">
          Book Amazing Campus Events
        </h1>
        <p className="mt-6 text-base md:text-2xl text-gray-600 max-w-3xl">
          Join a vibrant community of students and explore opportunities to learn, 
          connect, and create memorable experiences by booking events.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/events"
            className="px-8 py-4 bg-Eventhive text-white rounded-full text-lg font-semibold transition-all hover:shadow-lg hover:scale-105"
          >
            Explore Events
          </Link>
          
        </div>

        {/* Stats Section */}
        <div className="mt-20 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-Eventhive">500+</div>
            <div className="text-gray-600 mt-2">Active Events</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-Eventhive">10k+</div>
            <div className="text-gray-600 mt-2">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-Eventhive">50+</div>
            <div className="text-gray-600 mt-2">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
