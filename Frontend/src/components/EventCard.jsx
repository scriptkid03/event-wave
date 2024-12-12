import React from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import RSVPButton from "./events/RSVPButton";

const EventCard = ({
  title,
  startDate,
  endDate,
  description,
  organizer,
  seatsLeft,
  type, // New prop for event type
  location, // Added location prop
  isFiltered = false, // New prop to handle filtered state
  image,
  create_Button,
  id,
  onClick,
  event,
  onRSVP,
}) => {
  return (
    <motion.div className='relative h-full'>
      <div className='p-4'>
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='w-full h-48 object-cover rounded-lg'
          src={image}
          alt={title}
        />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='mt-4'
        >
          <h3 className='text-xl font-semibold text-gray-100'>{title}</h3>
          <p className='text-gray-400 mt-2 max-h-[6rem] line-clamp-1  '>
            {description}
          </p>

          <div className='mt-4 space-y-2'>
            <div className='flex items-center text-gray-400'>
              <svg
                className='w-4 h-4 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                  clipRule='evenodd'
                />
              </svg>
              <span>
                {new Date(startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" - "}
                {new Date(endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className='flex items-center text-gray-400'>
              <svg
                className='w-4 h-4 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{location}</span>
            </div>

            <div className='flex items-center text-gray-400'>
              <svg
                className='w-4 h-4 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
              <span>By {organizer}</span>
            </div>

            <div className='flex items-center text-gray-400'>
              <svg
                className='w-4 h-4 mr-2'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              </svg>
              <span>
                {new Date(startDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) +
                  " - " +
                  new Date(endDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
          </div>

          <div className='mt-4 flex justify-between items-center'>
            <span className='text-primary font-medium'>
              {seatsLeft} seats left
            </span>
            <span className='px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm'>
              {type}
            </span>
          </div>

          {/* Book Button */}
          {seatsLeft > 0 && (
            // <button
            //   onClick={() => navigate(`/event-bookings/${id}`)}
            //   className='mt-4 px-4 py-2 w-full bg-gray-700 text-gray-300 rounded-xl text-sm'
            // >
            //   Book
            // </button>
            <RSVPButton event={event} onRSVP={onRSVP} />
          )}
        </motion.div>
      </div>
      {create_Button && (
        <button
          onClick={onClick}
          className='absolute flex-1 top-0 right-0 w-full h-full flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-lg'
        >
          <FaPlus />
        </button>
      )}
    </motion.div>
  );
};

export default EventCard;
