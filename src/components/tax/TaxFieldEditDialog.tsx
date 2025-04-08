
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
import { TaxField, TaxCategory } from '@/types/types';

interface TaxFieldEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxField: TaxField | null;
  onSave: (taxField: TaxField) => void;
  categories?: TaxCategory[]; // Added this prop
}

const TaxFieldEditDialog: React.FC<TaxFieldEditDialogProps> = ({
  isOpen,
  onClose,
  taxField,
  onSave,
  categories
}) => {
  const form = useForm<TaxField>({
    defaultValues: taxField || {
      id: '',
      name: '',
      description: '',
      defaultValue: 0,
      currentValue: 0,
      valueType: 'percentage',
      category: 'Other',
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      applicableToResidents: true,
      applicableToNonResidents: true,
      applicableToVesselTypes: ['NOR', 'NIS', 'Other'],
    }
  });

  useEffect(() => {
    if (taxField) {
      form.reset(taxField);
    }
  }, [taxField, form]);

  const handleSubmit = (formData: TaxField) => {
    // Ensure the category is of TaxCategory type
    const updatedTaxField: TaxField = {
      ...formData,
      category: formData.category as TaxCategory
    };
    onSave(updatedTaxField);
  };

  // Default tax categories if not provided
  const taxCategories: TaxCategory[] = categories || [
    'Basic Income Tax',
    'Progressive Tax',
    'Social Security',
    'Maritime Allowance',
    'Special Deduction',
    'Pension',
    'Union Fee',
    'Insurance',
    'Residence Tax',
    'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{taxField ? 'Edit Tax Field' : 'Create New Tax Field'}</DialogTitle>
          <DialogDescription>
            {taxField 
              ? `Modify the details for ${taxField.name}`
              : 'Create a new tax field with its rules and applicability'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Basic Income Tax Rate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain what this tax field represents" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                      {taxCategories.map((category) => (
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
                      Is this tax field currently in use?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Applicable To</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="applicableToResidents"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Residents
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableToNonResidents"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Non-Residents
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Vessel Types</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="applicableToVesselTypes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value?.includes('NOR')}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, 'NOR'])
                              : field.onChange(field.value?.filter(
                                  (value) => value !== 'NOR'
                                ));
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        NOR
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableToVesselTypes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value?.includes('NIS')}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, 'NIS'])
                              : field.onChange(field.value?.filter(
                                  (value) => value !== 'NIS'
                                ));
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        NIS
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicableToVesselTypes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value?.includes('Other')}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, 'Other'])
                              : field.onChange(field.value?.filter(
                                  (value) => value !== 'Other'
                                ));
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Other
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {taxField ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxFieldEditDialog;
