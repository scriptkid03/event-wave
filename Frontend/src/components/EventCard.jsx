import React from "react";
import { motion } from "framer-motion";
import RSVPButton from "./events/RSVPButton";

const EventCard = ({
  title,
  startDate,
  endDate,
  description,
  organizer,
  seatsLeft,
  type,
  location,
  isFiltered = false,
  image,
  event,
  onRSVP,
}) => {
  return (
    <motion.div className='relative h-full flex flex-col bg-black'>
      <div className='p-4 flex flex-col h-full'>
        {/* Image Section */}
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
          className='mt-4 flex flex-col flex-grow'
        >
          {/* Title and Type Section */}
          <div className="flex justify-between items-start mb-2">
            <h3 className='text-xl font-semibold text-white line-clamp-2'>{title}</h3>
            <span className='px-3 py-[7px] bg-white text-black rounded-full text-xs h-7 ml-2 whitespace-nowrap'>
              {type}
            </span>
          </div>

          {/* Description Section - Fixed Height */}
          <p className='text-white mb-4 line-clamp-3 text-xs'>
            {description}
          </p>

          {/* Info Section */}
          <div className='space-y-2 mb-4'>
            {/* Date */}
            <div className='flex items-center text-white text-xs'>
              <svg className='w-4 h-4 mr-2 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
              </svg>
              <span className='truncate'>
                {new Date(startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Time */}
            <div className='flex items-center text-white text-xs'>
              <svg className='w-4 h-4 mr-2 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
              </svg>
              <span className='truncate'>
                {new Date(startDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(endDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Location */}
            <div className='flex items-center text-white text-xs'>
              <svg className='w-4 h-4 mr-2 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
              </svg>
              <span className='truncate'>{location}</span>
            </div>

            {/* Organizer */}
            <div className='flex items-center text-white text-xs'>
              <svg className='w-4 h-4 mr-2 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
              </svg>
              <span className='truncate'>By {organizer}</span>
            </div>
          </div>

          {/* Bottom Section - Always at the bottom */}
          <div className='mt-auto'>
            <div className='mb-2'>
              <span className='text-white font-medium text-xs'>
                {seatsLeft} seats left
              </span>
            </div>

            {/* Book Button */}
            {seatsLeft > 0 && (
              <RSVPButton event={event} onRSVP={onRSVP} />
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventCard;
