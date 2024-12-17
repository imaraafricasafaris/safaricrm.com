import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Card, CardHeader, CardContent, CardTitle } from "../ui/dialog";
import { Staff } from "../../types/staff";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  UserCircle2, 
  Calendar,
  Shield,
  Heart,
  ContactIcon,
  Briefcase,
  Users,
  User,
  Key,
  Clock,
  ActivitySquare
} from "lucide-react";
import { format } from 'date-fns';
import { 
  dialogContentStyles, 
  dialogHeaderStyles, 
  dialogTitleStyles,
  profileCardStyles,
  badgeVariantStyles
} from '../ui/dialog-styles';
import { cn } from '@/lib/utils';

interface StaffProfileProps {
  staff: Staff;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffProfile({ staff, isOpen, onClose }: StaffProfileProps) {
  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    
    const { street, city, state, country, postal_code } = address;
    return [
      street,
      city,
      state,
      country,
      postal_code
    ].filter(Boolean).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Staff Profile</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={staff.avatar_url} alt={staff.first_name} />
              <AvatarFallback className="text-xl">
                {staff.first_name?.[0]}{staff.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{staff.first_name} {staff.last_name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    badgeVariantStyles[staff.status === 'active' ? 'success' : 'warning'],
                    "capitalize"
                  )}
                >
                  {staff.status}
                </Badge>
                <Badge className={cn(badgeVariantStyles.info, "capitalize")}>
                  {staff.role}
                </Badge>
                {staff.department && (
                  <Badge variant="outline" className="capitalize">
                    {staff.department}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <ContactIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{staff.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="break-words">{formatAddress(staff.address)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Work Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <span>Branch: {staff.branch || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>Department: {staff.department || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Joined: {format(new Date(staff.created_at), 'PPP')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>{staff.emergency_contact_name || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{staff.emergency_contact_phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserCircle2 className="h-5 w-5 text-gray-500" />
                    <span>{staff.emergency_contact_relationship || 'Not specified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Access */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">System Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-500" />
                    <span>Access Level: {staff.access_level || 'Standard'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>Last Active: {staff.last_activity ? format(new Date(staff.last_activity), 'PPP') : 'Never'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ActivitySquare className="h-5 w-5 text-gray-500" />
                    <span>Status: <span className={cn(
                      "capitalize px-2 py-1 rounded-full text-xs font-medium",
                      staff.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    )}>{staff.status}</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
