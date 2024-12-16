import React from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook, FaApple, FaCompass } from 'react-icons/fa';

interface SocialAuthProps {
  mode: 'login' | 'signup';
}

const SocialAuth: React.FC<SocialAuthProps> = ({ mode }) => {
  const handleSocialAuth = (provider: string) => {
    // TODO: Implement social auth logic
    console.log(`${provider} ${mode} clicked`);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-500 bg-white dark:bg-gray-900">
            Or {mode} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleSocialAuth('google')}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <FaGoogle className="w-5 h-5 text-red-500" />
          <span>Google</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleSocialAuth('facebook')}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white bg-[#1877F2] rounded-md shadow-sm hover:bg-[#1865D1]"
        >
          <FaFacebook className="w-5 h-5" />
          <span>Facebook</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleSocialAuth('apple')}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-gray-900"
        >
          <FaApple className="w-5 h-5" />
          <span>Apple</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={() => handleSocialAuth('safaribookings')}
          className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white bg-[#FF6B00] rounded-md shadow-sm hover:bg-[#E66000]"
        >
          <FaCompass className="w-5 h-5" />
          <span>SafariBookings</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SocialAuth;
