import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Staff } from "../../types/staff";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  UserCircle2, 
  Calendar,
  Shield,
  Heart
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
      <DialogContent className={dialogContentStyles}>
        <DialogHeader className={dialogHeaderStyles}>
          <DialogTitle className={dialogTitleStyles}>Staff Profile</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Header Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={staff.avatar_url} alt={staff.first_name} />
              <AvatarFallback className="text-lg">
                {staff.first_name?.[0]}{staff.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{staff.first_name} {staff.last_name}</h2>
              <div className="flex items-center space-x-2 mt-1">
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
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card className={profileCardStyles}>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{staff.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{formatAddress(staff.address)}</span>
              </div>
            </div>
          </Card>

          {/* Work Information */}
          <Card className={profileCardStyles}>
            <h3 className="text-lg font-semibold mb-4">Work Information</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span>Branch: {staff.branch}</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserCircle2 className="h-5 w-5 text-gray-500" />
                <span>Department: {staff.department}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>Joined: {format(new Date(staff.created_at), 'PPP')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <span>Access Level: {staff.access_level}</span>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className={profileCardStyles}>
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-gray-500" />
                <span>{staff.emergency_contact_name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{staff.emergency_contact_phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
