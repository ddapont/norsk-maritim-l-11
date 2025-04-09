
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TaxFieldReference from '@/components/tax/TaxFieldReference';
import { TaxField } from '@/types/types';

interface TaxSettingsHeaderProps {
  hasUnsavedChanges: boolean;
  handleSaveAllChanges: () => void;
  handleOpenTaxCalculator: () => void;
  handleAddTaxField: () => void;
  handleAddTaxBracket: () => void;
  taxFields: TaxField[];
}

const TaxSettingsHeader: React.FC<TaxSettingsHeaderProps> = ({
  hasUnsavedChanges,
  handleSaveAllChanges,
  handleOpenTaxCalculator,
  handleAddTaxField,
  handleAddTaxBracket,
  taxFields
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <h1 className="font-bold">Tax Settings</h1>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {hasUnsavedChanges && (
          <Button variant="outline" onClick={handleSaveAllChanges} className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
        
        <TaxFieldReference taxFields={taxFields} />
        
        <Button variant="outline" onClick={handleOpenTaxCalculator}>
          <BarChart3 className="mr-2 h-4 w-4" />
          Tax Calculator
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tax Field
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="flex flex-col">
              <Button variant="ghost" className="justify-start rounded-none h-10" onClick={handleAddTaxField}>
                Add Tax Field
              </Button>
              <Button variant="ghost" className="justify-start rounded-none h-10" onClick={handleAddTaxBracket}>
                Add Tax Bracket
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TaxSettingsHeader;
