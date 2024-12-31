import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { storage, db } from "../firebase"; // Ensure Firebase Storage and Firestore are correctly initialized
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for klip document

const AddKlips = () => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Handle video file change
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Submit the klip
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload video to Firebase Storage
    if (video) {
      const storageRef = ref(storage, `klips/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, video);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          // Get the video URL after upload is complete
          const videoURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Add klip data to Firestore
          try {
            await addDoc(collection(db, "klips"), {
              userId,
              description,
              location,
              category,
              videoURL,
              timestamp: new Date(),
            });

            setDescription("");
            setLocation("");
            setCategory("");
            setVideo(null);
            setProgress(0);
            alert("Klip added successfully!");
          } catch (error) {
            console.error("Error adding klip: ", error);
            alert("Error adding klip");
          }
          setLoading(false);
        }
      );
    } else {
      alert("Please select a video.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-teal-500 mb-6">Add a Klip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">
            Klip Video
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        {video && (
          <div className="mt-4">
            <p className="text-gray-700">Selected Video: {video.name}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter klip description"
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select a category</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Vlog">Vlog</option>
            <option value="Music">Music</option>
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md ${loading ? "bg-teal-300" : "bg-teal-500 hover:bg-teal-600"} focus:outline-none`}
          >
            {loading ? `Uploading... ${progress}%` : "Add Klip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddKlips;
