import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Ensure you have correct firebase import
import { getAuth } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current authenticated user
  const userId = user ? user.uid : null; // Get the user ID

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    location: '',
    categories: [],
    bio: '',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    location: '',
    categories: [],
    bio: '',
  });

  useEffect(() => {
    // Fetch user data from Firestore on component mount
    const fetchUserData = async () => {
      if (!userId) return;
      const userDocRef = doc(db, 'users', userId);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            ...data,
            postsCount: data.postsCount || 0,
            followersCount: data.followersCount || 0,
            followingCount: data.followingCount || 0,
          });
          setEditForm({
            ...data,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (editForm.categories.includes(value)) {
      setEditForm({
        ...editForm,
        categories: editForm.categories.filter((category) => category !== value),
      });
    } else {
      setEditForm({
        ...editForm,
        categories: [...editForm.categories, value],
      });
    }
  };

  const handleUpdate = async () => {
    if (!userId) {
      console.error('No user logged in');
      return;
    }

    const userDocRef = doc(db, 'users', userId); // Reference the current user's document

    console.log('Updating user profile with data:', editForm); // Debugging log

    try {
      // Update the user document in Firestore
      await updateDoc(userDocRef, {
        name: editForm.name,
        username: editForm.username,
        email: editForm.email,
        phone: editForm.phone,
        gender: editForm.gender,
        dob: editForm.dob,
        location: editForm.location,
        categories: editForm.categories,
        bio: editForm.bio,
      });

      // After successful update, update the local state with new data
      setUserInfo({ ...editForm });
      setIsEditing(false); // Close the edit modal
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error); // Log the error if update fails
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
        {/* Profile Picture */}
        <img
          src="https://via.placeholder.com/150" // Replace with actual profile pic
          alt="Profile"
          className="rounded-full w-32 h-32 mb-4"
        />

        {/* Name and Username */}
        <h2 className="text-3xl font-semibold">{userInfo.name}</h2>
        <p className="text-gray-500">{userInfo.username}</p>

        {/* Followers and Following */}
        <div className="flex space-x-8 my-4">
          <div>
            <p className="font-semibold">{userInfo.followersCount}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{userInfo.followingCount}</p>
            <p className="text-gray-500">Following</p>
          </div>
          <div>
            <p className="font-semibold">{userInfo.postsCount}</p>
            <p className="text-gray-500">Posts</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
          >
            Edit
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Share
          </button>
        </div>

        {/* About Me Section */}
        <div className="mt-6 w-full max-w-2xl text-center">
          <h3 className="text-xl font-semibold mb-2">About Me</h3>
          <p className="text-gray-700">{userInfo.bio}</p>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <select
              name="gender"
              value={editForm.gender}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="date"
              name="dob"
              value={editForm.dob}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleInputChange}
              placeholder="Location (City, State, Country)"
              className="w-full p-2 mb-4 border rounded-md"
            />
            <div className="mb-4">
              <h4 className="font-semibold">Interested Categories</h4>
              <div className="flex space-x-2">
                <label>
                  <input
                    type="checkbox"
                    value="Health"
                    checked={editForm.categories.includes('Health')}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  Health
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Technology"
                    checked={editForm.categories.includes('Technology')}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  Technology
                </label>
                {/* Add more categories here */}
              </div>
            </div>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full p-2 mb-4 border rounded-md"
            ></textarea>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;