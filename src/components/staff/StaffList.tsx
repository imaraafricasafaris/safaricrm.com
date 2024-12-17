import React from 'react';
import { Staff } from '../../types/staff';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';

interface StaffListProps {
  staff: Staff[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  selectedStaff: Set<string>;
  onSelectStaff: (staffId: string, checked: boolean) => void;
  onAction: (staff: Staff, event: React.MouseEvent) => void;
}

interface StaffCardProps {
  staff: Staff;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onAction: (event: React.MouseEvent) => void;
}

function StaffCard({ staff, selected, onSelect, onAction }: StaffCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 relative hover:shadow-md transition-shadow"
    >
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onAction}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={staff.avatar_url} />
          <AvatarFallback>
            {getInitials(staff.first_name, staff.last_name)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">
          {staff.first_name} {staff.last_name}
        </h3>
        <p className="text-gray-500 text-sm mb-2">{staff.role}</p>
        <Badge variant="secondary" className={getStatusColor(staff.status)}>
          {staff.status}
        </Badge>
      </div>
    </div>
  );
}

export default function StaffList({ 
  staff, 
  isLoading, 
  viewMode, 
  selectedStaff, 
  onSelectStaff,
  onAction 
}: StaffListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">No staff members found</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {staff.map((member) => (
          <StaffCard 
            key={member.id}
            staff={member}
            selected={selectedStaff.has(member.id)}
            onSelect={(checked) => onSelectStaff(member.id, checked)}
            onAction={(e) => onAction(member, e)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">
              <Checkbox
                checked={staff.length > 0 && staff.every(s => selectedStaff.has(s.id))}
                onCheckedChange={(checked) => staff.forEach(s => onSelectStaff(s.id, checked as boolean))}
              />
            </th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <Checkbox
                  checked={selectedStaff.has(member.id)}
                  onCheckedChange={(checked) => onSelectStaff(member.id, checked as boolean)}
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>
                      {getInitials(member.first_name, member.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.first_name} {member.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">{member.role}</td>
              <td className="py-3 px-4">
                <Badge variant="secondary" className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => onAction(member, e)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
