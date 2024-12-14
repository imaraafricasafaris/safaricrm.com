import React, { useState, useEffect } from 'react';
import { GripHorizontal, ChevronLeft, ChevronRight, Bell, FileText, Save, Undo } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkDatabaseConnection } from '../lib/api/database';
import TotalLeadsCard from '../components/dashboard/stats/TotalLeadsCard';
import RevenueCard from '../components/dashboard/stats/RevenueCard';
import ActiveSafarisCard from '../components/dashboard/stats/ActiveSafarisCard';
import ConversionRateCard from '../components/dashboard/stats/ConversionRateCard';
import LeadCard from '../components/dashboard/LeadCard';
import LeadDetailsPopup from '../components/dashboard/LeadDetailsPopup';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import RevenueChart from '../components/dashboard/RevenueChart';
import LeadConversionChart from '../components/dashboard/LeadConversionChart';
import DocumentsList from '../components/dashboard/DocumentsList';
import AutomatedFollowUps from '../components/dashboard/AutomatedFollowUps';
import LeadNotes from '../components/dashboard/LeadNotes';
import InvoiceList from '../components/dashboard/InvoiceList';
import 'react-grid-layout/css/styles.css';

const mockLeads = [
  {
    id: '1',
    name: 'Jane Doe',
    title: 'Marketing Director',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    email: 'jane@microsoft.com',
    phone: '+1 234 567 890',
    location: 'Seattle, WA',
    source: 'linkedin',
    rating: 4,
    budget: 50000,
    status: 'hot',
    notes: 'Interested in luxury safari packages for corporate retreat',
    lastContact: '2024-03-15',
    documents: [
      { name: 'Initial Proposal.pdf', url: '#' },
      { name: 'Requirements.docx', url: '#' }
    ]
  },
  // Add more mock leads here
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Operations Manager',
    company: 'Global Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    email: 'michael@globaltech.com',
    phone: '+1 345 678 901',
    location: 'San Francisco, CA',
    source: 'referral',
    rating: 5,
    budget: 75000,
    status: 'warm',
    notes: 'Looking for premium wildlife photography safari packages',
    lastContact: '2024-03-16',
    documents: [
      { name: 'Safari Proposal.pdf', url: '#' },
      { name: 'Package Details.docx', url: '#' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    title: 'Travel Coordinator',
    company: 'Adventure Corp',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    email: 'sarah@adventurecorp.com',
    phone: '+1 456 789 012',
    location: 'Denver, CO',
    source: 'email',
    rating: 3,
    budget: 35000,
    status: 'cold',
    notes: 'Interested in group safari packages for company retreat',
    lastContact: '2024-03-14',
    documents: [
      { name: 'Group Quote.pdf', url: '#' }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Events Director',
    company: 'Luxury Retreats International',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    email: 'david@luxuryretreats.com',
    phone: '+1 567 890 123',
    location: 'Miami, FL',
    source: 'linkedin',
    rating: 5,
    budget: 120000,
    status: 'hot',
    notes: 'Planning multiple high-end safari experiences for VIP clients',
    lastContact: '2024-03-17',
    documents: [
      { name: 'VIP Package Proposal.pdf', url: '#' },
      { name: 'Luxury Accommodations.pdf', url: '#' },
      { name: 'Private Flight Details.docx', url: '#' }
    ]
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    title: 'Corporate Relations Manager',
    company: 'TechVentures LLC',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    email: 'emily@techventures.com',
    phone: '+1 678 901 234',
    location: 'Austin, TX',
    source: 'referral',
    rating: 4,
    budget: 85000,
    status: 'warm',
    notes: 'Seeking team-building safari experience for tech executives',
    lastContact: '2024-03-18',
    documents: [
      { name: 'Team Building Proposal.pdf', url: '#' },
      { name: 'Executive Summary.docx', url: '#' }
    ]
  }
];

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [layout, setLayout] = useState([
    { i: 'leads', x: 0, y: 0, w: 12, h: 2 },
    { i: 'stats', x: 0, y: 2, w: 12, h: 2 },
    { i: 'revenue', x: 0, y: 4, w: 6, h: 3 },
    { i: 'conversion', x: 6, y: 4, w: 6, h: 3 },
    { i: 'tasks', x: 0, y: 7, w: 12, h: 2 },
    { i: 'followups', x: 0, y: 9, w: 6, h: 2 },
    { i: 'documents', x: 6, y: 9, w: 6, h: 2 }
  ]);

  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    tables: { table: string; exists: boolean; }[];
    error?: string;
  } | null>(null);

  const isSuperAdmin = user?.user_metadata?.role === 'super_admin';

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkDatabaseConnection();
      if (!status.connected) {
        console.error('Database connection issues:', status);
      } else if (status.tables.some(t => !t.exists)) {
        console.warn('Some tables are missing:', 
          status.tables.filter(t => !t.exists).map(t => t.table).join(', '));
      }
      setDbStatus(status);
    };

    checkConnection();
  }, []);

  const onLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
  };

  const scrollLeads = (direction: 'left' | 'right') => {
    const container = document.getElementById('leads-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenDetails = (id: string) => {
    setSelectedLead(id);
  };

  return (
    <main className="flex-1 overflow-x-hidden px-1.5">
      <div className="max-w-[1400px] mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
          {/* Recent Leads */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {mockLeads.length} leads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollLeads('left')}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollLeads('right')}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div
              id="leads-container"
              className="flex overflow-x-auto space-x-3 pb-1 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollBehavior: 'smooth' }}
            >
              {mockLeads.map((lead) => (
                <div key={lead.id} className="flex-none w-[280px] snap-start">
                  <LeadCard
                    lead={lead}
                    onOpenDetails={handleOpenDetails}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-[20px] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <TotalLeadsCard />
              <RevenueCard />
              <ActiveSafarisCard />
              <ConversionRateCard />
            </div>
          </div>
          
          {/* Charts */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm h-[320px]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Overview
            </h2>
            <RevenueChart />
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm h-[320px]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lead Conversion
            </h2>
            <LeadConversionChart />
          </div>
          
          {/* Tasks */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks
            </h2>
            <UpcomingTasks />
          </div>

          {/* Follow-ups */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Automated Follow-ups
              </div>
            </h2>
            <AutomatedFollowUps />
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Documents
              </div>
            </h2>
            <DocumentsList />
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm">
            <LeadNotes />
          </div>

          {/* Invoices */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-[20px] shadow-sm">
            <InvoiceList />
          </div>
        </div>

        {selectedLead && (
          <LeadDetailsPopup
            lead={mockLeads.find(l => l.id === selectedLead)!}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </main>
  );
}