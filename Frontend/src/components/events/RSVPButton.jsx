import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RSVPButton = ({ event, onRSVP }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUserRSVPed, setIsUserRSVPed] = useState(false);
  const [isEventFull, setIsEventFull] = useState(false);
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    setIsUserRSVPed(
      event.attendees.some((attendee) => attendee?.user?._id === user?.id)
    );
    setIsEventFull(event.attendees.length >= event.capacity);
    setIsEventPassed(new Date(event.endDate) < new Date());
  }, [event, event.attendees, event.capacity, event.endDate, user?.id]);

  const handleRSVPError = (error) => {
    if (error.code === 403) {
      toast.error("You've already reserved this event");
    } else if (error.code === 406) {
      toast.error("Event is at full capacity");
    } else {
      toast.error("Failed to reserve seat. Please try again later.");
    }
  };

  const getButtonClassName = () => {
    if (isUserRSVPed) {
      return "bg-Eventhive text-white px-4 py-2 rounded-lg";
    }
    if (isEventFull) {
      return "bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed";
    }
    return "bg-white hover:bg-gray-700 text-black px-4 py-2 rounded-lg";
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (isUserRSVPed) return "Reserved";
    if (isEventFull) return "Full";
    return "Reserve Seat";
  };

  const handleRSVP = async () => {
    if (!user) {
      toast.error("Please login to reserve event");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/events/${event._id}/rsvp`);
      onRSVP && onRSVP(response.data);
      toast.success("Successfully reserved event!");
    } catch (error) {
      handleRSVPError(error);
    } finally {
      setLoading(false);
      navigate(`/`);
    }
  };

  if (isEventPassed) {
    return <span className='text-gray-500'>Event has ended</span>;
  }

  return (
    <div className='flex flex-col w-full gap-4 mt-5'>
      {isUserRSVPed ? (
        <button
          onClick={() => navigate(`/my-events#${event._id}`)}
          className={`${getButtonClassName()} w-full flex items-center justify-between`}
          disabled={loading}
        >
          <span>{getButtonText()}</span>
          <FaChevronRight />
        </button>
      ) : (
        <button
          onClick={handleRSVP}
          disabled={loading || isUserRSVPed || isEventFull}
          className={`${getButtonClassName()} w-full`}
        >
          {getButtonText()}
        </button>
      )}
    </div>
  );
};

export default RSVPButton;
