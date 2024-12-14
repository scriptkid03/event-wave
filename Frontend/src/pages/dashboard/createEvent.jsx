import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { createEvent } from "../../services/eventService";

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
  tags: yup.array().of(yup.string()),
  imageUrl: yup.string().url("Must be a valid URL"),
});

export const CreateEventForm = ({ onEventCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
      },
      category: "",
      capacity: "",
      tags: [],
      imageUrl: "",
    },
  });

  const imageUrl = watch("imageUrl");

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setValue("tags", tags);
  };

  const onSubmit = async (data) => {
    try {
      const transformedData = {
        ...data,
        capacity: Number(data.capacity),
        ticketPrice: Number(data.ticketPrice),
        maxTicketsPerUser: Number(data.maxTicketsPerUser),
        venue: {
          ...data.venue,
        },
      };

      await createEvent(transformedData);
      onEventCreated();
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to create event";
      toast.error(errorMessage);
    }
  };

  return (
    <div className='h-full overflow-y-auto md:p-8'>
      <div className='max-w-2xl'>        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='rounded-xl p-6 shadow-sm border border-gray-700'
        >
          <div className='space-y-6'>
            {/* Image URL */}
            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Event Image URL
              </label>
              <input
                type='url'
                {...register("imageUrl")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.imageUrl ? "border-red-500" : "border-gray-600"
                } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.imageUrl && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.imageUrl.message}
                </p>
              )}
              {imageUrl && (
                <div className='mt-4'>
                  <img
                    src={imageUrl}
                    alt='Event preview'
                    className='max-h-48 rounded-lg'
                    onError={(e) => {
                      e.target.onerror = null;
                      toast.error("Invalid image URL");
                    }}
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Event Name
              </label>
              <input
                type='text'
                {...register("name")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Category
              </label>
              <select
                {...register("category")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value=''>Select category</option>
                <option value='conference'>Conference</option>
                <option value='workshop'>Workshop</option>
                <option value='seminar'>Seminar</option>
                <option value='networking'>Networking</option>
                <option value='social'>Social</option>
                <option value='other'>Other</option>
              </select>
              {errors.category && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className='grid grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  Start Date & Time
                </label>
                <input
                  type='datetime-local'
                  {...register("startDateTime")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.startDateTime ? "border-red-500" : "border-gray-600"
                  } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.startDateTime && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.startDateTime.message}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  End Date & Time
                </label>
                <input
                  type='datetime-local'
                  {...register("endDateTime")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.endDateTime ? "border-red-500" : "border-gray-600"
                  } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.endDateTime && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.endDateTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Location
              </label>
              <input
                type='text'
                {...register("location")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.location ? "border-red-500" : "border-gray-600"
                } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.location && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Venue Details */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-black'>
                Venue Details
              </h3>
              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  Venue Name
                </label>
                <input
                  type='text'
                  {...register("venue.name")}
                  className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* Capacity and Price */}
            <div className='grid grid-cols-1 gap-6'>
              <div>
                <label className='block text-sm font-medium text-black mb-2'>
                  Capacity
                </label>
                <input
                  type='number'
                  {...register("capacity")}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.capacity ? "border-red-500" : "border-gray-600"
                  } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.capacity && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.capacity.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Event Tag
              </label>
              <input
                type='text'
                onChange={handleTagsChange}
                placeholder='Photography, Web Development, etc.'
                className='w-full px-4 py-2 rounded-lg border border-gray-600 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-black mb-2'>
                Description
              </label>
              <textarea
                {...register("description")}
                rows='4'
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-600"
                } bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className=''>
              <button
                type='submit'
                className='w-full px-6 py-2 bg-Eventhive text-white rounded-lg'
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
