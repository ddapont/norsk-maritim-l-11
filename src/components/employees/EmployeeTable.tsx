
import React from 'react';
import { Employee } from '@/types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { getEmployeeStatusBadge, getResidencyBadge, getVesselTypeBadge, getTaxRulesBadge } from './EmployeeStatusBadges';

interface EmployeeTableProps {
  filteredEmployees: Employee[];
  handleEditEmployee: (employee: Employee) => void;
  handleDeleteClick: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  filteredEmployees,
  handleEditEmployee,
  handleDeleteClick
}) => {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Classifications</TableHead>
            <TableHead>Salary (NOK)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Tax Rules</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No employees found matching your search
              </TableCell>
            </TableRow>
          ) : (
            filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  {employee.employeeNumber}
                </TableCell>
                <TableCell>
                  {employee.firstName} {employee.lastName}
                  <div className="text-xs text-muted-foreground">{employee.email}</div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {getVesselTypeBadge(employee.vesselType)}
                    {getResidencyBadge(employee.residencyStatus)}
                  </div>
                </TableCell>
                <TableCell>{employee.salary.toLocaleString()}</TableCell>
                <TableCell>
                  {getEmployeeStatusBadge(employee.status)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {employee.tags && employee.tags.length > 0 ? (
                      employee.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getTaxRulesBadge(employee.taxRulePreferences?.useDefaultRules)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
