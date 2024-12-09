import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getEvent, updateEvent } from "../../services/eventService";

const eventSchema = yup.object().shape({
  name: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  startDateTime: yup.string().required("Start date is required"),
  endDateTime: yup
    .string()
    .required("End date is required")
    .test("endDateTime", "End date must be after start date", function (value) {
      const { startDateTime } = this.parent;
      if (!startDateTime || !value) return true;
      return new Date(value) > new Date(startDateTime);
    }),
  location: yup.string().required("Location is required"),
  venue: yup.object().shape({
    name: yup.string(),
    address: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zipCode: yup.string(),
    coordinates: yup.object().shape({
      latitude: yup.number(),
      longitude: yup.number(),
    }),
  }),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      ["conference", "workshop", "seminar", "networking", "social", "other"],
      "Invalid category selected"
    ),
  capacity: yup
    .number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  ticketPrice: yup.number().min(0, "Ticket price cannot be negative"),
  tags: yup.array().of(yup.string()),
  imageUrl: yup.string().url("Must be a valid URL"),
  isPrivate: yup.boolean(),
  maxTicketsPerUser: yup.number().min(1),
  registrationDeadline: yup
    .string()
    .test(
      "registrationDeadline",
      "Registration deadline must be before event start date",
      function (value) {
        const { startDateTime } = this.parent;
        if (!startDateTime || !value) return true;
        return new Date(value) < new Date(startDateTime);
      }
    ),
  cancellationPolicy: yup.string(),
});

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      venue: {
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      category: "",
      capacity: "",
      ticketPrice: "",
      tags: [],
      imageUrl: "",
      isPrivate: false,
      maxTicketsPerUser: 1,
      registrationDeadline: "",
      cancellationPolicy: "",
    },
  });

  const imageUrl = watch("imageUrl");

  // Load existing event data
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEvent(id);

        // Format dates for datetime-local input
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        // Reset form with existing data
        reset({
          ...event,
          startDateTime: formatDate(event.startDateTime),
          endDateTime: formatDate(event.endDateTime),
          registrationDeadline: event.registrationDeadline
            ? formatDate(event.registrationDeadline)
            : "",
          tags: event.tags || [],
        });
      } catch (error) {
        toast.error("Failed to load event");
        navigate("/dashboard");
      }
    };

    loadEvent();
  }, [id, reset, navigate]);

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setValue("tags", tags);
  };

  const onSubmit = async (data) => {
    try {
      // Transform the data to match the required format
      const transformedData = {
        ...data,
        capacity: Number(data.capacity),
        ticketPrice: Number(data.ticketPrice),
        maxTicketsPerUser: Number(data.maxTicketsPerUser),
        venue: {
          ...data.venue,
          coordinates: {
            latitude: Number(data.venue.coordinates.latitude),
            longitude: Number(data.venue.coordinates.longitude),
          },
        },
      };

      await updateEvent(id, transformedData);
      toast.success("Event updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update event";
      toast.error(errorMessage);
    }
  };

  return (
    <div className='h-full overflow-y-auto p-4 md:p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl font-bold text-gray-100 mb-8'>Edit Event</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700'
        >
          {/* Form fields remain exactly the same as CreateEvent */}
          {/* ... copy all form fields from CreateEvent ... */}
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
