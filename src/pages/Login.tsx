import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Map, Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, validateForm } from '../components/auth/FormValidation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Images } from '../utils/images';
import SocialAuth from '../components/SocialAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate form
    const validation = await validateForm(loginSchema, { email, password });
    if (!validation.success) {
      setError(validation.error);
      setIsLoading(false);
      return;
    }

    try {
      const isSuperAdmin = location.pathname.includes('superadmin');
      const role = isSuperAdmin ? 'super_admin' : 'company';
      await signIn(email, password, role);
      const redirectPath = role === 'super_admin' 
        ? '/super-admin'
        : (location.state as any)?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
      } else if (error.message?.toLowerCase().includes('email not confirmed')) {
        setError('Please verify your email address');
        toast.error('Please verify your email address');
      } else if (error.message?.toLowerCase().includes('user not found')) {
        setError('No account found with this email');
        toast.error('No account found with this email');
      } else {
        setError('Failed to sign in. Please try again.');
        toast.error('Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-primary/20">
      {/* Back to Home Button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <div className="flex min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="flex justify-center">
              <img src={Images.logo} alt="Safari CRM" className="h-12 w-auto" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:text-primary/90 transition-colors duration-200">
                Sign up now
              </Link>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg shadow-gray-200/50 dark:shadow-none sm:rounded-xl sm:px-10">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/50 flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1 relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors duration-200"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/90 transition-colors duration-200">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Sign in'
                    )}
                  </motion.button>
                </div>

                <div className="mt-6">
                  <SocialAuth mode="login" />
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Maasai Culture */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 backdrop-blur-[1px]" />
          <img
            src={Images.maasai}
            alt="Maasai Culture of Tanzania"
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transform"
            style={{ objectPosition: '25% center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 p-12 z-30">
            <div className="max-w-xl">
              <h3 className="text-white text-3xl font-bold font-serif">
                Transform Your Safari Business
              </h3>
              <p className="text-white/90 mt-4 text-lg leading-relaxed">
                Experience the power of Africa's leading safari management platform. 
                Streamline operations, enhance guest experiences, and grow your business 
                with our innovative CRM solution.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}