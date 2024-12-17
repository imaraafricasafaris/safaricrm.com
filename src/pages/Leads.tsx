import React, { useState, useEffect } from 'react';
import {
  UserPlus, Upload, Download, Plus, Search, Filter, CheckSquare, Settings2, Grid, List
} from 'lucide-react';
import { getLeads } from '../lib/api/leads';
import { Lead } from '../types/leads';
import LeadList from '../components/leads/LeadList';
import FileUploadModal from '../components/leads/FileUploadModal';
import LeadForm from '../components/leads/LeadForm';
import LeadSidebar from '../components/leads/LeadSidebar';
import BulkActionsMenu from '../components/leads/BulkActionsMenu';
import SearchOverlay from '../components/leads/SearchOverlay';
import FilterMenu from '../components/leads/FilterMenu';
import toast from 'react-hot-toast';

export default function Leads() {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [leads, setLeads] = useState<Record<string, Lead[]>>({
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    won: [],
    lost: []
  });

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const data = await getLeads(filters);
      
      // Group leads by status
      const groupedLeads = data.reduce((acc, lead) => {
        const status = lead.status || 'new';
        acc[status] = acc[status] || [];
        acc[status].push(lead);
        return acc;
      }, {} as Record<string, Lead[]>);

      setLeads(groupedLeads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads');
      toast.error('Failed to load leads');
      setLeads({
        new: [],
        contacted: [],
        qualified: [],
        proposal: [],
        won: [],
        lost: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    // TODO: Implement lead details view
    console.log('Lead clicked:', lead);
  };

  return (
    <div className="p-0 md:p-4">
      <div className="max-w-[1400px] mx-auto space-y-2 md:space-y-4">
        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-none md:rounded-lg shadow-sm sticky top-0 z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Left Side Actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-1 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hidden sm:block"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAddForm(true)}
                className="hidden sm:flex items-center gap-1 px-3 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <SearchOverlay
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* Lead Form */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <LeadForm 
                  onSuccess={() => {
                    setShowAddForm(false);
                    loadLeads();
                    toast.success('Lead added successfully');
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden min-h-[calc(100vh-12rem)]">
          <div className="bg-white dark:bg-gray-800 rounded-none md:rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : Object.keys(leads).length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No leads found. Create your first lead to get started.
                </p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Lead
                </button>
              </div>
            ) : (
              <LeadList 
                leads={leads} 
                viewMode={viewMode}
                onLeadClick={handleLeadClick}
                isMobile={window.innerWidth < 768}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}