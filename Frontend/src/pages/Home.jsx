import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import EventCalendar from "./Calendar";
import SearchBar from "../components/SearchBar";
import toast from "react-hot-toast";
import { getEvents } from "../services/eventService";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/events/CreateEventModal";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category] = useState("");
  const { user } = useAuth();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

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

      const eventTitle = event.title?.toLowerCase() || "";
      const eventDescription = event.description?.toLowerCase() || "";
      const searchTerm = searchQuery.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        eventTitle.includes(searchTerm) ||
        eventDescription.includes(searchTerm);

      const matchesCategory = category === "" || event.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, category]);

  // Enhanced animation variants
  const pageVariants = {
    initial: { opacity: 0, backgroundColor: "#3f3f46" }, // Dark background
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
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col min-h-screen bg-zinc-700 text-gray-100"
      >
        <div className="flex justify-center w-full h-24 max-md:h-[85px] bg-transparent backdrop-blur-md z-50 fixed">
          <Navbar />
        </div>

        <motion.div
          className="mx-auto px-4 py-8 container relative top-24 max-w-6xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Events Section */}
            <motion.div
              className="flex-1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  {selectedDate
                    ? `Events on ${selectedDate.toLocaleDateString()}`
                    : "All Events"}
                </h2>
                <div className="w-full md:w-64">
                  <SearchBar
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full md:w-64 bg-inherit text-gray-100"
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
                  className="text-sm text-primary hover:text-primary/90 mt-2 mb-6"
                >
                  Clear filters
                </button>
              )}

              <LayoutGroup>
                <motion.div layout className="max-w-7xl mx-auto py-8 mt-10">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center h-64"
                      >
                        <motion.div
                          className="h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"
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
                        key="no-events"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-12"
                      >
                        <p className="text-gray-400 text-lg">No events found</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      >
                        {filteredEvents.map((event, index) => (
                          <motion.div
                            key={event.id || index}
                            variants={itemVariants}
                            layout
                            whileHover={{
                              scale: 1.02,
                              transition: { type: "spring", stiffness: 300 },
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-zinc-600"
                          >
                            <EventCard
                              id={event._id}
                              startDate={event.startDateTime}
                              endDate={event.endDateTime}
                              title={event.name}
                              image={event.image}
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
                              onRSVP={() => handleRSVP()}
                            />
                          </motion.div>
                        ))}
                        {user?.role === "admin" && (
                          <CreateEventModal isOpen={isCreateEventModalOpen}>
                            <motion.div
                              variants={itemVariants}
                              layout
                              className="flex justify-center items-center bg-blue-700 h-10 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700 absolute top-20 max-md:top-6 max-md:right-4"
                            >
                              <span
                                onClick={() => setIsCreateEventModalOpen(true)}
                                className="justify-center items-center px-4 py-3"
                              >
                                New Event
                              </span>
                            </motion.div>
                          </CreateEventModal>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;
