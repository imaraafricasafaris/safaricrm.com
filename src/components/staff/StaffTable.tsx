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
import { Building2 } from 'lucide-react';
import { Staff } from '../../types/staff';

interface StaffTableProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
}

export default function StaffTable({ staff, onEdit }: StaffTableProps) {
  const columns: any[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "office_name",
      header: "Branch",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey || column.id}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{`${member.first_name} ${member.last_name}`}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone || '-'}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{member.office_name || "No Branch"}</span>
                </div>
              </TableCell>
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
