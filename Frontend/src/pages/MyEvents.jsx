import React, { useState, useEffect, useCallback } from "react";
import { FiCalendar, FiMapPin, FiClock, FiUsers } from "react-icons/fi";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { getMyEvents, cancelRSVP } from "../services/eventService";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const MyEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookedEvents, setBookedEvents] = useState([]);
  const { user } = useAuth();

  const fetchMyEvents = useCallback(async () => {
    const events = await getMyEvents(user.id);
    setBookedEvents(events);
  }, [user.id]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const cancelBooking = async (eventId) => {
    const loadingToast = toast.loading("Cancelling your Reservation...");
    try {
      await cancelRSVP(eventId);
      toast.dismiss(loadingToast);
      toast.success("Reservation cancelled successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to cancel reservation.");
    }
    fetchMyEvents();
  };

  const filteredEvents = bookedEvents.filter((event) => {
    const matchesSearch = searchQuery
      ? event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });

  return (
    <>
      <Navbar hideMyEvents={true} />
      <div className='min-h-screen bg-white pt-8'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>My Reservations</h1>
            <SearchBar
              placeholder='Search reservations'
              value={searchQuery}
              onChange={setSearchQuery}
              className='w-full md:w-64'
            />
          </div>

          {filteredEvents.length === 0 ? (
            <div className='text-center py-16 bg-[#0c0a09] rounded-xl shadow-sm'>
              <div className='max-w-md mx-auto'>
                <FiCalendar className='mx-auto h-12 w-12 text-gray-100' />
                <h3 className='mt-4 text-lg font-medium text-gray-200'>
                  No reserved events
                </h3>
                <p className='mt-2 text-gray-300'>
                  You haven't reserved any events yet.
                </p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className='bg-[#0c0a09] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col'
                >
                  <div className='p-6 flex flex-col flex-grow'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold text-white truncate'>
                          {event.name}
                        </h2>
                        <span className='inline-flex items-center px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full'>
                          {event.category}
                        </span>
                      </div>
                      <p className='text-gray-400 text-sm line-clamp-2'>
                        {event.description}
                      </p>
                    </div>

                    <div className='mt-4 space-y-3 flex-grow'>
                      <div className='flex items-center text-gray-300'>
                        <FiCalendar className='mr-2 text-gray-400' />
                        <span className='text-sm'>
                          {new Date(event.startDateTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex items-center text-gray-300'>
                        <FiClock className='mr-2 text-gray-400' />
                        <span className='text-sm'>
                          {new Date(event.startDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className='flex items-center text-gray-300'>
                        <FiMapPin className='mr-2 text-gray-400' />
                        <span className='text-sm truncate'>{event.location}</span>
                      </div>
                      <div className='flex items-center text-gray-300'>
                        <FiUsers className='mr-2 text-gray-400' />
                        <span className='text-sm'>
                          {event.attendees?.length || 0} attendees
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelBooking(event._id)}
                      className='mt-6 w-full px-4 py-2 text-sm text-red-400 border border-red-400/50 rounded-lg hover:bg-red-400/10 transition-colors'
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyEvents;
