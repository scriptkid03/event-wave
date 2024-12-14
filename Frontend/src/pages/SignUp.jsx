import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthNavbar from "../components/AuthNavbar";
import toast from "react-hot-toast";
import api from "../services/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    "./B1.jpg",
    "./B2.jpg", // Add more image URLs
    "./B3.jpg", // Add more image URLs
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data);
    const loadingToast = toast.loading("Creating your account...");
    try {
      await api.post("/auth/register", data);
      toast.dismiss(loadingToast);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to create account");
    }
    // setSubmitting(false);
  };

  return (
    <div className='h-screen bg-[] flex flex-col'>
      <AuthNavbar />
      <div className='flex-1 flex'>
        {/* Main SignUp Section */}
        <div className='flex-1 flex items-center justify-center'>
          <div className='p-6 w-full max-w-sm'>
            <h1 className='text-2xl text-Eventchar font-bold mb-2'>Sign Up</h1>
            <p className='text-Eventchar mb-6'>
              Get started by creating your account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div>
                <input
                  type='text'
                  placeholder='Full Name'
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={`w-full bg-white text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type='text'
                  placeholder='Username'
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  className={`w-full bg-white text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                    errors.username ? "border-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type='email'
                  placeholder='Email'
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full bg-white text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type='password'
                  placeholder='Password'
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                      message:
                        "Password must contain at least one letter and one number",
                    },
                  })}
                  className={`w-full bg-white text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                className='bg-Eventhive text-white px-4 py-2 rounded-lg w-full'
              >
                Sign Up
              </button>
            </form>

            <p className='mt-10 text-center text-sm text-black'>
              Already have an account?{" "}
              <Link to='/login' className='text-Eventchar font-bold'>
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Carousel Section */}
        {/* <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8">
          <div className="w-[600px] h-[700px] rounded-2xl overflow-hidden relative">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentImageIndex 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url('${image}')`
                }}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-[2px] rounded-full transition-all duration-300 transform ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 scale-100'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SignUp;
