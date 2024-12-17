import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaff } from '../contexts/StaffContext';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { 
  Mail, 
  Phone, 
  MapPin,
  Building2, 
  UserCircle2, 
  Calendar,
  Shield,
  Heart,
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  BarChart,
  Plus,
  MoreHorizontal,
  Briefcase
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function StaffProfilePage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { findStaffByName, loading, staff } = useStaff();
  const staffMember = name ? findStaffByName(name) : undefined;

  React.useEffect(() => {
    if (staffMember) {
      const fullName = `${staffMember.first_name}-${staffMember.last_name}`.toLowerCase();
      if (!window.location.pathname.includes(fullName)) {
        navigate(`/staff/${fullName}`, { replace: true });
      }
    }
  }, [staffMember, navigate]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    
    const { street, city, state, country, postal_code } = address;
    return [street, city, state, country, postal_code].filter(Boolean).join(', ');
  };

  if (!staffMember && name !== 'new') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 mb-4">Staff member not found</p>
        <Button onClick={() => navigate('/staff')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Staff List
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Profile</h1>
          <Button 
            onClick={() => navigate('/staff')}
            className="mt-4 md:mt-0 transition-all hover:translate-x-[-4px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Staff List
          </Button>
        </div>

        {name === 'new' ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Staff Member</h2>
            {/* Add your new staff form here */}
            <p className="text-muted-foreground">New staff form coming soon...</p>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0 mb-8 space-x-2">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="compensation"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Compensation
              </TabsTrigger>
              <TabsTrigger 
                value="emergency"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Emergency
              </TabsTrigger>
              <TabsTrigger 
                value="timeoff"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Time Off
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="onboarding"
                className="data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-t-lg border-b-2 border-transparent px-6 py-3 transition-all hover:bg-gray-50"
              >
                Onboarding
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                {/* Left Column - Basic Info */}
                <div className="col-span-1 md:col-span-3 space-y-4 md:space-y-6">
                  <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4 ring-4 ring-primary/10">
                          <AvatarImage src={staffMember?.avatar_url} alt={staffMember?.first_name} />
                          <AvatarFallback className="text-2xl md:text-3xl bg-primary/5 text-primary">
                            {staffMember?.first_name?.[0]}{staffMember?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-4 right-0 transform translate-x-1/2">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              staffMember?.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200 ring-2 ring-green-100' 
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-2 ring-yellow-100',
                              "capitalize px-2 py-0.5 text-xs md:text-sm"
                            )}
                          >
                            {staffMember?.status}
                          </Badge>
                        </div>
                      </div>
                      <h2 className="text-xl md:text-2xl font-semibold mb-1">
                        {staffMember?.first_name} {staffMember?.last_name}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-2">#{staffMember?.id.slice(-4)}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4 mr-3 text-primary" />
                        <span>{staffMember?.phone || 'No phone number'}</span>
                      </div>
                      <div className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Mail className="h-4 w-4 mr-3 text-primary" />
                        <span>{staffMember?.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Building2 className="h-4 w-4 mr-3 text-primary" />
                        <span>{staffMember?.branch || 'No branch assigned'}</span>
                      </div>
                      <div className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Briefcase className="h-4 w-4 mr-3 text-primary" />
                        <span>{staffMember?.department || 'No department assigned'}</span>
                      </div>
                      <div className="flex items-start text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <MapPin className="h-4 w-4 mr-3 text-primary mt-0.5" />
                        <span>{formatAddress(staffMember?.address)}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-base md:text-lg">Employee Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-muted-foreground">Date of birth</span>
                        <span className="font-medium">{formatDate(staffMember?.date_of_birth)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-muted-foreground">National ID</span>
                        <span className="font-medium">{staffMember?.national_id || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-muted-foreground">Hire date</span>
                        <span className="font-medium">{formatDate(staffMember?.created_at)}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column - Job Information */}
                <div className="col-span-1 md:col-span-9">
                  <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-base md:text-lg">Job Information</h3>
                      <Button variant="outline" size="sm" className="hover:bg-primary/5 transition-colors">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Info
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          department: "Safari Tours",
                          division: "Tour Operations",
                          manager: "Alex Foster",
                          hireDate: new Date().toISOString(),
                          location: "Nairobi, KE"
                        },
                        {
                          department: "Customer Service",
                          division: "Support",
                          manager: "Sarah Johnson",
                          hireDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                          location: "Mombasa, KE"
                        }
                      ].map((job, index) => (
                        <div key={index} className="grid grid-cols-6 gap-2 p-2 border-b last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                          <div>
                            <div className="text-sm font-medium">{job.department}</div>
                            <div className="text-xs text-primary/70">Department</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{job.division}</div>
                            <div className="text-xs text-primary/70">Division</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{job.manager}</div>
                            <div className="text-xs text-primary/70">Manager</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{formatDate(job.hireDate)}</div>
                            <div className="text-xs text-primary/70">Start Date</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{job.location}</div>
                            <div className="text-xs text-primary/70">Location</div>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/5">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4">
                    <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                      <h3 className="font-semibold mb-4 text-base md:text-lg flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-primary/70" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            action: "Created new itinerary",
                            date: new Date().toISOString(),
                            details: "Masai Mara Safari - 5 Days"
                          },
                          {
                            action: "Updated client booking",
                            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                            details: "Booking #12345"
                          },
                          {
                            action: "Completed task",
                            date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                            details: "Client follow-up call"
                          }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 ring-4 ring-primary/10" />
                            <div>
                              <div className="text-sm font-medium">{activity.action}</div>
                              <div className="text-xs text-primary/70 mb-1">
                                {formatDateTime(activity.date)}
                              </div>
                              <div className="text-sm text-muted-foreground">{activity.details}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                      <h3 className="font-semibold mb-4 text-base md:text-lg flex items-center">
                        <BarChart className="h-5 w-5 mr-2 text-primary/70" />
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            metric: "Itineraries Created",
                            value: "45",
                            change: "+12%",
                            period: "This month",
                            icon: FileText
                          },
                          {
                            metric: "Client Satisfaction",
                            value: "4.8/5",
                            change: "+0.3",
                            period: "Last 30 days",
                            icon: Heart
                          },
                          {
                            metric: "Response Time",
                            value: "2.5h",
                            change: "-15%",
                            period: "This week",
                            icon: Clock
                          }
                        ].map((metric, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-primary/5 mr-4">
                                <metric.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{metric.metric}</div>
                                <div className="text-xs text-primary/70">{metric.period}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">{metric.value}</div>
                              <div className={cn(
                                "text-xs font-medium",
                                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              )}>
                                {metric.change}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compensation">
              <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-base md:text-lg flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary/70" />
                  Compensation History
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      amount: "85,000 KES",
                      type: "Base Salary",
                      effectiveDate: new Date().toISOString(),
                      period: "per month"
                    },
                    {
                      amount: "15,000 KES",
                      type: "Performance Bonus",
                      effectiveDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                      period: "one-time"
                    }
                  ].map((comp, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="text-lg font-bold text-primary">{comp.amount}</div>
                        <div className="text-sm text-primary/70">{comp.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatDate(comp.effectiveDate)}</div>
                        <div className="text-xs text-muted-foreground">{comp.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
