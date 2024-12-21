import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, Controller } from "react-hook-form";
import { Staff } from "../../types/staff";
import { useStaff } from "../../contexts/StaffContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "react-hot-toast";
import { Check, ChevronRight, ChevronsLeft, UserPlus, Building2, Briefcase, Mail, Phone, MapPin, Lock } from "lucide-react";
import { cn } from "../../lib/utils";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: Staff | null;
}

type StepStatus = "upcoming" | "current" | "complete";

interface Step {
  id: number;
  name: string;
  fields: string[];
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
}

const defaultSteps: Step[] = [
  {
    id: 1,
    name: "Personal Information",
    fields: ["first_name", "last_name", "email", "phone"],
    icon: UserPlus,
    status: "current",
  },
  {
    id: 2,
    name: "Role & Department",
    fields: ["role", "department"],
    icon: Briefcase,
    status: "upcoming",
  },
  {
    id: 3,
    name: "Location & Access",
    fields: ["office_id", "status", "availability_status"],
    icon: Building2,
    status: "upcoming",
  },
];

export default function StaffModal({ isOpen, onClose, staff }: StaffModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const { addStaff, updateStaff } = useStaff();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<Staff>({
    defaultValues: staff || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      office_id: "",
      status: "active",
      availability_status: "available",
      permissions: {
        leads: false,
        safaris: false,
        vehicles: false,
        reports: false,
        settings: false,
        finance: false,
        staff: false,
        clients: false
      }
    },
  });

  const updateStepStatus = (stepNumber: number, status: StepStatus) => {
    setSteps(steps.map(step => 
      step.id === stepNumber ? { ...step, status } : step
    ));
  };

  const goToNextStep = () => {
    updateStepStatus(currentStep, "complete");
    updateStepStatus(currentStep + 1, "current");
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    updateStepStatus(currentStep, "upcoming");
    updateStepStatus(currentStep - 1, "current");
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: Staff) => {
    try {
      setIsSubmitting(true);
      if (staff) {
        await updateStaff(staff.id, data);
        toast.success("Staff member updated successfully");
      } else {
        await addStaff(data);
        toast.success("Staff member added successfully");
      }
      reset();
      setCurrentStep(1);
      setSteps(defaultSteps);
      onClose();
    } catch (error) {
      toast.error("An error occurred while saving staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="John"
                      className="h-11 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      error={errors.first_name?.message}
                    />
                  )}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Doe"
                      className="h-11 px-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      error={errors.last_name?.message}
                    />
                  )}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="john.doe@example.com"
                      error={errors.email?.message}
                    />
                  </div>
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9+\-\s()]*$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field }) => (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      {...field}
                      className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="+1 (234) 567-8900"
                      error={errors.phone?.message}
                    />
                  </div>
                )}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-20" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="admin" className="hover:bg-purple-50">Administrator</SelectItem>
                        <SelectItem value="manager" className="hover:bg-purple-50">Manager</SelectItem>
                        <SelectItem value="agent" className="hover:bg-purple-50">Agent</SelectItem>
                        <SelectItem value="driver" className="hover:bg-purple-50">Driver</SelectItem>
                        <SelectItem value="guide" className="hover:bg-purple-50">Guide</SelectItem>
                        <SelectItem value="finance" className="hover:bg-purple-50">Finance</SelectItem>
                        <SelectItem value="support" className="hover:bg-purple-50">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">Department</Label>
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-20" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="sales" className="hover:bg-purple-50">Sales</SelectItem>
                        <SelectItem value="operations" className="hover:bg-purple-50">Operations</SelectItem>
                        <SelectItem value="finance" className="hover:bg-purple-50">Finance</SelectItem>
                        <SelectItem value="hr" className="hover:bg-purple-50">Human Resources</SelectItem>
                        <SelectItem value="support" className="hover:bg-purple-50">Customer Support</SelectItem>
                        <SelectItem value="transport" className="hover:bg-purple-50">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department.message}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="office_id" className="text-sm font-medium text-gray-700">Office</Label>
              <Controller
                name="office_id"
                control={control}
                rules={{ required: "Office is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-20" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white">
                        <SelectValue placeholder="Select office" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="nairobi" className="hover:bg-purple-50">Nairobi HQ</SelectItem>
                        <SelectItem value="mombasa" className="hover:bg-purple-50">Mombasa Branch</SelectItem>
                        <SelectItem value="kisumu" className="hover:bg-purple-50">Kisumu Branch</SelectItem>
                        <SelectItem value="nakuru" className="hover:bg-purple-50">Nakuru Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.office_id && (
                <p className="text-sm text-red-500">{errors.office_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-20" />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="h-11 pl-12 pr-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="active" className="hover:bg-purple-50">Active</SelectItem>
                        <SelectItem value="inactive" className="hover:bg-purple-50">Inactive</SelectItem>
                        <SelectItem value="pending" className="hover:bg-purple-50">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-purple-50/30 border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-purple-900">{staff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {currentStep === 1
              ? "Enter the staff member's personal information."
              : currentStep === 2
              ? "Specify the role and department details."
              : "Set location and access permissions."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <nav aria-label="Progress" className="py-4">
          <ol className="flex items-center space-x-8">
            {steps.map((step) => (
              <li key={step.id} className="flex-1">
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full mx-auto",
                      step.status === "complete"
                        ? "bg-purple-600 text-white"
                        : step.status === "current"
                        ? "bg-purple-100 border-2 border-purple-600 text-purple-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {step.status === "complete" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="mt-2">
                    <p
                      className={cn(
                        "text-xs font-medium text-center",
                        step.status === "complete"
                          ? "text-purple-600"
                          : step.status === "current"
                          ? "text-purple-600"
                          : "text-gray-500"
                      )}
                    >
                      {step.name}
                    </p>
                  </div>
                  {step.id !== steps.length && (
                    <div
                      className={cn(
                        "absolute top-5 left-full w-full h-0.5 -translate-y-1/2",
                        step.status === "complete"
                          ? "bg-purple-600"
                          : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {renderStepContent(currentStep)}
          </div>

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                className="flex items-center gap-2 hover:bg-purple-50"
              >
                <ChevronsLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : staff ? "Update Staff" : "Add Staff"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
