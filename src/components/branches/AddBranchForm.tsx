import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, MapPin, Users, X, ArrowRight, Check, Search, User, Clock, Target, Plus, CheckCircle } from 'lucide-react';
import TimezoneSelect from 'react-timezone-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import { cn } from "../../lib/utils";
import { useStaff } from "../../contexts/StaffContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

const formSchema = z.object({
  // Step 1: General Information
  name: z.string()
    .min(2, 'Branch name must be at least 2 characters')
    .max(100, 'Branch name cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Branch name can only contain letters, numbers, spaces, and hyphens'),
  branchCode: z.string()
    .optional()
    .refine((val) => !val || /^[A-Z0-9-]{3,10}$/.test(val), {
      message: 'Branch code must be 3-10 characters long and contain only uppercase letters, numbers, and hyphens'
    }),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City cannot exceed 100 characters'),
  country: z.string()
    .min(2, 'Country must be at least 2 characters'),
  geolocation: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),

  // Step 2: Contact Details
  managerName: z.string()
    .min(2, 'Manager name must be at least 2 characters'),
  managerEmail: z.string()
    .email('Please enter a valid email address'),
  managerPhone: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
  branchEmail: z.string()
    .email('Please enter a valid email address'),
  branchPhone: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),
  whatsappNumber: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid WhatsApp number')
    .optional(),

  // Step 3: Operating Details
  openingTime: z.string(),
  closingTime: z.string(),
  specialNotes: z.string().optional(),
  daysOfOperation: z.array(z.string()),
  currency: z.string(),
  defaultLanguage: z.string(),

  // Step 4: Staff Details
  staffCount: z.number()
    .min(1, 'Staff count must be at least 1')
    .max(1000, 'Staff count cannot exceed 1000'),
  assignedStaff: z.array(z.string()).optional(),
  emergencyContact: z.string()
    .min(2, 'Emergency contact must be specified'),

  // Step 5: Sales and Performance
  monthlySalesTarget: z.number()
    .min(0, 'Monthly sales target cannot be negative'),
  performanceMetrics: z.array(z.string()),
  pricingCategory: z.enum(['ECONOMY', 'MID_RANGE', 'LUXURY']),

  // Step 6: Additional Features
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  amenities: z.array(z.string()).optional(),
  otherAmenities: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps: Step[] = [
  {
    title: "General Information",
    description: "Basic details about your branch",
    icon: Building2,
    fields: ["name", "branchCode", "address", "city", "country", "geolocation"],
  },
  {
    title: "Contact Details",
    description: "How to reach the branch and its manager",
    icon: Phone,
    fields: ["managerName", "managerEmail", "managerPhone", "branchEmail", "branchPhone", "whatsappNumber"],
  },
  {
    title: "Operating Details",
    description: "When and how the branch operates",
    icon: Clock,
    fields: ["openingTime", "closingTime", "specialNotes", "daysOfOperation", "currency", "defaultLanguage"],
  },
  {
    title: "Staff Management",
    description: "Staff allocation and emergency contacts",
    icon: Users,
    fields: ["staffCount", "assignedStaff", "emergencyContact"],
  },
  {
    title: "Performance Goals",
    description: "Set targets and track metrics",
    icon: Target,
    fields: ["monthlySalesTarget", "performanceMetrics", "pricingCategory"],
  },
  {
    title: "Additional Features",
    description: "Extra information and amenities",
    icon: Plus,
    fields: ["description", "amenities", "otherAmenities"],
  },
  {
    title: "Review & Submit",
    description: "Review and confirm branch details",
    icon: CheckCircle,
    fields: [],
  },
];

// Constants for form options
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const PERFORMANCE_METRICS = [
  'Sales Growth',
  'Customer Feedback Score',
  'Conversion Rates',
  'Staff Performance',
  'Customer Retention',
  'Operating Costs'
];

const AMENITIES = [
  'Parking',
  'Disabled Access',
  'Nearby Attractions',
  'Security',
  'WiFi',
  'Meeting Rooms'
];

const PRICING_CATEGORIES = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'MID_RANGE', label: 'Mid-Range' },
  { value: 'LUXURY', label: 'Luxury' }
];

