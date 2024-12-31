import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png'; // Ensure the path is correct
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore'; // Firestore methods

const Home = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [klips, setKlips] = useState([]); // State to store klips
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Fetch klips from Firestore
  const fetchKlips = async () => {
    try {
      const q = query(collection(db, 'klips'), orderBy('timestamp', 'desc')); // Get latest klips first
      const querySnapshot = await getDocs(q);
      const klipsList = querySnapshot.docs.map((doc) => doc.data());
      setKlips(klipsList);
    } catch (error) {
      console.error('Error fetching klips: ', error);
    }
  };

  // Fetch klips when the component mounts
  useEffect(() => {
    fetchKlips();
  }, []); // Empty dependency array means this runs only once when the component mounts

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
            className={`p-2 rounded-full ${notificationsEnabled ? 'text-teal-500' : 'text-gray-500'}`}
          >
            <span className="material-icons">
              {notificationsEnabled ? 'notifications_active' : 'notifications_off'}
            </span>
          </button>

          {/* Profile Icon */}
          <span
            className="material-icons text-gray-500 text-3xl cursor-pointer"
            onClick={handleProfileClick}
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

      {/* Display Klips Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-teal-500 mb-4">Recent Klips</h2>
        {klips.length > 0 ? (
          <div className="space-y-4">
            {klips.map((klip, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <video controls className="w-full mb-4">
                  <source src={klip.videoURL} type="video/mp4" />
                </video>
                <p className="text-sm text-gray-700">{klip.description}</p>
                <p className="text-xs text-gray-500">{klip.location}</p>
                <p className="text-xs text-gray-500">Category: {klip.category}</p>
                <p className="text-xs text-gray-500">Posted on: {new Date(klip.timestamp.seconds * 1000).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No klips available. Add some now!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
