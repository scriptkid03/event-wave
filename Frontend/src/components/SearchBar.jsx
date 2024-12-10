import React from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search events...'
        className='w-full bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg border border-zinc-600 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-600 outline-none transition-all'
      />
    </motion.div>
  );
};

export default SearchBar;
