/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  FiList,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { MdHive } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { eventsCreatedByUser, deleteEvent } from "../../services/eventService";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import CreateEventForm from './createEvent';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState("allEvents");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventsCreatedByUser(user.id);
      setEvents(data || []);
    } catch (error) {
      toast.error("Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, user]);

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const menuItems = [
    {
      id: "allEvents",
      label: "All Events",
      icon: <FiList />,
    },
    {
      id: "createEvent",
      label: "Create Event",
      icon: <FiPlusCircle />,
    },
  ];

  const eventTypes = [
    "Workshops",
    "Seminars",
    "Music Events",
    "Sports",
    "Cultural",
    "Academic",
  ];

  const EventCard = ({ event }) => {
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);

    return (
      <div className='bg-[#0c0a09] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col'>
        <div className='p-6 flex flex-col flex-grow'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-white truncate'>
                {event.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs inline-flex items-center ${
                event.seatsLeft > 10
                  ? "bg-green-500/10 text-green-400"
                  : event.seatsLeft > 0
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {event.capacity - event?.attendees?.length} seats left
              </span>
            </div>
            <p className='text-gray-400 text-sm line-clamp-2'>{event.description}</p>
          </div>

          <div className='mt-4 space-y-3 flex-grow'>
            <div className='flex items-center text-gray-300'>
              <FiCalendar className='mr-2 text-gray-400' />
              <span className='text-sm'>
                {startDate.toLocaleDateString()}
              </span>
            </div>
            <div className='flex items-center text-gray-300'>
              <FiClock className='mr-2 text-gray-400' />
              <span className='text-sm'>
                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className='flex items-center text-gray-300'>
              <FiMapPin className='mr-2 text-gray-400' />
              <span className='text-sm truncate'>{event.location}</span>
            </div>
          </div>

          <div className='mt-6 flex gap-3'>
            <a
              href={`/event-bookings/${event._id}`}
              className='flex-1 px-4 py-2 text-sm rounded-lg text-white bg-Eventhive text-center'
            >
              View Bookings
            </a>
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className='flex-1 px-4 py-2 text-sm rounded-lg text-red-400 border border-red-400/50 hover:bg-red-400/10 transition-colors'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "allEvents":
        return (
          <div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
              <h1 className='text-2xl font-bold text-black'>All Events</h1>
              <SearchBar
                placeholder='Search events...'
                value={searchQuery}
                onChange={setSearchQuery}
                className='w-full md:w-64'
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id + "dashboard" + index + "allEvents"}
                  event={event}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className='text-center py-16 bg-[#0c0a09] rounded-xl shadow-sm'>
                <div className='max-w-md mx-auto'>
                  <FiList className='mx-auto h-12 w-12 text-gray-100' />
                  <h3 className='mt-4 text-lg font-medium text-gray-200'>
                    No events found
                  </h3>
                  <p className='mt-2 text-gray-300'>
                    No events match your search criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "createEvent":
        return (
          <div>
            <h1 className='text-2xl font-bold text-black mb-8'>Create New Event</h1>
            <CreateEventForm 
              onEventCreated={() => {
                setActiveMenu("allEvents");
                fetchEvents();
                toast.success("Event created successfully!");
              }}
            />
          </div>
        );
      default:
        return (
          <div className='text-gray-300'>
            Select an option from the sidebar.
          </div>
        );
    }
  };

  const handleMenuClick = (itemId) => {
    setActiveMenu(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Mobile Navbar */}
      <div className='md:hidden bg-Eventhive px-4 py-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-bold text-white'>Dashboard</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='text-gray-400 hover:text-white transition-colors'
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-Eventhive'>
          <nav className='px-4 py-2'>
            <ul className='space-y-2'>
              {menuItems.map((item, index) => (
                <li key={item.id + "mobile" + index + "dashboard"}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? "bg-black text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li className='pt-4'>
                <button
                  onClick={() => navigate("/login")}
                  className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors'
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <div className='flex'>
        {/* Desktop Sidebar */}
        <div className='hidden md:block w-64 bg-Eventhive min-h-screen'>
          <div className='p-6'>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold text-white'>Event Hive</h1>
              <MdHive className='text-black h-8 md:h-11' />
            </div>
            <nav className='mt-8'>
              <ul className='space-y-2'>
                {menuItems.map((item, index) => (
                  <li key={item.id + "desktop" + index + "dashboard"}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeMenu === item.id
                          ? "bg-black text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                <li className='pt-4'>
                  <button
                    onClick={() => navigate("/login")}
                    className='w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors'
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-4 md:p-8 overflow-y-auto'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;