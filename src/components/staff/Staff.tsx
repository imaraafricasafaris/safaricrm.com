import React, { useState, useEffect } from 'react';
import { useStaff } from '../../contexts/StaffContext';
import StaffTable from './StaffTable';
import StaffModal from './StaffModal';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Staff } from '../../types/staff';

export default function StaffPage() {
  const { staff, isLoading, error, getStaff } = useStaff();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
  const [selectedStaffMember, setSelectedStaffMember] = useState<Staff | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getStaff();
  }, []);

  const handleSelectStaff = (staffId: string, checked: boolean) => {
    setSelectedStaff(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(staffId);
      } else {
        newSet.delete(staffId);
      }
      return newSet;
    });
  };

  const handleStaffAction = (staff: Staff, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setActionPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
    setSelectedStaffMember(staff);
    setShowActions(true);
  };

  const handleAddStaff = () => {
    setEditingStaff(undefined);
    setShowModal(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setShowModal(true);
    setShowActions(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStaff(undefined);
  };

  const filteredStaff = staff.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.first_name?.toLowerCase().includes(searchLower) ||
      member.last_name?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.role?.toLowerCase().includes(searchLower) ||
      member.branch?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={handleAddStaff} className="bg-[#84cc16] hover:bg-[#65a30d] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2"
          />
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery ? 'No staff members found matching your search' : 'No staff members found'}
        </div>
      ) : (
        <StaffTable staff={filteredStaff} onEdit={handleEditStaff} />
      )}

      <StaffModal
        isOpen={showModal}
        onClose={handleCloseModal}
        staff={editingStaff}
      />
    </div>
  );
}
