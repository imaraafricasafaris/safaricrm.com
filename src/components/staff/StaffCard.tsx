import React, { useState } from 'react';
import { Staff } from '../../types/staff';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Mail, Phone, Building2, MapPin, ChevronDown, ChevronUp, Calendar, Briefcase } from 'lucide-react';
import { StaffActions } from './StaffActions';
import { formatDate } from '../../lib/utils';
import cn from 'classnames';

interface StaffCardProps {
  staff: Staff;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
}

export default function StaffCard({ staff, viewMode, onEdit }: StaffCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'guide':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'manager':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    if (typeof address === 'object') {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.postal_code
      ].filter(Boolean);
      return parts.join(', ') || 'No address provided';
    }
    return address;
  };

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-200',
      viewMode === 'list' ? 'rounded-none border-0' : 'hover:shadow-lg',
      isExpanded && 'bg-accent/5'
    )}>
      <div className={cn(
        'flex w-full p-4',
        viewMode === 'list' 
          ? 'flex-col sm:grid sm:grid-cols-[280px,200px,180px,100px,100px,80px] sm:items-center gap-4' 
          : 'flex-col gap-3'
      )}>
        {/* Staff Info */}
        <div className={cn(
          'flex gap-3',
          viewMode === 'list' ? 'items-center' : 'items-start'
        )}>
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {staff.first_name?.[0]}{staff.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-medium leading-none">
                  {staff.first_name} {staff.last_name}
                </h3>
                <div className="mt-1">
                  <Badge className={cn('font-normal', getRoleBadgeStyle(staff.role))}>
                    {staff.role}
                  </Badge>
                </div>
              </div>
              {viewMode === 'list' && (
                <div className="flex sm:hidden">
                  <StaffActions onEdit={onEdit} staff={staff} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List View Mobile Info */}
        {viewMode === 'list' && (
          <div className="sm:hidden space-y-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span className="capitalize">{staff.branch || 'No branch'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="capitalize">{staff.department || 'No department'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge className={cn('text-xs capitalize', getStatusColor(staff.status))}>
                {staff.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-1"
              >
                {isExpanded ? 'Less' : 'More'}
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* List View Desktop Columns */}
        {viewMode === 'list' && (
          <>
            <div className="hidden sm:flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{staff.email}</span>
              </div>
            </div>

            <div className="hidden sm:block">
              <Badge className={cn('font-normal', getRoleBadgeStyle(staff.role))}>
                {staff.role}
              </Badge>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span className="capitalize">{staff.branch || 'No branch'}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Badge className={cn('text-xs capitalize', getStatusColor(staff.status))}>
                {staff.status}
              </Badge>
            </div>

            <div className="hidden sm:flex items-center justify-end gap-2">
              <StaffActions onEdit={onEdit} staff={staff} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}

        {/* Grid View Info */}
        {viewMode === 'grid' && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span className="capitalize">{staff.branch}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn('text-xs capitalize', getStatusColor(staff.status))}>
                  {staff.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <StaffActions onEdit={onEdit} staff={staff} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t bg-accent/5 p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{staff.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{formatAddress(staff.address)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>Department: <span className="capitalize">{staff.department || 'Not assigned'}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {formatDate(staff.join_date) || 'Not available'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
