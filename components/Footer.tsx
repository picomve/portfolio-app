import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 My Portfolio. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-gray-300">LinkedIn</a>
          <a href="#" className="hover:text-gray-300">GitHub</a>
          <a href="#" className="hover:text-gray-300">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;