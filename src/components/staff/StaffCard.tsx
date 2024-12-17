import React from 'react';
import { Staff } from '../../types/staff';
import { Building2, Mail, Phone } from 'lucide-react';

interface StaffCardProps {
  staff: Staff;
}

export default function StaffCard({ staff }: StaffCardProps) {
  const fullName = staff.full_name || `${staff.first_name} ${staff.last_name}`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative">
          <img
            src={staff.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover"
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

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {fullName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {staff.role}
          </p>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{staff.email}</span>
          </div>
          {staff.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Phone className="w-4 h-4" />
              <span>{staff.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>{staff.branch || 'Not Assigned'}</span>
          </div>
        </div>

        <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Last Active</span>
            <span className="text-gray-900 dark:text-white">
              {staff.last_activity ? new Date(staff.last_activity).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
