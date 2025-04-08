
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Tags } from 'lucide-react';
import { Employee, TaxField } from '@/types/types';
import { mockTaxFields } from '@/data/mockData';

// Pre-defined tags for consistency
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
  const [customTag, setCustomTag] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>(COMMON_TAGS);
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

  const handleAddTag = () => {
    if (customTag && !form.getValues().tags.includes(customTag)) {
      const currentTags = form.getValues().tags || [];
      form.setValue('tags', [...currentTags, customTag]);
      
      // Add to available tags if not already there
      if (!availableTags.includes(customTag)) {
        setAvailableTags([...availableTags, customTag]);
      }
      
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handleSelectTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    if (!currentTags.includes(tag)) {
      form.setValue('tags', [...currentTags, tag]);
    }
  };

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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General Information</TabsTrigger>
                <TabsTrigger value="tags">Tags & Classifications</TabsTrigger>
                <TabsTrigger value="tax">Tax Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="EMP-001" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this employee
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EMPLOYEE_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="Department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary (NOK)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="600000" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hire Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Card</FormLabel>
                        <FormControl>
                          <Input placeholder="Standard" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="unionMember"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Union Member</FormLabel>
                            <FormDescription>
                              Is this employee a member of a union?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {form.watch('unionMember') && (
                  <FormField
                    control={form.control}
                    name="unionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Union Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Union name" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="tags" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vesselType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vessel Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vessel type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {VESSEL_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Type of vessel the employee works on
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="residencyStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residency Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select residency status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RESIDENCY_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Tax residency status
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <FormLabel>Employee Tags</FormLabel>
                    <FormDescription>
                      Add tags to categorize this employee
                    </FormDescription>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.watch('tags')?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 items-center">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom tag"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={handleAddTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Common Tags</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => handleSelectTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tax" className="space-y-4">
                <FormField
                  control={form.control}
                  name="taxRulePreferences.useDefaultRules"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Use Default Tax Rules</FormLabel>
                        <FormDescription>
                          Apply standard tax rules based on vessel type and residency status
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {!form.watch('taxRulePreferences.useDefaultRules') && (
                  <div className="space-y-4">
                    <FormLabel>Custom Tax Rule Selection</FormLabel>
                    <FormDescription>
                      Select which tax rules should apply to this employee
                    </FormDescription>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-4">
                      {mockTaxFields.map((taxField) => (
                        <div 
                          key={taxField.id} 
                          className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                        >
                          <div className="space-y-0.5">
                            <div className="font-medium">{taxField.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {taxField.description}
                            </div>
                            <div className="text-xs">
                              {taxField.valueType === 'percentage' 
                                ? `${taxField.currentValue}%` 
                                : `${taxField.currentValue} NOK`}
                            </div>
                          </div>
                          <FormField
                            control={form.control}
                            name="taxRulePreferences.customRules"
                            render={({ field }) => (
                              <FormControl>
                                <Switch
                                  checked={(field.value || []).includes(taxField.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    const newValues = checked
                                      ? [...currentValues, taxField.id]
                                      : currentValues.filter(id => id !== taxField.id);
                                    field.onChange(newValues);
                                  }}
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
