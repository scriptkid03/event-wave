import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { getEventById } from "../services/eventService";
import toast from "react-hot-toast";

const EventBookings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData?.at(0));
        setBookings(eventData?.at(0)?.attendees || []);
      } catch (error) {
        toast.error("Failed to fetch event details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-900 p-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white p-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <button
            onClick={() => navigate("/dashboard")}
            className='flex items-center text-black mb-4'
          >
            <FiArrowLeft className='mr-2' />
            Event Hive Dashboard
          </button>

          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-2xl font-bold text-black'>
                {event?.name}
              </h1>
              {event?.startDateTime && (
                <p className='text-black mt-1'>
                  {new Date(event.startDateTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(event.startDateTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
            </div>
            <div className='text-right'>
              <div className='text-lg font-semibold text-black'>
                {bookings?.length || 0}/{event?.capacity || 0}
              </div>
              <div className='text-sm text-black'>seats booked</div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className='bg-black rounded-xl shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-gray-700'>
            <h2 className='text-lg font-semibold text-white'>
              Registered Users
            </h2>
          </div>

          <div className='divide-y divide-gray-700'>
            {bookings?.map((booking) => (
              <div key={booking?._id} className='p-6'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-medium text-gray-100'>
                      {booking?.user?.username || booking?.userName}
                    </h3>
                    <div className='mt-2 space-y-1'>
                      <div className='flex items-center text-gray-400'>
                        <FiMail className='mr-2' />
                        <span className='text-sm'>{booking?.user?.email}</span>
                      </div>
                      {booking?.user?.phoneNumber && (
                        <div className='flex items-center text-gray-400'>
                          <FiPhone className='mr-2' />
                          <span className='text-sm'>
                            {booking?.user?.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center text-sm text-gray-400'>
                    <FiCalendar className='mr-2' />
                    {booking?.registrationDate ? (
                      <>
                        Booked on{" "}
                        {new Date(
                          booking.registrationDate
                        ).toLocaleDateString()}
                      </>
                    ) : (
                      "Registration date not available"
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(!bookings || bookings.length === 0) && (
              <div className='p-8 text-center text-gray-400'>
                No bookings found for this event.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookings;
