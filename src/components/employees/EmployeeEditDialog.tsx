
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/types';
import GeneralInformationTab from './GeneralInformationTab';
import TagsClassificationsTab from './TagsClassificationsTab';
import TaxPreferencesTab from './TaxPreferencesTab';

// Pre-defined tags for consistency - exported for use in child components
export const VESSEL_TYPES = ['NOR', 'NIS', 'Other'] as const;
export const RESIDENCY_STATUSES = ['Resident', 'Non-Resident'] as const;
export const EMPLOYEE_STATUSES = ['Active', 'Inactive'] as const;
export const COMMON_TAGS = ['Captain', 'Engineer', 'Officer', 'Deck', 'Offshore', 'Onshore', 'Temporary', 'Permanent'];

interface EmployeeEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  isOpen,
  onClose,
  employee,
  onSave
}) => {
  const [selectedTab, setSelectedTab] = useState('general');
  
  const form = useForm<Employee>({
    defaultValues: employee || {
      id: '',
      employeeNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      vesselType: 'NOR',
      salary: 0,
      taxCard: 'Standard',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      residencyStatus: 'Resident',
      unionMember: false,
      tags: [],
      taxRulePreferences: {
        useDefaultRules: true
      }
    }
  });

  useEffect(() => {
    if (employee) {
      form.reset(employee);
    }
  }, [employee, form]);

  const handleFormSubmit = (data: Employee) => {
    onSave({
      ...data,
      // Ensure numeric values are numbers, not strings
      salary: typeof data.salary === 'string' ? parseFloat(data.salary as unknown as string) : data.salary
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee?.id ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {employee?.id 
              ? `Editing ${employee.firstName} ${employee.lastName}`
              : 'Add a new employee to the system'}
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General Information</TabsTrigger>
                <TabsTrigger value="tags">Tags & Classifications</TabsTrigger>
                <TabsTrigger value="tax">Tax Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <GeneralInformationTab />
              </TabsContent>
              
              <TabsContent value="tags">
                <TagsClassificationsTab />
              </TabsContent>
              
              <TabsContent value="tax">
                <TaxPreferencesTab />
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {employee?.id ? 'Update Employee' : 'Add Employee'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
