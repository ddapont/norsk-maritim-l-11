
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, FileDown, Edit, Trash2, Tags, AlertCircle } from 'lucide-react';
import { Employee } from '@/types/types';
import { mockEmployees } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import EmployeeEditDialog from '@/components/employees/EmployeeEditDialog';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if employees in mockData already have tags
    const enhancedEmployees = mockEmployees.map(emp => ({
      ...emp,
      tags: emp.tags || [], // Ensure tags exist
      taxRulePreferences: emp.taxRulePreferences || { useDefaultRules: true }
    }));
    
    setEmployees(enhancedEmployees);
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.tags && employee.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
  );

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsEditDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      setEmployees(updatedEmployees);
      
      toast({
        title: "Employee Deleted",
        description: `${employeeToDelete.firstName} ${employeeToDelete.lastName} has been removed`,
      });
      
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleSaveEmployee = (updatedEmployee: Employee) => {
    let updatedEmployees: Employee[];
    
    if (updatedEmployee.id) {
      // Editing existing employee
      updatedEmployees = employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      
      toast({
        title: "Employee Updated",
        description: `${updatedEmployee.firstName} ${updatedEmployee.lastName}'s information has been updated`,
      });
    } else {
      // Adding new employee
      const newEmployee = {
        ...updatedEmployee,
        id: `${employees.length + 1}`, // Simple ID generation (in a real app would use UUID)
      };
      updatedEmployees = [...employees, newEmployee];
      
      toast({
        title: "Employee Added",
        description: `${newEmployee.firstName} ${newEmployee.lastName} has been added to the system`,
      });
    }
    
    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const exportEmployees = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Position', 'Vessel Type', 'Status', 'Salary', 'Tags'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeNumber,
        `${emp.firstName} ${emp.lastName}`,
        emp.position,
        emp.vesselType,
        emp.status,
        emp.salary,
        emp.tags?.join(';') || ''
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Employee data has been exported to CSV",
    });
  };

  const getEmployeeStatusBadge = (status: 'Active' | 'Inactive') => {
    return status === 'Active' 
      ? <Badge variant="default">{status}</Badge>
      : <Badge variant="secondary">{status}</Badge>;
  };

  const getResidencyBadge = (status: 'Resident' | 'Non-Resident') => {
    return status === 'Resident'
      ? <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{status}</Badge>
      : <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{status}</Badge>;
  };
  
  const getVesselTypeBadge = (type: 'NOR' | 'NIS' | 'Other') => {
    switch(type) {
      case 'NOR':
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{type}</Badge>;
      case 'NIS':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Employees</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search employees..."
              className="pl-8 h-9 w-full md:w-auto rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportEmployees}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={handleAddEmployee}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Manage your maritime employees and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        {employee.taxRulePreferences?.useDefaultRules ? (
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Default</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Custom</Badge>
                        )}
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
        </CardContent>
      </Card>
      
      {/* Employee Edit Dialog */}
      <EmployeeEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center rounded-md bg-amber-50 border border-amber-200 p-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <span className="text-sm text-amber-700">
              All payroll data for this employee will be inaccessible after deletion.
            </span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
