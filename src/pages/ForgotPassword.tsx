import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Images } from '../utils/images';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset link';
      
      if (error.message.includes('Email rate limit exceeded')) {
        errorMessage = 'Too many reset attempts. Please try again later.';
      } else if (error.message.includes('User not found')) {
        errorMessage = 'No account found with this email address.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div>
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="mt-6">
              <img
                className="h-12 w-auto mx-auto"
                src={Images.logo}
                alt="Safari CRM"
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Forgot Password?
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                    disabled={isSuccess}
                  />
                </div>
              </div>
            </div>

            {isSuccess ? (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <p className="text-sm text-gray-600">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            )}
          </form>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src={Images.safari2}
            alt="Safari landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-black/20" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white p-12">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">
              Manage Your Safari Business Better
            </h2>
            <p className="text-lg text-gray-200">
              Get back to managing your tours, customers, and bookings with our comprehensive CRM solution designed for safari operators across Africa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
