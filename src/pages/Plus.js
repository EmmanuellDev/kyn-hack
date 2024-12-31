import React from "react";
import { useNavigate } from "react-router-dom";

const PlusPage = () => {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate("/addpost"); // Navigate to AddPost page
  };

  const handleCreateKlip = () => {
    navigate("/addklip"); // Navigate to AddKlip page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold mb-8 text-teal-600">What would you like to create?</h2>
      <div className="flex space-x-6">
        <button
          onClick={handleCreatePost}
          className="bg-teal-500 text-white py-3 px-6 rounded-lg text-xl shadow-md transform transition-transform hover:scale-105 focus:outline-none"
        >
          Create Post
        </button>
        <button
          onClick={handleCreateKlip}
          className="bg-teal-500 text-white py-3 px-6 rounded-lg text-xl shadow-md transform transition-transform hover:scale-105 focus:outline-none"
        >
          Create Klip
        </button>
      </div>
    </div>
  );
};

export default PlusPage;
