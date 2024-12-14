import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { motion } from "framer-motion";

const Home = () => {
  const pageVariants = {
    initial: { opacity: 0, backgroundColor: "#0c0a09" },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='h-screen overflow-hidden bg-[#0c0a09] text-gray-100'
    >
      <div className="flex flex-col h-full">
        <Navbar />
        <div className="flex-1">
          <Hero />
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
