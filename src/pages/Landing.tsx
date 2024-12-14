import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Globe, Users, Car, Calendar, BarChart3, FileText, Settings, Smartphone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TopNav from '../components/landing/TopNav';
import Hero3D from '../components/landing/Hero3D';
import FeatureCard from '../components/landing/FeatureCard';
import PricingCard from '../components/landing/PricingCard';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      {/* Hero Section */}
      <header className="relative pt-16 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-[56px] leading-[1.1] font-bold text-gray-900 mb-4">
              Effortless safari
              <br />
              management,{' '}
              <span className="text-[#FF8A00]">anytime</span>
            </h1>
            <p className="text-[18px] leading-relaxed text-gray-600 mb-8">
              Manage your safari operations and projects easily with an all-in-one
              <br />
              platform designed for seamless tour operator collaboration
            </p>
            <div className="flex flex-col items-center gap-6">
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
              <div className="flex items-center gap-6 text-gray-600 text-sm">
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
              </div>
            </div>
          </div>

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
                  Safari CRM is up to 50% faster than other CRMs—which helps your team work faster and easier. More bookings managed = more safaris organized. Plus, Safari CRM is designed for your team to use all day, every day. In the real world, you shouldn't need a computer science degree to use your CRM. Getting started with Safari CRM takes hours, not weeks or months.
                </p>
                <div className="flex items-start gap-4 text-gray-600 italic">
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "The ease of use from a tour operator's seat is crucial. There is zero clutter or unnecessary steps. It's click, call, text, email, notes—all in one convenient spot."
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
                  Stop juggling multiple tools just to organize a safari. Customers can get lost in the shuffle! We believe in keeping it simple. Every tool you need in your safari management process either lives within Safari CRM or integrates with it seamlessly. You'll make phone calls, send emails, manage follow-ups, and track your pipeline, all without ever leaving Safari CRM.
                </p>
                <div className="flex items-start gap-4 text-gray-600 italic">
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "Safari CRM has been a game changer for our team. I love how we can send texts, emails, set reminders, create tasks, and schedule reach outs all in one place. It's absolutely up-leveled our team, our service, and our sales."
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
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 max-w-xl">
                <h2 className="text-3xl font-bold mb-4">
                  Automations that keep you laser-focused on safaris, not admin work
                </h2>
                <p className="text-gray-600 mb-6">
                  Manually tracking emails that were sent, calls that were made, or reminders to follow up are things of the past. We automate all of the admin work so you can focus your efforts on organizing your next safari adventure.
                </p>
                <div className="flex items-start gap-4 text-gray-600 italic">
                  <img src="/src/img/logos/logo.png" alt="Safari CRM Logo" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="mb-2">
                      "I can automate responses, emails and trigger actions very easily, improving my chances of closing a lot more safari bookings."
                    </p>
                    <p className="font-medium text-gray-900">Michael Johnson, Wildlife Expeditions</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <img 
                  src="/src/img/staff.png" 
                  alt="Safari CRM Automation" 
                  className="rounded-lg shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '15,000+', label: 'Safari Bookings' },
              { value: '1350+', label: 'Tour Operators' },
              { value: '50,000+', label: 'Happy Tourists' },
              { value: '195%', label: 'Revenue Growth' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Safari Management Tools
            </h2>
            <p className="text-lg text-gray-600">
              All the features you need to manage your safari operations efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: Globe,
              title: 'Lead Management',
              description: 'Track leads, manage inquiries, and convert prospects into bookings'
            }, {
              icon: Map,
              title: 'Itinerary Builder',
              description: 'Create custom safari packages with drag-and-drop simplicity'
            }, {
              icon: Users,
              title: 'Guide Management',
              description: 'Manage guides, track certifications, and handle assignments'
            }, {
              icon: Car,
              title: 'Vehicle Fleet',
              description: 'Track vehicle maintenance, fuel, and availability'
            }, {
              icon: Calendar,
              title: 'Task Automation',
              description: 'Automate bookings, reminders, and follow-ups'
            }, {
              icon: BarChart3,
              title: 'Reporting',
              description: 'Get insights with customizable reports and analytics'
            }].map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 bg-[#f0f4fb] overflow-hidden">
        <div className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
            <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              <span className="block">Integrations built to work with</span>
              <span className="text-[#0066FF] block text-xl md:text-2xl lg:text-4xl mt-1">any tool in your stack</span>
            </h2>
          </div>

          {/* Mobile integration cloud layout */}
          <div className="lg:hidden px-4 relative min-h-[400px] pb-8">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-[340px] h-[340px]">
                {/* Center cluster */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/microsoft-365-logo.svg" alt="Microsoft" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                {/* Surrounding icons in cloud formation */}
                <div className="absolute left-[15%] top-[20%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/zoom-logo.svg" alt="Zoom" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute right-[20%] top-[15%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/savvycal-logo.svg" alt="Savvycal" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute left-[5%] top-[45%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/signwell-logo.svg" alt="Signwell" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute right-[8%] top-[40%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/gmail-logo.svg" alt="Gmail" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute left-[25%] top-[60%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/google-cal-logo.svg" alt="Google Calendar" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute right-[25%] bottom-[25%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/hubspot-logo.svg" alt="Hubspot" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute left-[15%] bottom-[15%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/reform-logo.svg" alt="Reform" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute right-[40%] top-[25%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/segment-logo.svg" alt="Segment" className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div className="absolute left-[35%] top-[30%]">
                  <div className="flex items-center justify-center bg-white rounded-[16px] shadow-sm p-4 w-[72px] h-[72px]">
                    <img src="/src/img/integrations/zapier-logo.svg" alt="Zapier" className="w-10 h-10 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop rows remain unchanged */}
          {/* First row */}
          <div className="flex space-x-8 animate-scroll-left integration-row">
            <div className="flex space-x-8 min-w-full">
              {[
                'signwell-logo.svg',
                'helpscout-logo.svg',
                'savvycal-logo.svg',
                'zapier-logo.svg',
                'zoom-logo.svg',
                'calendly-logo.svg',
                'reform-logo.svg',
                'quota-path-logo.svg'
              ].map((logo) => (
                <div key={logo} className="hidden lg:flex items-center justify-center bg-white rounded-[20px] shadow-sm w-[160px] h-[112px] hover:shadow-md transition-shadow">
                  <img 
                    src={`/src/img/integrations/${logo}`} 
                    alt={logo.replace('-logo.svg', '')} 
                    className="h-8 object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-8 min-w-full">
              {[
                'signwell-logo.svg',
                'helpscout-logo.svg',
                'savvycal-logo.svg',
                'zapier-logo.svg',
                'zoom-logo.svg',
                'calendly-logo.svg',
                'reform-logo.svg',
                'quota-path-logo.svg'
              ].map((logo) => (
                <div key={logo} className="hidden lg:flex items-center justify-center bg-white rounded-[20px] shadow-sm w-[160px] h-[112px] hover:shadow-md transition-shadow">
                  <img 
                    src={`/src/img/integrations/${logo}`} 
                    alt={logo.replace('-logo.svg', '')} 
                    className="h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Second row */}
          <div className="flex space-x-8 mt-8 animate-scroll-right integration-row">
            <div className="flex space-x-8 min-w-full">
              {[
                'gmail-logo.svg',
                'fathom-logo.svg',
                'chartmogul-logo.svg',
                'hubspot-logo.svg',
                'google-cal-logo.svg',
                'customer-io-logo.svg',
                'microsoft-365-logo.svg',
                'segment-logo.svg'
              ].map((logo) => (
                <div key={logo} className="hidden lg:flex items-center justify-center bg-white rounded-[20px] shadow-sm w-[160px] h-[112px] hover:shadow-md transition-shadow">
                  <img 
                    src={`/src/img/integrations/${logo}`} 
                    alt={logo.replace('-logo.svg', '')} 
                    className="h-8 object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-8 min-w-full">
              {[
                'gmail-logo.svg',
                'fathom-logo.svg',
                'chartmogul-logo.svg',
                'hubspot-logo.svg',
                'google-cal-logo.svg',
                'customer-io-logo.svg',
                'microsoft-365-logo.svg',
                'segment-logo.svg'
              ].map((logo) => (
                <div key={logo} className="hidden lg:flex items-center justify-center bg-white rounded-[20px] shadow-sm w-[160px] h-[112px] hover:shadow-md transition-shadow">
                  <img 
                    src={`/src/img/integrations/${logo}`} 
                    alt={logo.replace('-logo.svg', '')} 
                    className="h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mt-10 flex justify-center">
              <a
                href="#"
                className="inline-flex items-center bg-[#0066FF] text-white px-6 py-3 rounded-full hover:bg-[#0052CC] transition-colors text-base font-medium"
              >
                Browse all integrations
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Safari CRM Works
            </h2>
            <p className="text-lg text-gray-600">
              Streamline your safari operations in four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: 'Create Itineraries',
                description: 'Design custom safari packages with our intuitive builder'
              },
              {
                icon: Users,
                title: 'Manage Bookings',
                description: 'Handle reservations and guest communications efficiently'
              },
              {
                icon: Car,
                title: 'Track Vehicles',
                description: 'Monitor your fleet and optimize route planning'
              },
              {
                icon: BarChart3,
                title: 'Analyze Growth',
                description: 'Track performance and make data-driven decisions'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block w-8 h-8 text-gray-900 absolute top-1/2 -right-4 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Tour Operators Say
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of satisfied safari operators using our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Safari CRM has revolutionized how we manage our tours. The vehicle tracking feature is a game-changer.",
                author: "Sarah Thompson",
                company: "Serengeti Adventures",
                image: "/testimonials/sarah.jpg"
              },
              {
                quote: "The best safari management solution we've used. The itinerary builder saves us hours of work.",
                author: "John Kimani",
                company: "Masai Safaris",
                image: "/testimonials/john.jpg"
              },
              {
                quote: "Excellent customer support and powerful booking management. Highly recommended!",
                author: "Emily Rodriguez",
                company: "Wildlife Expeditions",
                image: "/testimonials/emily.jpg"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that best fits your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: 49,
                features: [
                  '5 Team Members',
                  'Core CRM Features',
                  'Basic Vehicle Tracking',
                  'Standard Support',
                  '5GB Storage'
                ]
              },
              {
                name: 'Premium',
                price: 99,
                features: [
                  '15 Team Members',
                  'Advanced CRM Features',
                  'Full Fleet Management',
                  'Priority Support',
                  '50GB Storage'
                ]
              },
              {
                name: 'Enterprise',
                price: 199,
                features: [
                  'Unlimited Team Members',
                  'Custom Module Development',
                  'Custom Integrations',
                  'Dedicated Support',
                  'Unlimited Storage'
                ]
              }
            ].map((plan, i) => (
              <PricingCard
                key={plan.name}
                {...plan}
                isPopular={i === 1}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Safari Operations?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join leading tour operators who trust Safari CRM
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#7C3AED] text-white px-8 py-4 rounded-lg hover:bg-[#6D28D9] transition-colors text-lg font-medium"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Map className="w-8 h-8 text-gray-900 mb-4" />
              <p className="text-gray-600">
                The most comprehensive safari management platform for tour operators.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Terms & Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:text-gray-900">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            {new Date().getFullYear()} Safari CRM • All rights reserved • Made with for Safari Operators
          </div>
        </div>
      </footer>
    </div>
  );
}