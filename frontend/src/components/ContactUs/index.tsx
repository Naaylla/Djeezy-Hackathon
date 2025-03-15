import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ContactUs: React.FC = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInVariants}
      id="contact"
      style={{ backgroundColor: '#C14600', minHeight: '400px' }}
      className="flex flex-col justify-center items-center p-8 shadow-md text-center"
    >
      <motion.h1
        style={{ color: '#FEF9E1' }}
        className="text-4xl md:text-5xl font-bold mb-4" // Responsive font size
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeInVariants}
      >
        Contact Us!
      </motion.h1>
      <motion.p
        style={{ color: '#FEF9E1' }}
        className="text-lg md:text-xl mb-6" // Responsive font size
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeInVariants}
      >
        Your gateway to volunteering
      </motion.p>
      <motion.div
        className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full max-w-md" // Added max-w and w-full
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeInVariants}
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="bg-white w-full p-2 rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" // w-full
        />
        <div className="w-full md:w-auto">
          <button
            style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
            className="w-full font-semibold py-2 px-4 rounded-sm transition duration-300 hover:bg-gray-800 cursor-pointer" // w-full
          >
            Submit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactUs;