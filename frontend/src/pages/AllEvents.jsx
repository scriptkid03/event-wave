import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import EventCalendar from "./Calendar";
import SearchBar from "../components/SearchBar";
import toast from "react-hot-toast";
import { getEvents } from "../services/eventService";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import EventCard from "../components/EventCard";

const AllEvents = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleRSVP = () => {
    fetchEvents();
  };

  // Extract unique categories from events
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(events.map((event) => event?.category || "Uncategorized")),
    ];
    return uniqueCategories.filter(Boolean);
  }, [events]);

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event) return false;

      const eventName = event.name?.toLowerCase() || "";
      const eventDescription = event.description?.toLowerCase() || "";
      const searchTerm = searchQuery.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        eventName.includes(searchTerm) ||
        eventDescription.includes(searchTerm);

      const eventDate = new Date(event.startDateTime);
      const matchesDate = 
        !selectedDate || 
        eventDate.toDateString() === selectedDate.toDateString();

      const matchesPreferences = 
        selectedPreferences.length === 0 || 
        selectedPreferences.includes(event.category);

      return matchesSearch && matchesDate && matchesPreferences;
    });
  }, [events, searchQuery, selectedDate, selectedPreferences]);

  const pageVariants = {
    initial: { opacity: 0, backgroundColor: "#" },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial='initial'
      animate='animate'
      exit='exit'
      className='min-h-screen'
    >
      <Navbar />
      <motion.div
        className='mx-auto px-4 py-8 container'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Calendar Section */}
          <motion.div
            className='lg:w-[350px] w-full rounded-xl h-full'
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EventCalendar
              events={events}
              onDateSelect={setSelectedDate}
              onPreferencesChange={setSelectedPreferences}
              preferences={categories}
            />
          </motion.div>

          {/* Events Section */}
          <motion.div
            className='flex-1'
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
              <h2 className='text-2xl font-bold text-black'>
                {selectedDate
                  ? `Events on ${selectedDate.toLocaleDateString()}`
                  : "All Events"}
              </h2>
              <div className='w-full md:w-64'>
                <SearchBar
                  placeholder='Search events...'
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className='w-full md:w-64 text-gray-100'
                />
              </div>
            </div>

            {/* Filter clear button */}
            {(selectedDate ||
              selectedPreferences.length > 0 ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedPreferences([]);
                  setSearchQuery("");
                }}
                className='text-sm text-primary hover:text-primary/90 mt-2 mb-6'
              >
                Clear filters
              </button>
            )}

            <LayoutGroup>
              <motion.div layout className='max-w-7xl mx-auto py-8'>
                <AnimatePresence mode='wait'>
                  {loading ? (
                    <motion.div
                      key='loader'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='flex justify-center items-center h-64'
                    >
                      <motion.div
                        className='h-12 w-12 border-t-2 border-b-2 border-primary rounded-full'
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  ) : filteredEvents.length === 0 ? (
                    <motion.div
                      key='no-events'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className='text-center py-12'
                    >
                      <p className='text-gray-400 text-lg'>No events found</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial='hidden'
                      animate='show'
                      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    >
                      {filteredEvents.map((event, index) => (
                        <motion.div
                          key={event._id || index}
                          variants={itemVariants}
                          layout
                          whileHover={{
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                          whileTap={{ scale: 0.98 }}
                          className='bg-white rounded-xl shadow-lg overflow-hidden'
                        >
                          <EventCard
                            id={event._id}
                            startDate={event.startDateTime}
                            endDate={event.endDateTime}
                            title={event.name}
                            image={event.imageUrl}
                            capacity={event.capacity}
                            type={event.category}
                            description={event.description}
                            attendees={event.attendees}
                            organizer={event?.organizer?.username}
                            seatsLeft={
                              event.capacity - event?.attendees?.length
                            }
                            location={event.location}
                            event={event}
                            onRSVP={handleRSVP}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AllEvents;