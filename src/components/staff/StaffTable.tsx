import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Staff } from '../../types/staff';

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
}

export default function StaffTable({ staff, onEdit }: StaffTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone || '-'}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.branch || '-'}</TableCell>
              <TableCell>{member.department || '-'}</TableCell>
              <TableCell>{member.position || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(member)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {staff.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No staff members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
