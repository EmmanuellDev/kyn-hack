import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../img/logo.png'; // Ensure the path is correct

const Home = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Redirect to profile page
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Section */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Logo */}
        <img src={logo} alt="KYN Logo" className="h-12 w-auto" />

        {/* Search Bar */}
        <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search"
            className="flex-grow px-2 py-1 outline-none text-sm"
          />
          <span className="material-icons text-gray-500">search</span>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Bell Icon */}
          <button
            onClick={toggleNotifications}
            className={`p-2 rounded-full ${
              notificationsEnabled ? 'text-teal-500' : 'text-gray-500'
            }`}
          >
            <span className="material-icons">
              {notificationsEnabled ? 'notifications_active' : 'notifications_off'}
            </span>
          </button>

          {/* Profile Icon */}
          <span
            className="material-icons text-gray-500 text-3xl cursor-pointer"
            onClick={handleProfileClick} // Add onClick to redirect
          >
            account_circle
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="text-center mt-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-500">Welcome to KYN!</h1>
        <p className="mt-2 text-sm sm:text-base">Explore the app and enjoy its features.</p>
      </div>
    </div>
  );
};

export default Home;