interface AddBranchFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function AddBranchForm({ onSubmit, onCancel }: AddBranchFormProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const { toast } = useToast();
  const { allStaff } = useStaff();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredStaff = React.useMemo(() => {
    if (!allStaff) return [];
    return allStaff.filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allStaff, searchQuery]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      branchCode: "",
      address: "",
      city: "",
      country: "",
      geolocation: {
        latitude: undefined,
        longitude: undefined,
      },
      managerName: "",
      managerEmail: "",
      managerPhone: "",
      branchEmail: "",
      branchPhone: "",
      whatsappNumber: "",
      openingTime: "",
      closingTime: "",
      specialNotes: "",
      daysOfOperation: [],
      currency: "",
      defaultLanguage: "",
      staffCount: 1,
      assignedStaff: [],
      emergencyContact: "",
      monthlySalesTarget: 0,
      performanceMetrics: [],
      pricingCategory: "",
      description: "",
      amenities: [],
      otherAmenities: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="bg-white rounded-lg">
      {/* Progress Steps */}
      <div className="p-6 border-b">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">New Branch</h2>
          </div>
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === index + 1;
                const isPast = currentStep > index + 1;
                return (
                  <li key={step.title} className="relative">
                    {index !== 0 && (
                      <div
                        className={cn(
                          "absolute left-0 -translate-x-1/2 top-1/2 h-[2px] w-full -translate-y-1/2",
                          isPast ? "bg-primary" : "bg-gray-200"
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative flex flex-col items-center group",
                        isActive && "text-primary",
                        !isActive && !isPast && "text-gray-500"
                      )}
                    >
                      <span
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          isActive && "bg-primary text-white",
                          isPast && "bg-primary text-white",
                          !isActive && !isPast && "bg-gray-100"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-medium mt-2">
                        {step.title}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {currentStep === steps.length ? (
              // Review Step
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review Branch Details
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Please review all information before submitting
                  </p>
                </div>
                
                {steps.slice(0, -1).map((step, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{step.title}</h4>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {step.fields.map((field) => (
                        <div key={field} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formatFieldValue(field, form.getValues(field))}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              // Regular Form Steps
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentStepData.description}
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentStepData.fields.map((field) => (
                        <FormField
                          key={field}
                          control={form.control}
                          name={field}
                          render={({ field: formField }) => (
                            <FormItem className={getFieldClassName(field)}>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                {formatFieldLabel(field)}
                                {isFieldRequired(field) && <span className="text-red-500 ml-1">*</span>}
                              </FormLabel>
                              <FormControl>
                                {renderFormField(field, formField)}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </form>
                </Form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t p-6">
        <div className="max-w-3xl mx-auto flex justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={async () => {
                const fields = currentStepData.fields;
                const isValid = await form.trigger(fields as any);
                if (isValid) {
                  setCurrentStep(currentStep + 1);
                }
              }}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
            >
              Create Branch
              <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatFieldValue(field: string, value: any) {
  switch (field) {
    case 'geolocation':
      return `${value.latitude}, ${value.longitude}`;
    case 'daysOfOperation':
      return value.join(', ');
    case 'performanceMetrics':
      return value.join(', ');
    case 'amenities':
      return value.join(', ');
    default:
      return value;
  }
}

function formatFieldLabel(field: string) {
  switch (field) {
    case 'staffCount':
      return 'Staff Capacity';
    case 'assignedStaff':
      return 'Assigned Staff';
    default:
      return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
  }
}

function getFieldClassName(field: string) {
  switch (field) {
    case 'description':
      return 'col-span-2';
    default:
      return '';
  }
}

function isFieldRequired(field: string) {
  switch (field) {
    case 'name':
    case 'address':
    case 'city':
    case 'country':
    case 'managerName':
    case 'managerEmail':
    case 'managerPhone':
    case 'branchEmail':
    case 'branchPhone':
    case 'staffCount':
    case 'emergencyContact':
    case 'monthlySalesTarget':
      return true;
    default:
      return false;
  }
}

function renderFormField(field: string, formField: any) {
  switch (field) {
    case 'description':
      return <Textarea {...formField} className="resize-none h-32" />;
    case 'geolocation':
      return (
        <div className="flex gap-2">
          <Input {...formField} type="number" placeholder="Latitude" />
          <Input {...formField} type="number" placeholder="Longitude" />
        </div>
      );
    case 'daysOfOperation':
      return (
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center">
              <input
                type="checkbox"
                {...formField}
                value={day}
                className="mr-2"
              />
              <span>{day}</span>
            </div>
          ))}
        </div>
      );
    case 'performanceMetrics':
      return (
        <div className="flex flex-wrap gap-2">
          {PERFORMANCE_METRICS.map((metric) => (
            <div key={metric} className="flex items-center">
              <input
                type="checkbox"
                {...formField}
                value={metric}
                className="mr-2"
              />
              <span>{metric}</span>
            </div>
          ))}
        </div>
      );
    case 'amenities':
      return (
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                {...formField}
                value={amenity}
                className="mr-2"
              />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      );
    case 'pricingCategory':
      return (
        <select {...formField} className="w-full">
          {PRICING_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      );
    default:
      return <Input {...formField} type="text" />;
  }
}
