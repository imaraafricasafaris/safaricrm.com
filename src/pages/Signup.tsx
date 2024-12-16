import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, Check, X, Mail, Lock, ArrowLeft, Building2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { passwordRequirements, validatePassword } from '../utils/passwordValidation';
import { motion, AnimatePresence } from 'framer-motion';
import { Images } from '../utils/images';
import toast from 'react-hot-toast';
import SocialAuth from '../components/SocialAuth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowRequirements(true);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!companyName || !fullName) {
        toast.error('Please fill in all fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, { companyName, fullName });
      toast.success('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="flex justify-center">
              <img src={Images.logo} alt="Safari CRM" className="h-12 w-auto" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white"
            >
              Start Your Safari Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90 transition-colors duration-200">
                Sign in
              </Link>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Company Name
                        </label>
                        <div className="mt-1 relative group">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                          <input
                            id="company"
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <div className="mt-1 relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                          <input
                            id="fullName"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={nextStep}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                      >
                        Continue
                      </motion.button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email address
                        </label>
                        <div className="mt-1 relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                          <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                            placeholder="you@company.com"
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
                            type="password"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => setShowRequirements(true)}
                            className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                            placeholder="Create a strong password"
                          />
                        </div>
                        <AnimatePresence>
                          {showRequirements && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-2"
                            >
                              {passwordRequirements.map((req) => (
                                <motion.div
                                  key={req.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`flex items-center text-sm ${
                                    req.validator(password)
                                      ? 'text-green-500 dark:text-green-400'
                                      : 'text-gray-500 dark:text-gray-400'
                                  }`}
                                >
                                  {req.validator(password) ? (
                                    <Check className="w-4 h-4 mr-2" />
                                  ) : (
                                    <X className="w-4 h-4 mr-2" />
                                  )}
                                  {req.label}
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </label>
                        <div className="mt-1 relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary" />
                          <input
                            id="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200 bg-white dark:bg-gray-700"
                            placeholder="Confirm your password"
                          />
                        </div>
                        <AnimatePresence>
                          {confirmPassword && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 flex items-center text-sm"
                            >
                              {password === confirmPassword ? (
                                <div className="text-green-500 dark:text-green-400 flex items-center">
                                  <Check className="w-4 h-4 mr-2" />
                                  Passwords match
                                </div>
                              ) : (
                                <div className="text-red-500 dark:text-red-400 flex items-center">
                                  <X className="w-4 h-4 mr-2" />
                                  Passwords do not match
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="button"
                          onClick={prevStep}
                          className="flex-1 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            'Create Account'
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              <div className="mt-6">
                <SocialAuth mode="signup" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Safari Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 backdrop-blur-[1px]" />
          <img
            src={Images.safari2}
            alt="Safari Adventure"
            className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] transform"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 p-12 z-30">
            <div className="max-w-xl">
              <h3 className="text-white text-3xl font-bold font-serif">
                Begin Your Safari Success Story
              </h3>
              <p className="text-white/90 mt-4 text-lg leading-relaxed">
                Join Africa's premier safari management platform and take your business 
                to new heights with our powerful CRM solution.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}