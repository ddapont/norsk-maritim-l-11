
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Employee } from '@/types/types';
import { mockEmployees } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import EmployeeEditDialog from '@/components/employees/EmployeeEditDialog';
import EmployeeSearchBar from '@/components/employees/EmployeeSearchBar';
import EmployeeTable from '@/components/employees/EmployeeTable';
import DeleteEmployeeDialog from '@/components/employees/DeleteEmployeeDialog';

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

  return (
    <div className="space-y-6 fade-in">
      <EmployeeSearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleAddEmployee={handleAddEmployee}
        exportEmployees={exportEmployees}
      />

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Manage your maritime employees and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable 
            filteredEmployees={filteredEmployees}
            handleEditEmployee={handleEditEmployee}
            handleDeleteClick={handleDeleteClick}
          />
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
      <DeleteEmployeeDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        employeeToDelete={employeeToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Employees;
