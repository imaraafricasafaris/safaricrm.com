import React, { useState, useEffect } from 'react';
import { useStaff } from '../contexts/StaffContext';
import { Staff } from '../types/staff';
import StaffModal from '../components/staff/StaffModal';
import { StaffActions } from '../components/staff/StaffActions';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export default function StaffPage() {
  const { staff, loading, error, getStaff } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error loading staff members</div>
        <Button onClick={() => getStaff()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No staff members found</div>
      </div>
    );
  }

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const filteredStaff = staff.filter((s) => {
    const searchString = searchTerm.toLowerCase();
    return (
      s.first_name.toLowerCase().includes(searchString) ||
      s.last_name.toLowerCase().includes(searchString) ||
      s.email.toLowerCase().includes(searchString) ||
      s.role.toLowerCase().includes(searchString) ||
      s.branch?.toLowerCase().includes(searchString) ||
      s.department?.toLowerCase().includes(searchString)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage your team members and their roles</p>
        </div>
        <Button
          onClick={handleAddStaff}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Staff List/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {staffMember.avatar_url ? (
                        <AvatarImage src={staffMember.avatar_url} alt={staffMember.first_name} />
                      ) : (
                        <AvatarFallback>
                          {getInitials(staffMember.first_name, staffMember.last_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {staffMember.first_name} {staffMember.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{staffMember.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {staffMember.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{staffMember.department}</TableCell>
                  <TableCell>{staffMember.branch}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staffMember.status)}>
                      {staffMember.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <StaffActions staff={staffMember} onEdit={() => handleEditStaff(staffMember)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staffMember) => (
            <Card key={staffMember.id} className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-20 w-20 mb-4">
                  {staffMember.avatar_url ? (
                    <AvatarImage src={staffMember.avatar_url} alt={staffMember.first_name} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {getInitials(staffMember.first_name, staffMember.last_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {staffMember.first_name} {staffMember.last_name}
                </h3>
                <Badge className={`mt-2 ${getStatusColor(staffMember.status)}`}>
                  {staffMember.status}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {staffMember.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {staffMember.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  {staffMember.role}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-4 w-4" />
                  {staffMember.department}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {staffMember.branch}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <StaffActions staff={staffMember} onEdit={() => handleEditStaff(staffMember)} />
              </div>
            </Card>
          ))}
        </div>
      )}

      <StaffModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        staff={editingStaff}
      />
    </div>
  );
}