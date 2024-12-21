import React, { useState, useEffect, useMemo } from 'react';
import { GitBranch, Plus, Search, MapPin, Globe, DollarSign, Users, BarChart3, Bell, Calendar, ArrowUpRight, ArrowDownRight, Building2, Mail, Phone, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import TimezoneSelect from 'react-timezone-select';
import Select, { SingleValue } from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { getOffices, createOffice, updateOffice, deleteOffice } from '../lib/api/offices';
import { Office, OfficeFormData } from '../types/office';
import { Staff, StaffRole } from '../types/staff';
import toast from 'react-hot-toast';
import { useError } from '../contexts/ErrorContext';
import { useStaff } from '../contexts/StaffContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AddBranchForm } from '../components/branches/AddBranchForm';
import { Toaster } from "../components/ui/toaster";

// Mock data for demonstration
const mockStaffMembers = [
  { id: 1, name: 'John Doe', role: 'Branch Manager', email: 'john@safari.com', avatar: '/avatars/john.jpg' },
  { id: 2, name: 'Jane Smith', role: 'Sales Lead', email: 'jane@safari.com', avatar: '/avatars/jane.jpg' },
  // Add more mock staff members as needed
];

const mockSalesData = {
  daily: [1200, 1900, 1500, 1800, 2000, 1700, 2100],
  monthly: [35000, 42000, 38000, 41000, 44000, 40000],
  labels: {
    daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
};

const mockNotifications = [
  { id: 1, title: 'New Staff Member', message: 'Sarah Johnson has joined Nairobi Branch', time: '2 hours ago', type: 'info' },
  { id: 2, title: 'Sales Target Achieved', message: 'Mombasa Branch exceeded monthly target', time: '5 hours ago', type: 'success' },
  // Add more notifications as needed
];

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const colors = {
  primary: {
    light: '#F4F7FE',
    default: '#4318FF',
    dark: '#2B3674',
  },
  secondary: {
    light: '#F4F7FE',
    default: '#707EAE',
    dark: '#2B3674',
  },
  success: {
    light: '#E6FAF5',
    default: '#01B574',
    dark: '#016B44',
  },
  warning: {
    light: '#FFF6E5',
    default: '#FFB547',
    dark: '#B77B2B',
  },
  danger: {
    light: '#FFEFEF',
    default: '#FF5252',
    dark: '#B73A3A',
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#EEFBEE] text-[#2AD168] border border-[#2AD168]/20';
      case 'inactive':
        return 'bg-gray-100 text-gray-500 border border-gray-200';
      case 'pending':
        return 'bg-amber-50 text-amber-500 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)} 
      flex items-center gap-1.5 w-fit`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status.toLowerCase() === 'active' ? 'bg-[#2AD168]' : 'bg-gray-400'
      }`} />
      {status}
    </span>
  );
};

const MetricCard = ({ title, value, change, icon, trend }: DashboardMetric) => {
  return (
    <Card className="bg-white dark:bg-navy-800 overflow-hidden relative border-l-4 border-primary/50 hover:border-primary transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            trend === 'up' ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'
          }`}>
            {icon}
          </div>
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className={`text-sm ${trend === 'up' ? 'text-success-dark' : 'text-danger-dark'} flex items-center`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Branches() {
  const { handleError } = useError();
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimezone, setSelectedTimezone] = useState<any>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Get staff context with debug logging
  const staffContext = useStaff();
  console.log('Staff Context:', staffContext);
  const { staff: allStaff, getStaff, updateStaff, isLoading: staffLoading } = staffContext;

  // Fetch staff and offices on component mount
  useEffect(() => {
    console.log('Fetching data...');
    const fetchData = async () => {
      try {
        const [staffResult] = await Promise.all([
          getStaff(),
          loadOffices()
        ]);
        console.log('Staff fetch result:', staffResult);
      } catch (error) {
        console.error('Error fetching data:', error);
        handleError(error as Error, 'Fetching Data');
      }
    };

    fetchData();
  }, []);

  // Debug staff data changes
  useEffect(() => {
    console.log('All Staff Details:', allStaff.map(staff => ({
      id: staff.id,
      name: `${staff.first_name} ${staff.last_name}`,
      branch: staff.branch
    })));
  }, [allStaff]);

  // Debug staff data
  useEffect(() => {
    console.log('All Staff:', allStaff);
    console.log('Unassigned Staff:', getUnassignedStaff());
  }, [allStaff]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<OfficeFormData>();

  const metrics: DashboardMetric[] = [
    {
      title: 'Total Branches',
      value: offices.length,
      change: 12.5,
      icon: <Building2 className="w-6 h-6" />,
      trend: 'up',
    },
    {
      title: 'Active Staff',
      value: '245',
      change: 8.2,
      icon: <Users className="w-6 h-6" />,
      trend: 'up',
    },
    {
      title: 'Monthly Sales',
      value: '$142,384',
      change: -3.4,
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'down',
    },
    {
      title: 'Customer Satisfaction',
      value: '94%',
      change: 5.1,
      icon: <BarChart3 className="w-6 h-6" />,
      trend: 'up',
    },
  ];

  useEffect(() => {
    if (selectedOffice) {
      setSelectedTimezone({ value: selectedOffice.timezone, label: selectedOffice.timezone });
      reset(selectedOffice);
    } else {
      const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimezone({ value: defaultTimezone, label: defaultTimezone });
      reset();
    }
  }, [selectedOffice, reset]);

  const loadOffices = async () => {
    try {
      const data = await getOffices();
      setOffices(data);
    } catch (error) {
      handleError(error as Error, 'Loading Branches');
      setOffices([]);
    }
  };

  const onSubmit = async (data: OfficeFormData) => {
    try {
      setIsLoading(true);
      const officeData = {
        ...data,
        timezone: selectedTimezone.value || 'UTC',
      };

      if (selectedOffice) {
        await updateOffice(selectedOffice.id, officeData);
        toast.success('Branch updated successfully');
      } else {
        await createOffice({
          ...officeData,
          company_id: '00000000-0000-0000-0000-000000000000', // Replace with actual company ID
          status: 'active',
          settings: {}
        });
        toast.success('Branch created successfully');
      }
      loadOffices();
      setShowAddBranchDialog(false);
      reset();
    } catch (error) {
      handleError(error as Error, 'Saving Branch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      await deleteOffice(id);
      toast.success('Branch deleted successfully');
      loadOffices();
    } catch (error) {
      handleError(error as Error, 'Deleting Branch');
    }
  };

  const filteredOffices = offices.filter(office => 
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Staff management functions
  const getAssignedStaff = (officeId: string) => {
    if (!allStaff) return [];
    return allStaff.filter(staff => staff.office_id === officeId);
  };

  const getUnassignedStaff = () => {
    if (!allStaff) return [];
    return allStaff.filter(staff => !staff.office_id);
  };

  const filteredUnassignedStaff = useMemo(() => {
    if (!allStaff) return [];
    return getUnassignedStaff().filter(staff => 
      staffSearchTerm === '' || 
      staff.first_name.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
      staff.last_name.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(staffSearchTerm.toLowerCase())
    );
  }, [allStaff, staffSearchTerm]);

  const handleAssignStaff = async (staffId: string, officeId: string) => {
    if (!selectedOffice || !staffId) return;
    
    try {
      await updateStaff(staffId, { office_id: officeId });
      toast.success('Staff assigned successfully');
      getStaff(); // Refresh staff list
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast.error('Failed to assign staff');
    }
  };

  const handleUnassignStaff = async (staffId: string) => {
    if (!staffId) return;
    
    try {
      await updateStaff(staffId, { office_id: null });
      toast.success('Staff unassigned successfully');
      getStaff(); // Refresh staff list
    } catch (error) {
      console.error('Error unassigning staff:', error);
      toast.error('Failed to unassign staff');
    }
  };

  const renderStaffSection = (office: Office) => {
    const assignedStaff = getAssignedStaff(office.id);
    
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Staff Members</h3>
          <Button
            onClick={() => {
              setSelectedOffice(office);
              setShowStaffDialog(true);
            }}
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Assign Staff
          </Button>
        </div>
        
        {staffLoading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : assignedStaff.length > 0 ? (
          <div className="grid gap-4">
            {assignedStaff.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{staff.first_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{staff.first_name} {staff.last_name}</p>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnassignStaff(staff.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Unassign
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No staff assigned</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by assigning staff members to this branch.
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleAddBranch = async (data: any) => {
    try {
      setIsLoading(true);
      await createOffice({
        ...data,
        status: 'active',
      });
      await loadOffices();
      toast.success('Branch created successfully');
      setShowAddBranchDialog(false);
    } catch (error) {
      console.error('Error creating branch:', error);
      toast.error('Failed to create branch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="min-h-screen bg-gray-50/50 dark:bg-navy-900 p-3 sm:p-6 transition-all">
        <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
          {/* Mobile-optimized Header */}
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#EEFBEE] rounded-xl flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-[#2AD168]" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Branch Management
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage and monitor your organization's branches
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="relative bg-white dark:bg-navy-800 h-10 w-10">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2AD168] rounded-full animate-pulse" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[300px]">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {mockNotifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-gray-500">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    onClick={() => setShowAddBranchDialog(true)}
                    className="bg-[#2AD168] hover:bg-[#25BA5B] text-white gap-2 h-10 px-4"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Branch</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-optimized Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Mobile-optimized Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-8 space-y-4">
              {/* Mobile-optimized Search */}
              <Card className="bg-white dark:bg-navy-800">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search branches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-navy-900 border-0 h-10"
                      />
                    </div>
                    <Select
                      options={[
                        { value: 'all', label: 'All Branches' },
                        { value: 'active', label: 'Active Only' },
                        { value: 'inactive', label: 'Inactive Only' },
                      ]}
                      className="w-full sm:w-[200px]"
                      placeholder="Filter by Status"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Mobile-optimized Branch Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredOffices.map((office) => (
                  <Card
                    key={office.id}
                    className="bg-white dark:bg-navy-800 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden border-l-4 border-primary/50 hover:border-primary"
                    onClick={() => setSelectedOffice(office)}
                  >
                    <CardHeader className="pb-2 px-4 pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#EEFBEE] group-hover:bg-[#EEFBEE]/80 transition-colors">
                            <Building2 className="w-5 h-5 text-[#2AD168]" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">
                              {office.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4" />
                              {office.city}, {office.country}
                            </CardDescription>
                          </div>
                        </div>
                        <StatusBadge status={office.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <Link 
                          to={`/staff?branch=${office.id}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Users className="w-4 h-4" />
                          <span className="text-sm">12 Staff</span>
                        </Link>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{office.currency}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{office.timezone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#2AD168]">
                          <BarChart3 className="w-4 h-4" />
                          <span className="text-sm">↑ 12%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mobile-optimized Details Panel */}
            <div className="lg:col-span-4">
              {selectedOffice ? (
                <Card className="bg-white dark:bg-navy-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Branch Details</CardTitle>
                      <StatusBadge status={selectedOffice.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-navy-900">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                        <TabsTrigger value="sales">Sales</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Location</h4>
                          <p className="text-sm text-gray-500 flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5" />
                            {selectedOffice.address || `${selectedOffice.city}, ${selectedOffice.country}`}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="w-4 h-4" />
                              <span>branch@safari.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />
                              <span>+254 123 456 789</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Performance</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-[#EEFBEE] rounded-lg">
                              <p className="text-xs text-gray-500">Monthly Sales</p>
                              <p className="text-lg font-semibold text-[#2AD168]">$45,231</p>
                            </div>
                            <div className="p-3 bg-primary-light rounded-lg">
                              <p className="text-xs text-gray-500">Staff Count</p>
                              <p className="text-lg font-semibold text-primary-dark">12</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="staff" className="space-y-4 pt-4">
                        <div className="grid gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Branch Staff</CardTitle>
                              <CardDescription>
                                Manage staff assignments for this branch
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {selectedOffice ? (
                                renderStaffSection(selectedOffice)
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  Select a branch to manage staff
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex items-center justify-center h-[400px] bg-white dark:bg-navy-800">
                  <CardContent className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-[#EEFBEE] flex items-center justify-center mx-auto mb-4">
                      <GitBranch className="w-8 h-8 text-[#2AD168]" />
                    </div>
                    <p className="text-gray-500">Select a branch to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Assignment Dialog with debug info */}
      <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">Assign Staff to Branch</DialogTitle>
            <DialogDescription>
              {selectedOffice && `Select staff members to assign to ${selectedOffice.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 mb-4">
                <p>Staff Loading: {staffLoading.toString()}</p>
                <p>Total Staff: {allStaff?.length}</p>
                <p>Unassigned Staff: {getUnassignedStaff().length}</p>
              </div>
            )}

            {/* Search Staff */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={staffSearchTerm}
                onChange={(e) => setStaffSearchTerm(e.target.value)}
              />
            </div>

            {/* Staff List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {staffLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white" />
                </div>
              ) : filteredUnassignedStaff.length > 0 ? (
                filteredUnassignedStaff.map((staff) => (
                  <div 
                    key={staff.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar_url} />
                        <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.first_name} {staff.last_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{staff.role}</p>
                      </div>
                    </div>
                    {selectedOffice && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignStaff(staff.id, selectedOffice.id)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {staffSearchTerm ? 'No staff members found' : 'No unassigned staff members available'}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs mt-2">
                      <p>Staff Loading: {staffLoading.toString()}</p>
                      <p>Total Staff: {allStaff?.length}</p>
                      <p>Search Term: {staffSearchTerm}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowStaffDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Dialog */}
      <Dialog 
        open={showAddBranchDialog} 
        onOpenChange={setShowAddBranchDialog}
      >
        <DialogContent className="sm:max-w-[90%] lg:max-w-[1200px] p-0">
          <AddBranchForm
            onSubmit={handleAddBranch}
            onCancel={() => setShowAddBranchDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Branch Cards with Staff Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredOffices.map((office) => (
          <Card key={office.id} className="overflow-hidden">
            <CardHeader className="pb-2 px-4 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EEFBEE] group-hover:bg-[#EEFBEE]/80 transition-colors">
                    <Building2 className="w-5 h-5 text-[#2AD168]" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors">
                      {office.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {office.city}, {office.country}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status={office.status} />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Existing branch content */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Link 
                  to={`/staff?branch=${office.id}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">12 Staff</span>
                </Link>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{office.currency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{office.timezone}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2AD168]">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">↑ 12%</span>
                </div>
              </div>
              
              {/* Staff Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Staff Members</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOffice(office);
                      setShowStaffDialog(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Assign Staff
                  </Button>
                </div>
                <div className="space-y-3">
                  {getAssignedStaff(office.id).map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={staff.avatar_url} />
                          <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.first_name} {staff.last_name}</p>
                          <p className="text-sm text-gray-500">{staff.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnassignStaff(staff.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {getAssignedStaff(office.id).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No staff members assigned to this branch
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Toaster />
    </React.Fragment>
  );
}