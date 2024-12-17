import React, { useState, useEffect } from 'react';
import { useStaff } from '../contexts/StaffContext';
import { Staff } from '../types/staff';
import StaffModal from '../components/staff/StaffModal';
import StaffCard from '../components/staff/StaffCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import cn from 'classnames';

export default function StaffPage() {
  const { staff, loading, error, getStaff } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    active: true,
    inactive: false,
    pending: false,
  });

  useEffect(() => {
    getStaff();
  }, []);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowModal(true);
  };

  const filteredStaff = staff?.filter((s) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      s.first_name.toLowerCase().includes(searchString) ||
      s.last_name.toLowerCase().includes(searchString) ||
      s.email.toLowerCase().includes(searchString) ||
      s.role.toLowerCase().includes(searchString) ||
      s.branch?.toLowerCase().includes(searchString) ||
      s.department?.toLowerCase().includes(searchString);

    const matchesFilters = 
      (filters.active && s.status === 'active') ||
      (filters.inactive && s.status === 'inactive') ||
      (filters.pending && s.status === 'pending') ||
      (!filters.active && !filters.inactive && !filters.pending);

    return matchesSearch && matchesFilters;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-[1400px] space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team members and their roles
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:w-[200px]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Staff</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="active"
                          checked={filters.active}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, active: checked as boolean })
                          }
                        />
                        <label htmlFor="active">Active</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inactive"
                          checked={filters.inactive}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, inactive: checked as boolean })
                          }
                        />
                        <label htmlFor="inactive">Inactive</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="pending"
                          checked={filters.pending}
                          onCheckedChange={(checked) =>
                            setFilters({ ...filters, pending: checked as boolean })
                          }
                        />
                        <label htmlFor="pending">Pending</label>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button onClick={() => setShowModal(true)} className="flex-1 sm:flex-none gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Staff</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Staff List View */}
      {viewMode === 'list' && (
        <div className="rounded-md border overflow-hidden">
          {/* Table Header - Hidden on Mobile */}
          <div className="hidden sm:grid grid-cols-[280px,200px,180px,100px,100px,80px] items-center gap-4 border-b bg-muted/50 p-4 font-medium">
            <div>Staff</div>
            <div>Contact</div>
            <div>Department</div>
            <div>Branch</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          
          {/* Staff List */}
          <div className="divide-y">
            {filteredStaff.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No staff members found
              </div>
            ) : (
              filteredStaff.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  viewMode={viewMode}
                  onEdit={() => handleEditStaff(staff)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className={cn(
          'grid gap-3 sm:gap-4',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}>
          {filteredStaff.length === 0 ? (
            <div className="col-span-full text-center py-8 sm:py-12">
              <p className="text-muted-foreground">No staff members found</p>
            </div>
          ) : (
            filteredStaff.map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                viewMode={viewMode}
                onEdit={() => handleEditStaff(staff)}
              />
            ))
          )}
        </div>
      )}

      {/* Staff Modal */}
      <StaffModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        staff={editingStaff}
      />
    </div>
  );
}