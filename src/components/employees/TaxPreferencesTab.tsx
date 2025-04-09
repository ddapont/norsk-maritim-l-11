
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { TaxField, Employee } from '@/types/types';
import { mockTaxFields } from '@/data/mockData';

const TaxPreferencesTab = () => {
  const form = useFormContext<Employee>();
  
  return (
    <div className="space-y-4">
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
            {mockTaxFields.map((taxField: TaxField) => (
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
    </div>
  );
};

export default TaxPreferencesTab;
