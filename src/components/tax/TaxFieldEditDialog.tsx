
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SalaryComponent, ComponentType, OperationType, CustomCategory } from '@/types/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface TaxFieldEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  salaryComponent: SalaryComponent | null;
  onSave: (salaryComponent: SalaryComponent) => void;
  categories: string[];
  components: SalaryComponent[];
  customCategories: CustomCategory[];
}

const TaxFieldEditDialog: React.FC<TaxFieldEditDialogProps> = ({
  isOpen,
  onClose,
  salaryComponent,
  onSave,
  categories,
  components,
  customCategories
}) => {
  const form = useForm<SalaryComponent>({
    defaultValues: salaryComponent || {
      id: '',
      name: '',
      description: '',
      defaultValue: 0,
      currentValue: 0,
      valueType: 'percentage',
      category: 'Other',
      componentType: 'tax',
      operation: 'subtract',
      operatesOn: ['grossSalary'],
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      applicableToResidents: true,
      applicableToNonResidents: true,
      applicableToVesselTypes: ['NOR', 'NIS', 'Other'],
      applicableToCountries: [],
    }
  });

  useEffect(() => {
    if (salaryComponent) {
      form.reset(salaryComponent);
    }
  }, [salaryComponent, form]);

  const handleSubmit = (formData: SalaryComponent) => {
    // Ensure the category is a string
    const updatedComponent: SalaryComponent = {
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSave(updatedComponent);
  };

  const vesselTypeCategory = customCategories.find(cat => cat.type === 'vesselType');
  const countryCategory = customCategories.find(cat => cat.type === 'country');
  const residencyCategory = customCategories.find(cat => cat.type === 'residencyStatus');

  const getVesselTypes = () => {
    if (vesselTypeCategory && vesselTypeCategory.values.length > 0) {
      return vesselTypeCategory.values;
    }
    return ['NOR', 'NIS', 'Other'];
  };

  const getCountries = () => {
    if (countryCategory && countryCategory.values.length > 0) {
      return countryCategory.values;
    }
    return [];
  };

  const getResidencyTypes = () => {
    if (residencyCategory && residencyCategory.values.length > 0) {
      return residencyCategory.values.map(value => ({ 
        label: value, 
        value: value 
      }));
    }
    return [
      { label: 'Residents', value: 'Resident' },
      { label: 'Non-Residents', value: 'Non-Resident' }
    ];
  };

  const componentTypeOptions = [
    { label: 'Tax', value: 'tax' },
    { label: 'Deduction', value: 'deduction' },
    { label: 'Contribution', value: 'contribution' },
    { label: 'Allowance', value: 'allowance' },
    { label: 'Custom', value: 'custom' }
  ];

  const operationTypeOptions = [
    { label: 'Add to salary', value: 'add' },
    { label: 'Subtract from salary', value: 'subtract' },
    { label: 'Multiply by factor', value: 'multiply' },
    { label: 'Divide by factor', value: 'divide' },
    { label: 'Override (replace)', value: 'override' },
    { label: 'Conditional', value: 'condition' }
  ];

  const operatesOnOptions = [
    { label: 'Gross Salary', value: 'grossSalary', description: 'Base gross salary amount' },
    ...components
      .filter(comp => comp.id !== (salaryComponent?.id || ''))
      .map(comp => ({
        label: comp.name,
        value: comp.id,
        description: `${comp.description} (${comp.valueType === 'percentage' ? comp.currentValue + '%' : comp.currentValue + ' NOK'})`
      }))
  ];

  const watchComponentType = form.watch('componentType');
  const watchOperation = form.watch('operation');

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{salaryComponent ? 'Edit Salary Component' : 'Create New Salary Component'}</DialogTitle>
          <DialogDescription>
            {salaryComponent 
              ? `Modify the details for ${salaryComponent.name}`
              : 'Create a new salary component with its rules and applicability'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Basic Income Tax Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="componentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange as (value: string) => void} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select component type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {componentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain what this component represents" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select value type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (NOK)</SelectItem>
                        <SelectItem value="threshold">Threshold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operation</FormLabel>
                    <Select 
                      onValueChange={field.onChange as (value: string) => void} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operationTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {watchOperation === 'add' ? 'Adds to the final salary (e.g., allowances)' :
                       watchOperation === 'subtract' ? 'Subtracts from salary (e.g., taxes, deductions)' :
                       watchOperation === 'multiply' ? 'Multiplies by a factor' :
                       watchOperation === 'divide' ? 'Divides by a factor' :
                       watchOperation === 'override' ? 'Replaces the value entirely' :
                       'Applies conditionally based on rules'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="operatesOn"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Operates On</FormLabel>
                  <FormDescription>
                    Select what this component operates on (e.g., gross salary or another component)
                  </FormDescription>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Component</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operatesOnOptions.map((option) => (
                        <TableRow key={option.value}>
                          <TableCell>
                            <Checkbox 
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], option.value])
                                  : field.onChange(field.value?.filter(
                                      (value) => value !== option.value
                                    ));
                              }}
                            />
                          </TableCell>
                          <TableCell>{option.label}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {option.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Status</FormLabel>
                    <FormDescription>
                      Is this component currently in use?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-base font-medium mb-2">Applicability</h3>
              <div className="space-y-4 border rounded-md p-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Residency Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getResidencyTypes().map((type) => (
                      <FormField
                        key={type.value}
                        control={form.control}
                        name={type.value === 'Resident' ? 'applicableToResidents' : 'applicableToNonResidents'}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {type.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Vessel Types</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {getVesselTypes().map((vesselType) => (
                      <FormField
                        key={vesselType}
                        control={form.control}
                        name="applicableToVesselTypes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value?.includes(vesselType)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], vesselType])
                                    : field.onChange(field.value?.filter(
                                        (value) => value !== vesselType
                                      ));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {vesselType}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {getCountries().length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Countries</h4>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {getCountries().map((country) => (
                        <FormField
                          key={country}
                          control={form.control}
                          name="applicableToCountries"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value?.includes(country)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], country])
                                      : field.onChange(field.value?.filter(
                                          (value) => value !== country
                                        ));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {country}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {salaryComponent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxFieldEditDialog;
