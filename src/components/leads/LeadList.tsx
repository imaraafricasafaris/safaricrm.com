import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  User,
  Zap,
  Send,
  UserPlus,
  PhoneCall,
  Globe2,
  Linkedin,
  Facebook,
  Instagram,
  Mail as MailIcon,
  UserCheck,
  Clock,
  AlertCircle,
  Star,
  FileText,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { Lead } from '../../types/leads';
import LeadActionsMenu from './LeadActionsMenu';
import toast from 'react-hot-toast';

interface LeadListProps {
  leads: Record<string, Lead[]>;
  viewMode: 'list' | 'grid';
  onLeadClick: (lead: Lead) => void;
  isMobile?: boolean;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/50 dark:text-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/50 dark:text-yellow-200',
  qualified: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/50 dark:text-green-200',
  proposal: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/50 dark:text-purple-200',
  won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/50 dark:text-emerald-200',
  lost: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/50 dark:text-red-200',
};

const statusIcons: Record<string, React.FC<{ className: string }>> = {
  new: AlertCircle,
  contacted: Clock,
  qualified: Star,
  proposal: FileText,
  won: CheckCircle2,
  lost: XCircle,
};

const sourceIcons: Record<string, React.FC<{ className: string }>> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  email: MailIcon,
  website: Globe2,
  manual: UserPlus,
  import: FileText,
  referral: Users,
};

const isValidDate = (date: string | Date | undefined): boolean =>
  date ? !isNaN(new Date(date).getTime()) : false;

export default function LeadList({ leads, viewMode, onLeadClick, isMobile }: LeadListProps) {
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    position: { top: number; left: number };
  } | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  const handleActionClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenu({
      id: lead.id,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 192, // menu width
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.values(leads).flat().map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-gray-800 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {lead.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lead.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCard(expandedCard === lead.id ? null : lead.id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedCard === lead.id ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  )}
                </div>

                {expandedCard === lead.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Source</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {React.createElement(sourceIcons[lead.source] || sourceIcons.manual, { className: 'w-3 h-3' })}
                        {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {React.createElement(statusIcons[lead.status], { className: 'w-3 h-3' })}
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 text-sm">
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
                        <FileText className="w-4 h-4" />
                        Add Note
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm col-span-2">
                        <Send className="w-4 h-4" />
                        Send Proposal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(leads).map(([status, statusLeads]) => (
            <div key={status} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {status} ({statusLeads.length})
              </h3>
              {statusLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          {lead.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Source: {lead.source}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                    >
                      {React.createElement(statusIcons[lead.status], { className: 'w-3 h-3' })}
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => handleActionClick(e, lead)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Object.values(leads).flat().map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => onLeadClick(lead)}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id);
                        }}
                        className="p-1 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          expandedLeadId === lead.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {lead.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Added {format(new Date(lead.created_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {lead.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                      {React.createElement(statusIcons[lead.status], { className: 'w-3 h-3' })}
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {React.createElement(sourceIcons[lead.source] || sourceIcons.manual, { className: 'w-3 h-3' })}
                      {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, lead)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  </tr>
                  {expandedLeadId === lead.id && (
                    <tr className="bg-gray-50 dark:bg-gray-700/50 animate-fadeIn">
                      <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ${lead.budget?.toLocaleString() || 'Not set'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Trip Duration</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {lead.duration} days
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Group Size</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {lead.adults + (lead.children || 0)} people
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Arrival Date</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {lead.arrival_date ? format(new Date(lead.arrival_date), 'MMM d, yyyy') : 'Not set'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black rounded-lg text-sm hover:bg-primary/90">
                            <Calendar className="w-4 h-4" />
                            Schedule Meeting
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            <FileText className="w-4 h-4" />
                            Add Note
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                            <Send className="w-4 h-4" />
                            Send Proposal
                          </button>
                        </div>
                      </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeMenu && (
        <LeadActionsMenu
          lead={Object.values(leads).flat().find((l) => l.id === activeMenu.id)!}
          position={activeMenu.position}
          onClose={() => setActiveMenu(null)}
          onEdit={() => {
            const lead = Object.values(leads).flat().find((l) => l.id === activeMenu.id);
            if (lead) {
              onLeadClick(lead);
            }
            setActiveMenu(null);
          }}
        />
      )}
    </div>
  );
}