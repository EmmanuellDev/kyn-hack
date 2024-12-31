import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { storage, db } from "../firebase"; // Make sure to initialize both Firestore and Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for post document

const AddPost = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Submit the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload image to Firebase Storage
    if (image) {
      const storageRef = ref(storage, `posts/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

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
          // Get the image URL after upload is complete
          const imageURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Add post data to Firestore
          try {
            await addDoc(collection(db, "posts"), {
              userId,
              description,
              location,
              category,
              imageURL,
              timestamp: new Date(),
            });

            setDescription("");
            setLocation("");
            setCategory("");
            setImage(null);
            setProgress(0);
            alert("Post added successfully!");
          } catch (error) {
            console.error("Error adding post: ", error);
            alert("Error adding post");
          }
          setLoading(false);
        }
      );
    } else {
      alert("Please select an image.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Add a Post</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Post Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        {image && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Selected"
              width="100"
              className="mx-auto mb-2"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select a category</option>
            <option value="Health">Health</option>
            <option value="Tech">Tech</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? `Uploading... ${progress}%` : "Add Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
