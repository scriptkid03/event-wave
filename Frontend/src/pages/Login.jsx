import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthNavbar from "../components/AuthNavbar";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselImages = [
    "./B4.jpg",
    "./B5.jpg", // Add more image URLs
    "./B6.jpg",  // Add more image URLs
  ];

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    control._disableForm(true);
    const loadingToast = toast.loading("Signing in...");
    try {
      const response = await api.post("/auth/login", values);
      toast.dismiss(loadingToast);
      toast.success("Successfully logged in!");
      login(response.data);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "An error occurred during login");
      setError("root.serverError", {
        type: "server",
        message: error.response?.data?.message || "An error occurred during login"
      });
    }
    control._disableForm(false);
  };

  return (
    <div className="h-screen bg-[] flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex">
        {/* Main Login Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="p-6 w-full max-w-sm">
            <h1 className="text-2xl text-Eventchar font-bold mb-2">Login</h1>
            <p className="text-Eventchar mb-6">
              Welcome back, please enter your details
            </p>
  
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
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
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
  
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full text-black p-4 py-2 rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
  
              <button
                type="submit"
                className="bg-Eventhive text-white px-4 py-2 rounded-lg w-full"
              >
                Login
              </button>
            </form>
  
            <p className="mt-10 text-center text-sm text-black">
              Don't have an account?{" "}
              <Link to="/signup" className="text-Eventchar font-bold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
  
        {/* Carousel Section */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8">
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
        </div>
      </div>
    </div>
  );
}

export default Login;
