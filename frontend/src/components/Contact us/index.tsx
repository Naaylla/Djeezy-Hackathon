import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div
      id="contact"
      style={{ backgroundColor: '#C14600', minHeight: '400px' }}
      className="flex flex-col justify-center items-center p-8 rounded-lg shadow-md text-center"
    >
      <h1 style={{ color: '#FEF9E1' }} className="text-5xl font-bold mb-4">
        Contact Us!
      </h1>
      <p style={{ color: '#FEF9E1' }} className="text-xl mb-6">
        Your gateway to volunteering
      </p>
      <div className='flex-flex-row space-x-4'>
        <input
            type="email"
            placeholder="Enter your email"
            className="bg-white w-64 p-2 rounded mb-6 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
            className="font-semibold py-2 px-6 rounded-sm transition duration-300 hover:bg-gray-800"
        >
        Submit
        </button>
      </div>
    </div>
  );
};

export default ContactUs;