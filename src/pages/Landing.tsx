import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Globe, Users, Car, Calendar, BarChart3, FileText, Settings, Smartphone, ArrowRight, CheckCircle2, ChevronDown, Check, Info, Trophy, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import TopNav from '../components/landing/TopNav';
import Hero3D from '../components/landing/Hero3D';
import FeatureCard from '../components/landing/FeatureCard';
import PricingCard from '../components/landing/PricingCard';

export default function Landing() {
  const [isAnnual, setIsAnnual] = React.useState(false);
  const [showComparison, setShowComparison] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      {/* Hero Section */}
      <header className="relative pt-16 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[56px] leading-[1.1] font-bold text-gray-900 mb-4"
            >
              Effortless safari
              <br />
              management,{' '}
              <span className="text-[#FF8A00]">anytime</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[18px] leading-relaxed text-gray-600 mb-8"
            >
              Manage your safari operations and projects easily with an all-in-one
              <br />
              platform designed for seamless tour operator collaboration
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <Link
                  to="/signup"
                  className="group bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-colors font-medium flex items-center gap-2"
                >
                  Try for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/demo"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium border-b border-gray-300"
                >
                  Get a demo
                </Link>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-6 text-gray-600 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  14-day free trial
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  Free support and migration
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mx-auto max-w-[1000px]"
          >
            <div className="relative">
              {/* Browser Window Frame */}
              <div className="bg-white rounded-t-xl shadow-xl p-2">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-[#FF5F57] rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-[#FFBD2E] rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-[#28C840] rounded-full"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center bg-[#f1f1f1] rounded-md px-3 py-1 text-xs text-gray-500 gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      app.safaricrm.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Screenshot */}
              <img
                src="/src/img/landing_white.png"
                alt="Safari CRM Dashboard"
                className="w-full rounded-b-xl shadow-2xl"
              />

              {/* Mobile App Preview */}
              <div className="absolute -right-4 -bottom-10 lg:right-0 lg:-bottom-16">
                <img
                  src="/src/img/iphone.png"
                  alt="Safari CRM Mobile App"
                  className="w-[140px] md:w-[180px] lg:w-[220px] h-auto transform rotate-[-8deg]"
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
      </header>

      {/* Partners Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm">Trusted by Industry Leaders</p>
          </div>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {[
              { name: 'TripAdvisor', path: '/src/img/partners/tripadvisor.png' },
              { name: 'Kenya Airways', path: '/src/img/partners/Kenya_Airways-Logo.wine.svg' },
              { name: 'Serena Hotels', path: '/src/img/partners/serena-hotel-colored-logo.svg' },
              { name: 'Safari Bookings', path: '/src/img/partners/safari-bookings.png' },
              { name: 'KWS', path: '/src/img/partners/KWS.png' },
              { name: 'Eco Tourism Kenya', path: '/src/img/partners/Eco-tourism_Kenya.png' },
              { name: 'Trustpilot', path: '/src/img/partners/trustpilot.png' },
              { name: 'TRA', path: '/src/img/partners/tra.png' }
            ].map((partner) => (
              <motion.img
                key={partner.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.75 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={partner.path}
                alt={partner.name}
                className="h-12 grayscale hover:grayscale-0 transition-all object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Safari CRM Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-20">
            {/* First Feature */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 max-w-xl">
                <h2 className="text-3xl font-bold mb-4">
                  Built for speed and ease of use
                  <span className="block text-[#FF8A00] text-xl mt-2">Yes, really. (We mean it.)</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Safari CRM is up to 50% faster than other CRMs—which helps your team work faster and easier. More bookings managed = more safaris organized. Plus, Safari CRM is designed for your team to use all day, every day. In the real world, you shouldn’t need a computer science degree to use your CRM. Getting started with Safari CRM takes hours, not weeks or months.
                </p>
                <div className="flex items-start gap-4 text-gray-600 italic">
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "The ease of use from a tour operator’s seat is crucial. There is zero clutter or unnecessary steps. It’s click, call, text, email, notes—all in one convenient spot."
                    </p>
                    <p className="font-medium text-gray-900">John Doe, Safari Adventures Ltd</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <img 
                  src="/src/img/landing_dark.png" 
                  alt="Safari CRM Interface" 
                  className="rounded-lg shadow-2xl w-full"
                />
              </div>
            </div>

            {/* Second Feature */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1 max-w-xl">
                <h2 className="text-3xl font-bold mb-4">
                  Everything you need to manage safaris, all in one spot
                </h2>
                <p className="text-gray-600 mb-6">
                  Stop juggling multiple tools just to organize a safari. Customers can get lost in the shuffle! We believe in keeping it simple. Every tool you need in your safari management process either lives within Safari CRM or integrates with it seamlessly. You’ll make phone calls, send emails, manage follow-ups, and track your pipeline, all without ever leaving Safari CRM.
                </p>
                <div className="flex items-start gap-4 text-gray-600 italic">
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "Safari CRM has been a game changer for our team. I love how we can send texts, emails, set reminders, create tasks, and schedule reach outs all in one place. It’s absolutely up-leveled our team, our service, and our sales."
                    </p>
                    <p className="font-medium text-gray-900">Jane Smith, Serengeti Tours</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <img 
                  src="/src/img/leads_1.png" 
                  alt="Safari CRM Features" 
                  className="rounded-lg shadow-2xl w-full"
                />
              </div>
            </div>

            {/* Third Feature */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 max-w-xl"
              >
                <h2 className="text-3xl font-bold mb-4">
                  Automations that keep you laser-focused on safaris, not admin work
                </h2>
                <p className="text-gray-600 mb-6">
                  Manually tracking emails that were sent, calls that were made, or reminders to follow up are things of the past. We automate all of the admin work so you can focus your efforts on organizing your next safari adventure.
                </p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start gap-4 text-gray-600 italic"
                >
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "I can automate responses, emails and trigger actions very easily, improving my chances of closing a lot more safari bookings."
                    </p>
                    <p className="font-medium text-gray-900">Michael Johnson, Wildlife Expeditions</p>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1"
              >
                <img 
                  src="/src/img/staff.png" 
                  alt="Safari CRM Automation" 
                  className="rounded-lg shadow-2xl w-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[90vw] mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              60+ Powerful Tools
            </h2>
            <p className="text-xl text-gray-600">
              Start working with Safari CRM. It allows you to compose complex designs by combining and customizing utility classes.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Booking Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Booking Management</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Vehicle Fleet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Vehicle Fleet</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Guide Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Guide Management</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Itinerary Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Itinerary Builder</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Analytics & Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Analytics & Reports</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Customer Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-teal-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Customer Portal</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Invoice Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Invoice Management</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Mobile App */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="group bg-[#1F1235] rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Mobile App</h3>
              <Link to="#" className="text-purple-400 hover:text-purple-300 flex items-center group-hover:gap-2 transition-all text-sm">
                Select & try <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>
          </motion.div>

          {/* View All Modules Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex justify-center mt-8"
          >
            <Link
              to="#"
              className="inline-flex items-center px-6 py-2.5 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              View All Modules
            </Link>
          </motion.div>
        </div>
      </section>
  
      {/* Pricing Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">PRICING</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-4">10-day free trial.</h3>
            <p className="text-2xl md:text-3xl text-gray-900 mb-8">No credit card required.</p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-gray-900 font-medium">Save with annual billing</span>
              <button 
                className="relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                role="switch"
                onClick={() => setIsAnnual(!isAnnual)}
              >
                <span 
                  className={`${isAnnual ? 'translate-x-7' : 'translate-x-0'}
                    pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </button>
              <span className="text-green-600 font-semibold">SAVE 20%</span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                name: 'Free',
                price: '0',
                users: '1 User',
                features: [
                  'Unlimited boards',
                  'Up to 10 boards per workspace',
                  'Unlimited storage (50MB/file)',
                  'Unlimited activity log'
                ],
                buttonText: 'Get Started',
                buttonStyle: 'text-gray-700 bg-white border border-gray-300'
              },
              {
                name: 'Starter',
                price: '5',
                users: '15 Users',
                features: [
                  'Unlimited boards',
                  'Custom fields',
                  'Unlimited storage (250MB/file)',
                  'Advanced checklists'
                ],
                buttonText: 'Register Now',
                buttonStyle: 'text-gray-700 bg-white border border-gray-300'
              },
              {
                name: 'Premium',
                price: '10',
                users: '25 Users',
                features: [
                  'Multiple workspace view',
                  'Admin and security features',
                  'Simple data export',
                  '100+ free integrations'
                ],
                buttonText: 'Try for Free',
                buttonStyle: 'text-white bg-blue-600 hover:bg-blue-700',
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: '20',
                users: '50+ Users',
                features: [
                  'Unlimited workspaces',
                  'Organization-wide boards',
                  'Multi-team guests',
                  'Advanced permissions'
                ],
                buttonText: 'Contact Sales',
                buttonStyle: 'text-gray-700 bg-white border border-gray-300'
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted 
                    ? 'ring-2 ring-blue-600 shadow-xl' 
                    : 'bg-white shadow-lg'
                }`}
              >
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-semibold">$</span>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/Month</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.users}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Compare Plans Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
            >
              {showComparison ? 'Show less' : 'Compare all features'}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                showComparison ? 'rotate-180' : ''
              } group-hover:translate-y-0.5`} />
            </button>
          </motion.div>

          {/* Comparison Table */}
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Compare all features</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 font-medium">Annual</span>
                      <button 
                        className="relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        role="switch"
                        onClick={() => setIsAnnual(!isAnnual)}
                      >
                        <span className={`${isAnnual ? 'translate-x-7' : 'translate-x-0'}
                          pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                      <span className="text-green-600 font-semibold">SAVE 20%</span>
                    </div>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                      Download PDF
                    </a>
                  </div>
                </div>

                {/* Comparison Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-4 min-w-[200px]">Features</th>
                        <th className="text-center py-4 px-4 min-w-[120px]">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Free</span>
                        </th>
                        <th className="text-center py-4 px-4 min-w-[120px]">
                          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">Starter</span>
                        </th>
                        <th className="text-center py-4 px-4 min-w-[120px]">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Premium</span>
                        </th>
                        <th className="text-center py-4 px-4 min-w-[120px]">
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Enterprise</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { category: 'Essentials', features: [
                          { name: 'Workspace users', info: 'Number of users allowed in the workspace', values: ['1', 'Up to 15', 'Up to 25', 'Unlimited'] },
                          { name: 'Boards', info: 'Number of boards allowed', values: ['10', 'Unlimited', 'Unlimited', 'Unlimited'] },
                          { name: 'Unlimited storage', info: 'Storage capacity per workspace', values: ['200MB/user', '1GB/user', 'Unlimited', 'Unlimited'] },
                          { name: 'Unlimited projects', info: 'Number of projects allowed', values: ['5', '10', 'Unlimited', 'Unlimited'] },
                          { name: 'Priority levels', info: 'Task priority levels', values: [true, true, true, true] },
                          { name: 'Guests', info: 'External collaborators', values: ['—', '—', '20', '200'] },
                          { name: 'Custom fields', info: 'Add custom data to tasks', values: ['—', '—', true, true] },
                          { name: 'Sub-tasks', info: 'Break down tasks', values: [true, true, true, true] }
                        ]},
                        { category: 'Task views', features: [
                          { name: 'Kanban layout', info: 'Board view', values: [true, true, true, true] },
                          { name: 'List layout', info: 'List view', values: [true, true, true, true] },
                          { name: 'Calendar layout', info: 'Calendar view', values: ['—', true, true, true] },
                          { name: 'Timeline layout', info: 'Gantt view', values: ['—', '—', true, true] },
                          { name: 'Custom views', info: 'Save custom views', values: ['5', '150', 'Unlimited', 'Unlimited'] }
                        ]},
                        { category: 'Collaboration', features: [
                          { name: 'Comments', info: 'Task comments', values: [true, true, true, true] },
                          { name: 'Assigned tasks', info: 'Task assignments', values: [true, true, true, true] },
                          { name: 'Team roles & permissions', info: 'Role-based access', values: ['—', true, true, true] }
                        ]},
                        { category: 'Advanced', features: [
                          { name: 'Labels', info: 'Task labels', values: [true, true, true, true] },
                          { name: 'Task descriptions', info: 'Rich text descriptions', values: [true, true, true, true] },
                          { name: '100+ integrations', info: 'Third-party integrations', values: [true, true, true, true] },
                          { name: 'Data export', info: 'Export workspace data', values: ['—', '—', true, true] },
                          { name: 'Attachment permissions', info: 'Control file access', values: ['—', '—', true, true] },
                          { name: 'Organization-wide boards', info: 'Cross-workspace boards', values: ['—', '—', '—', true] },
                          { name: 'Unlimited activity log', info: 'Action history', values: [true, true, true, true] },
                          { name: 'Themes', info: 'Custom themes', values: ['5', '10', '10', '15'] }
                        ]}
                      ].map((section) => (
                        <React.Fragment key={section.category}>
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="py-4 px-4 font-semibold text-gray-900">
                              {section.category}
                            </td>
                          </tr>
                          {section.features.map((feature) => (
                            <tr key={feature.name} className="group hover:bg-gray-50 transition-colors duration-150">
                              <td className="py-4 px-4 flex items-center gap-2">
                                {feature.name}
                                <Info className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                              </td>
                              {feature.values.map((value, i) => (
                                <td key={i} className="text-center py-4 px-4">
                                  {typeof value === 'boolean' 
                                    ? (value ? <Check className="w-5 h-5 text-blue-600 mx-auto" /> : '—')
                                    : value
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

       {/* Stats Section */}
       <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overview of Safari CRM Stats</h2>
            <p className="text-gray-600">December, 2024</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Total Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 rounded-2xl p-6"
            >
              <h3 className="text-gray-600 mb-4">Total Active Users</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">15K</span>
                <span className="text-green-600 ml-2 text-sm">↑ 12%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">From 150+ countries</p>
            </motion.div>

            {/* Conversion Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-green-50 rounded-2xl p-6"
            >
              <h3 className="text-gray-600 mb-4">Conversion Rate</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">32.5%</span>
                <span className="text-green-600 ml-2 text-sm">↑ 8%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Trial to paid conversion</p>
            </motion.div>

            {/* Customer Satisfaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-purple-50 rounded-2xl p-6"
            >
              <h3 className="text-gray-600 mb-4">Customer Rating</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">4.9</span>
                <span className="text-sm text-gray-500 ml-2">/ 5.0</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">From 2,500+ reviews</p>
            </motion.div>

            {/* Total Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-yellow-50 rounded-2xl p-6"
            >
              <h3 className="text-gray-600 mb-4">Total Bookings</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">450K</span>
                <span className="text-green-600 ml-2 text-sm">↑ 25%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Processed this year</p>
            </motion.div>
          </div>

          {/* Monthly Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-indigo-50 rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly achievements:</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Top Rated Safari CRM</span> in Africa Tourism Category
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Best Tourism Tech Solution</span> Award 2024
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-700">
                  Featured in <span className="font-semibold">Top 10 Travel Tech Solutions</span> by TechReview
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="bg-black py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo and Text Content */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full blur-xl"></div>
              <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="relative w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join the thousands of small businesses
            </h2>
            <p className="text-2xl md:text-3xl text-blue-500 font-semibold mb-8">
              that trust Safari CRM to help them grow
            </p>

            {/* Google Sign-in Button */}
            <a href="/signup" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors mb-8">
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Start your free trial using Google
            </a>

            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                Free support and migration
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            {/* Browser Window Frame */}
            <div className="bg-[#1A1A1A] rounded-t-xl p-2 flex items-center">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              </div>
            </div>
            
            {/* Dashboard Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-b-xl"></div>
              <img src="/src/img/landing_white.png" alt="Safari CRM Dashboard" className="w-full h-auto rounded-b-xl shadow-2xl" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Ready to streamline your workflow
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join Safari CRM today and boost your team’s productivity with powerful task management tools. Simplify your projects and stay organized
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition-colors"
              >
                Get Started Now
              </Link>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <img
                src="/src/img/landing_white.png"
                alt="Safari CRM Dashboard Preview"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              {/* Floating UI Elements for Visual Effect */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFD700] opacity-10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#7C3AED] opacity-10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Newsletter Text - Left Side */}
              <div className="w-full md:w-1/3">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Join our newsletter</h3>
                <p className="text-gray-600">
                  Get updates from us weekly about project management
                </p>
              </div>

              {/* Newsletter Form - Right Side */}
              <div className="w-full md:w-1/2">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#A7E054] text-gray-900 font-medium rounded-lg hover:bg-[#96CC48] transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Product Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link to="/overview" className="text-gray-400 hover:text-white transition-colors">Overview</Link></li>
                <li><Link to="/communication" className="text-gray-400 hover:text-white transition-colors">Communication</Link></li>
                <li><Link to="/automation" className="text-gray-400 hover:text-white transition-colors">Automation</Link></li>
                <li><Link to="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
                <li><Link to="/reporting" className="text-gray-400 hover:text-white transition-colors">Reporting</Link></li>
                <li><Link to="/sms" className="text-gray-400 hover:text-white transition-colors">SMS</Link></li>
                <li><Link to="/calling" className="text-gray-400 hover:text-white transition-colors">Calling</Link></li>
                <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>

            {/* Pricing & Use Cases Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Pricing & Use Cases</h4>
              <ul className="space-y-4">
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/compare" className="text-gray-400 hover:text-white transition-colors">Safari CRM vs Other CRMs</Link></li>
                <li><Link to="/startups" className="text-gray-400 hover:text-white transition-colors">Safari CRM for Startups</Link></li>
                <li><Link to="/stories" className="text-gray-400 hover:text-white transition-colors">Customer Stories</Link></li>
                <li><Link to="/inbound" className="text-gray-400 hover:text-white transition-colors">Inbound Sales</Link></li>
                <li><Link to="/outbound" className="text-gray-400 hover:text-white transition-colors">Outbound Sales</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/ebooks" className="text-gray-400 hover:text-white transition-colors">Ebooks + Templates</Link></li>
                <li><Link to="/guides" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white transition-colors">See a demo video</Link></li>
                <li><Link to="/office-hours" className="text-gray-400 hover:text-white transition-colors">Office Hours</Link></li>
                <li><Link to="/sales-tools" className="text-gray-400 hover:text-white transition-colors">Sales Tools</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/partner" className="text-gray-400 hover:text-white transition-colors">Partner with Safari CRM</Link></li>
                <li><Link to="/brand" className="text-gray-400 hover:text-white transition-colors">Brand Guidelines</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/gdpr" className="text-gray-400 hover:text-white transition-colors">GDPR</Link></li>
                <li><Link to="/ccpa" className="text-gray-400 hover:text-white transition-colors">CCPA</Link></li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Get Help</h4>
              <ul className="space-y-4">
                <li><a href="tel:+18336625673" className="text-gray-400 hover:text-white transition-colors">+1-833-GO-CLOSE</a></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API Documentation</Link></li>
                <li><Link to="/download" className="text-gray-400 hover:text-white transition-colors">Download the Safari CRM App</Link></li>
                <li><Link to="/updates" className="text-gray-400 hover:text-white transition-colors">Product Updates</Link></li>
                <li><Link to="/status" className="text-gray-400 hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Map className="w-8 h-8" />
              <span> 2023 Safari CRM • All rights reserved • Made with for Safari Operators</span>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center">
              <select className="bg-transparent text-gray-400 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}