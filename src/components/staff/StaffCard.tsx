import React from 'react';
import { Staff } from '../../types/staff';
import { Building2, Mail, Phone, Users } from 'lucide-react';

interface StaffCardProps {
  staff: Staff;
}

export default function StaffCard({ staff }: StaffCardProps) {
  const fullName = staff.full_name || `${staff.first_name} ${staff.last_name}`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative">
          <img
            src={staff.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
          />
          <span
            className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-gray-800 rounded-full ${
              staff.status === 'active'
                ? 'bg-green-500'
                : staff.status === 'pending'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {fullName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {staff.role}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{staff.email}</span>
            </div>
            {staff.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{staff.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span>{staff.branch || 'Not Assigned'}</span>
            </div>
            {staff.department && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{staff.department}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:flex-col sm:items-end text-sm">
            <span className="text-gray-500 dark:text-gray-400">Last Active</span>
            <span className="text-gray-900 dark:text-white ml-2 sm:ml-0">
              {staff.last_activity ? new Date(staff.last_activity).toLocaleDateString() : 'Never'}
            </span>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
              staff.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : staff.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
              {staff.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
