
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaxField, TaxCategory } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, HelpCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  currentValue: z.coerce.number(),
  valueType: z.enum(['percentage', 'fixed', 'threshold']),
  category: z.string(),
  isActive: z.boolean(),
  applicableToResidents: z.boolean(),
  applicableToNonResidents: z.boolean(),
  applicableToVesselTypes: z.array(z.enum(['NOR', 'NIS', 'Other'])).min(1, "Select at least one vessel type"),
});

type TaxFieldFormValues = z.infer<typeof formSchema>;

interface TaxFieldEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxField: TaxField | null;
  onSave: (field: TaxField) => void;
  categories: TaxCategory[];
}

const taxGuidanceUrls = {
  'Basic Income Tax': 'https://www.skatteetaten.no/en/person/taxes/',
  'Progressive Tax': 'https://www.skatteetaten.no/en/rates/tax-rates-2023/',
  'Social Security': 'https://www.skatteetaten.no/en/business-and-organisation/employer/the-a-melding/rates/national-insurance-contributions/',
  'Maritime Allowance': 'https://www.skatteetaten.no/en/business-and-organisation/reporting-and-industries/industries-special-regulations/shipping/tax-arrangements-for-shipping-companies/',
  'Special Deduction': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/pension/deductions/',
  'Pension': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/pension/',
  'Union Fee': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/membership-fees/',
  'Insurance': 'https://www.skatteetaten.no/en/business-and-organisation/employer/the-a-melding/rates/',
  'Residence Tax': 'https://www.skatteetaten.no/en/person/foreign/are-you-planning-to-work-in-norway/',
  'Other': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/',
};

const TaxFieldEditDialog: React.FC<TaxFieldEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  taxField, 
  onSave,
  categories
}) => {
  const form = useForm<TaxFieldFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: taxField ? {
      name: taxField.name,
      description: taxField.description,
      currentValue: taxField.currentValue,
      valueType: taxField.valueType,
      category: taxField.category,
      isActive: taxField.isActive,
      applicableToResidents: taxField.applicableToResidents,
      applicableToNonResidents: taxField.applicableToNonResidents,
      applicableToVesselTypes: taxField.applicableToVesselTypes,
    } : {
      name: '',
      description: '',
      currentValue: 0,
      valueType: 'percentage',
      category: 'Basic Income Tax',
      isActive: true,
      applicableToResidents: true,
      applicableToNonResidents: false,
      applicableToVesselTypes: ['NOR'],
    }
  });

  const onSubmit = (values: TaxFieldFormValues) => {
    if (taxField) {
      onSave({
        ...taxField,
        ...values,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    onClose();
  };

  const currentCategory = form.watch('category') as keyof typeof taxGuidanceUrls;
  const guidanceUrl = taxGuidanceUrls[currentCategory] || taxGuidanceUrls['Other'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {taxField ? 'Edit Tax Field' : 'Add New Tax Field'}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-5 w-5" asChild>
                    <a href={guidanceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View official tax guidance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
          <DialogDescription>
            {taxField ? 'Update the tax field details' : 'Create a new tax field for Norwegian payroll'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
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
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" step={form.watch('valueType') === 'percentage' ? '0.01' : '1'} {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a value type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (NOK)</SelectItem>
                        <SelectItem value="threshold">Threshold Value</SelectItem>
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
                  <FormLabel className="flex items-center gap-2">
                    Category
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <p>Categories group similar tax fields together, like income taxes or social security contributions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <a 
                      href={guidanceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Learn more about this tax category <ExternalLink className="h-3 w-3" />
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="applicableToResidents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Applicable to Residents</FormLabel>
                      <FormDescription>
                        Tax residents of Norway
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicableToNonResidents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Applicable to Non-Residents</FormLabel>
                      <FormDescription>
                        Non-tax residents of Norway
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="applicableToVesselTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Applicable Vessel Types</FormLabel>
                    <FormDescription>
                      Select which vessel types this tax field applies to
                    </FormDescription>
                  </div>
                  <div className="flex gap-4">
                    {['NOR', 'NIS', 'Other'].map((vesselType) => (
                      <FormField
                        key={vesselType}
                        control={form.control}
                        name="applicableToVesselTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={vesselType}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(vesselType as 'NOR' | 'NIS' | 'Other')}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value];
                                    if (checked) {
                                      if (!currentValue.includes(vesselType as 'NOR' | 'NIS' | 'Other')) {
                                        field.onChange([...currentValue, vesselType as 'NOR' | 'NIS' | 'Other']);
                                      }
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (value) => value !== vesselType
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {vesselType}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this tax field in calculations
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxFieldEditDialog;
