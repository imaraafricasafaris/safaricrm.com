import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  User,
  Edit,
  Building2,
  ClipboardList,
  UserCog,
  Power,
  Trash2,
  UserCheck,
  KeyRound,
  Bell,
  History,
  PauseCircle,
  Briefcase,
  BarChart2,
  FileDown,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Staff } from "../../types/staff";
import { useStaff } from "../../contexts/StaffContext";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { TaskAssignment } from "./TaskAssignment";
import { ActivityLogs } from "./ActivityLogs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface StaffActionsProps {
  staff: Staff;
  onEdit: () => void;
}

export function StaffActions({ staff, onEdit }: StaffActionsProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = React.useState(false);
  const [showTaskDialog, setShowTaskDialog] = React.useState(false);
  const [showLogsDialog, setShowLogsDialog] = React.useState(false);
  const [showBranchDialog, setShowBranchDialog] = React.useState(false);
  const [showRoleDialog, setShowRoleDialog] = React.useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = React.useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = React.useState(false);
  const { deleteStaff, updateStaff } = useStaff();

  const handleDelete = async () => {
    try {
      await deleteStaff(staff.id);
      toast.success('Staff member deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete staff member');
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updateStaff(staff.id, { status });
      toast.success(`Staff status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update staff status');
    }
  };

  const handleAvailabilityChange = async (availability_status: string) => {
    try {
      await updateStaff(staff.id, { availability_status });
      toast.success(`Availability status updated to ${availability_status}`);
    } catch (error) {
      toast.error('Failed to update availability status');
    }
  };

  const handleBranchChange = async (branch: string) => {
    try {
      await updateStaff(staff.id, { branch });
      toast.success('Branch updated successfully');
      setShowBranchDialog(false);
    } catch (error) {
      toast.error('Failed to update branch');
    }
  };

  const handleRoleChange = async (role: string) => {
    try {
      await updateStaff(staff.id, { role });
      toast.success('Role updated successfully');
      setShowRoleDialog(false);
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleResetPassword = async () => {
    try {
      // Here you would typically call your API to trigger a password reset
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error('Failed to send password reset email');
    }
  };

  const handleSendNotification = async (message: string) => {
    try {
      // Here you would typically call your API to send a notification
      toast.success('Notification sent successfully');
      setShowNotificationDialog(false);
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const handleExportData = async (format: 'pdf' | 'csv') => {
    try {
      // Here you would typically call your API to generate and download the export
      toast.success(`Exporting data as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg rounded-md">
          <DropdownMenuLabel className="font-semibold">Staff Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate(`/staff/${staff.first_name.toLowerCase()}-${staff.last_name.toLowerCase()}`)}>
            <Eye className="h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" /> Edit Details
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowBranchDialog(true)} className="gap-2">
            <Building2 className="h-4 w-4" /> Assign Branch
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTaskDialog(true)} className="gap-2">
            <ClipboardList className="h-4 w-4" /> Assign Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRoleDialog(true)} className="gap-2">
            <UserCog className="h-4 w-4" /> Change Role
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <UserCheck className="h-4 w-4" /> Availability Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white">
              <DropdownMenuItem onClick={() => handleAvailabilityChange('available')}>
                Available
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAvailabilityChange('on_leave')}>
                On Leave
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAvailabilityChange('unavailable')}>
                Unavailable
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuItem onClick={() => setShowDeactivateDialog(true)} className="gap-2">
            <Power className="h-4 w-4" />
            {staff.status === 'active' ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <MoreVertical className="h-4 w-4" /> More Actions
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white">
              <DropdownMenuItem onClick={handleResetPassword} className="gap-2">
                <KeyRound className="h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNotificationDialog(true)} className="gap-2">
                <Bell className="h-4 w-4" /> Send Notification
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowLogsDialog(true)} className="gap-2">
                <History className="h-4 w-4" /> Track Activity Logs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSuspendDialog(true)} className="gap-2">
                <PauseCircle className="h-4 w-4" /> Suspend Temporarily
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <FileDown className="h-4 w-4" /> Export Data
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-white">
                  <DropdownMenuItem onClick={() => handleExportData('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportData('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 gap-2 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete Staff Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Task Assignment Dialog */}
      <TaskAssignment
        staff={staff}
        isOpen={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
      />

      {/* Activity Logs Dialog */}
      <ActivityLogs
        staff={staff}
        isOpen={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
      />

      {/* Branch Assignment Dialog */}
      <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Branch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Branch</Label>
              <Select
                onValueChange={handleBranchChange}
                defaultValue={staff.branch || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nairobi">Nairobi HQ</SelectItem>
                  <SelectItem value="mombasa">Mombasa Branch</SelectItem>
                  <SelectItem value="kisumu">Kisumu Branch</SelectItem>
                  <SelectItem value="nakuru">Nakuru Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select
                onValueChange={handleRoleChange}
                defaultValue={staff.role || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Input
                placeholder="Enter notification message"
                onChange={(e) => handleSendNotification(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {staff.first_name} {staff.last_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {staff.status === 'active' ? 'Deactivate' : 'Activate'} Staff Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {staff.status === 'active' ? 'deactivate' : 'activate'} {staff.first_name} {staff.last_name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleStatusChange(staff.status === 'active' ? 'inactive' : 'active');
                setShowDeactivateDialog(false);
              }}
              className={staff.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {staff.status === 'active' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to temporarily suspend {staff.first_name} {staff.last_name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleStatusChange('suspended');
                setShowSuspendDialog(false);
              }}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}