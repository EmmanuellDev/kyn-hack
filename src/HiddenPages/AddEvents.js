import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { storage, db } from "../firebase"; // Import Firestore and Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs for event document

const AddEvent = () => {
  const [image, setImage] = useState(null); // To hold the image file
  const [loading, setLoading] = useState(false); // Loading state for button
  const [progress, setProgress] = useState(0); // To show upload progress

  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get the user ID

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle event image upload and saving to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if an image is selected
    if (image) {
      try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `events/${uuidv4()}`);
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
            console.error("Error uploading image:", err);
            alert("Error uploading image.");
            setLoading(false);
          },
          async () => {
            // Get image URL after upload
            const imageURL = await getDownloadURL(uploadTask.snapshot.ref());
            console.log("Event image URL:", imageURL);

            // Save event to Firestore
            try {
              await addDoc(collection(db, "events"), {
                userId,
                imageURL,
                timestamp: new Date(),
              });
              setImage(null);
              setProgress(0);
              alert("Event added successfully!");
            } catch (firestoreError) {
              console.error("Error adding event to Firestore:", firestoreError);
              alert("Error adding event");
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        setLoading(false);
      }
    } else {
      alert("Please select an image.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Add Event</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Event Image
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? `Uploading... ${progress}%` : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
