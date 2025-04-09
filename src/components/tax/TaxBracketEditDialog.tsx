
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
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressiveTaxBracket, CustomCategory } from '@/types/types';

interface TaxBracketEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taxBracket: ProgressiveTaxBracket | null;
  onSave: (taxBracket: ProgressiveTaxBracket) => void;
  customCategories?: CustomCategory[];
}

const TaxBracketEditDialog: React.FC<TaxBracketEditDialogProps> = ({
  isOpen,
  onClose,
  taxBracket,
  onSave,
  customCategories = []
}) => {
  const form = useForm<ProgressiveTaxBracket>({
    defaultValues: taxBracket || {
      id: '',
      threshold: 0,
      rate: 0,
      description: '',
      applicableToResidents: true,
      applicableToNonResidents: false,
      applicableToVesselTypes: ['NOR', 'NIS', 'Other'],
      applicableToCountries: [],
    }
  });

  useEffect(() => {
    if (taxBracket) {
      form.reset(taxBracket);
    }
  }, [taxBracket, form]);

  const handleSubmit = (formData: ProgressiveTaxBracket) => {
    onSave(formData);
    onClose();
  };

  // Get vessel types from custom categories
  const vesselTypeCategory = customCategories.find(cat => cat.type === 'vesselType');
  const countryCategory = customCategories.find(cat => cat.type === 'country');

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

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{taxBracket ? 'Edit Tax Bracket' : 'Create New Tax Bracket'}</DialogTitle>
          <DialogDescription>
            Progressive tax brackets apply at different income thresholds
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income Threshold (NOK)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Apply when income exceeds this amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentage applied to income above threshold
                    </FormDescription>
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
                      placeholder="e.g. Top bracket for high income earners" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Applicability</FormLabel>
              
              <div className="space-y-4 border rounded-md p-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Apply to Residency Status:</h4>
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
                  <h4 className="text-sm font-medium">Apply to Vessel Types:</h4>
                  <div className="grid grid-cols-2 gap-2">
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
                    <h4 className="text-sm font-medium">Apply to Countries:</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
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
                {taxBracket ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxBracketEditDialog;
