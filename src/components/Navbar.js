import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-red-600 text-white p-2 shadow-md">
      <ul className="flex justify-around text-center">
        <li>
          <Link to="/" className="flex flex-col items-center">
            <span className="material-icons">home</span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/events" className="flex flex-col items-center">
            <span className="material-icons">event</span>
            <span>Events</span>
          </Link>
        </li>
        <li>
          <Link to="/plus" className="flex flex-col items-center">
            <span className="material-icons">add_circle</span>
            <span>Plus</span>
          </Link>
        </li>
        <li>
          <Link to="/videos" className="flex flex-col items-center">
            <span className="material-icons">video_library</span>
            <span>Videos</span>
          </Link>
        </li>
        <li>
          <Link to="/klips" className="flex flex-col items-center">
            <span className="material-icons">movie</span>
            <span>Klips</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
