import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Plus from './pages/Plus';
import Videos from './pages/Videos';
import Klips from './pages/Klips';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import AddPost from './HiddenPages/AddPosts';
import AddKlips from './HiddenPages/AddKlips';
import AddEvent from './HiddenPages/AddEvents';

const App = () => {
  return (
    <div className="app">
      <main className="pb-16"> {/* Adds space for the bottom navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/plus" element={<Plus />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/klips" element={<Klips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/addklip" element={<AddKlips />} />
          <Route path="/addevent" element={<AddEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
};

export default App;
