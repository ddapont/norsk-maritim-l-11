
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressiveTaxBracket, TaxCategory, TaxField } from '@/types/types';
import { mockProgressiveTaxBrackets, mockTaxFields } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import TaxFieldEditDialog from '@/components/tax/TaxFieldEditDialog';
import TaxBracketEditDialog from '@/components/tax/TaxBracketEditDialog';
import { useNavigate } from 'react-router-dom';
import TaxFieldsFilterOptions from '@/components/tax/TaxFieldsFilterOptions';
import TaxFieldsTable from '@/components/tax/TaxFieldsTable';
import ProgressiveTaxBracketsFilter from '@/components/tax/ProgressiveTaxBracketsFilter';
import ProgressiveTaxBracketsTable from '@/components/tax/ProgressiveTaxBracketsTable';
import TaxSettingsHeader from '@/components/tax/TaxSettingsHeader';

const TaxSettings: React.FC = () => {
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [progressiveBrackets, setProgressiveBrackets] = useState<ProgressiveTaxBracket[]>([]);
  const [filterCategory, setFilterCategory] = useState<TaxCategory | 'All'>('All');
  const [filterResidency, setFilterResidency] = useState<'All' | 'Resident' | 'Non-Resident'>('All');
  const [filterVesselType, setFilterVesselType] = useState<'All' | 'NOR' | 'NIS' | 'Other'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaxField, setSelectedTaxField] = useState<TaxField | null>(null);
  const [selectedTaxBracket, setSelectedTaxBracket] = useState<ProgressiveTaxBracket | null>(null);
  const [isEditingTaxField, setIsEditingTaxField] = useState(false);
  const [isEditingTaxBracket, setIsEditingTaxBracket] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setTaxFields(mockTaxFields);
    setProgressiveBrackets(mockProgressiveTaxBrackets);
  }, []);

  const filteredTaxFields = taxFields.filter(field => {
    const searchMatch = searchTerm === '' || 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    let categoryMatch = filterCategory === 'All' || field.category === filterCategory;
    
    let residencyMatch = true;
    if (filterResidency === 'Resident') {
      residencyMatch = field.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      residencyMatch = field.applicableToNonResidents;
    }
    
    let vesselMatch = true;
    if (filterVesselType !== 'All') {
      vesselMatch = field.applicableToVesselTypes.includes(filterVesselType as 'NOR' | 'NIS' | 'Other');
    }
    
    return searchMatch && categoryMatch && residencyMatch && vesselMatch;
  });

  const uniqueCategories = Array.from(new Set(taxFields.map(field => field.category)));

  const filteredBrackets = progressiveBrackets.filter(bracket => {
    if (filterResidency === 'Resident') {
      return bracket.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      return bracket.applicableToNonResidents;
    }
    return true;
  }).sort((a, b) => a.threshold - b.threshold);

  const handleToggleTaxField = (id: string, isActive: boolean) => {
    const updatedFields = taxFields.map(field => 
      field.id === id ? { ...field, isActive, lastUpdated: new Date().toISOString().split('T')[0] } : field
    );
    setTaxFields(updatedFields);
    setHasUnsavedChanges(true);
    
    toast({
      title: isActive ? "Tax Field Activated" : "Tax Field Deactivated",
      description: `The tax field status has been updated.`,
      variant: isActive ? "default" : "destructive",
    });
  };

  const handleEditTaxField = (field: TaxField) => {
    setSelectedTaxField(field);
    setIsEditingTaxField(true);
  };

  const handleSaveTaxField = (updatedField: TaxField) => {
    const updatedFields = taxFields.map(field => 
      field.id === updatedField.id ? updatedField : field
    );
    setTaxFields(updatedFields);
    setHasUnsavedChanges(true);
    
    toast({
      title: "Tax Field Updated",
      description: `The changes to ${updatedField.name} have been saved.`,
    });
  };

  const handleAddTaxField = () => {
    const newField: TaxField = {
      id: `tf-${Date.now()}`,
      name: "New Tax Field",
      description: "Description of the new tax field",
      defaultValue: 0,
      currentValue: 0,
      valueType: 'percentage',
      category: 'Basic Income Tax',
      isActive: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      applicableToResidents: true,
      applicableToNonResidents: false,
      applicableToVesselTypes: ['NOR'],
    };
    
    setSelectedTaxField(newField);
    setIsEditingTaxField(true);
  };

  const handleEditTaxBracket = (bracket: ProgressiveTaxBracket) => {
    setSelectedTaxBracket(bracket);
    setIsEditingTaxBracket(true);
  };

  const handleSaveTaxBracket = (updatedBracket: ProgressiveTaxBracket) => {
    const updatedBrackets = progressiveBrackets.map(bracket => 
      bracket.id === updatedBracket.id ? updatedBracket : bracket
    );
    setProgressiveBrackets(updatedBrackets);
    setHasUnsavedChanges(true);
    
    toast({
      title: "Tax Bracket Updated",
      description: `The changes to the tax bracket have been saved.`,
    });
  };

  const handleAddTaxBracket = () => {
    const newBracket: ProgressiveTaxBracket = {
      id: `tb-${Date.now()}`,
      threshold: 0,
      rate: 0,
      description: "New tax bracket",
      applicableToResidents: true,
      applicableToNonResidents: false,
    };
    
    setSelectedTaxBracket(newBracket);
    setIsEditingTaxBracket(true);
  };

  const handleContextMenuAction = (field: TaxField, action: string) => {
    if (action === 'edit') {
      handleEditTaxField(field);
    } else if (action === 'toggle') {
      handleToggleTaxField(field.id, !field.isActive);
    }
  };

  const handleSaveAllChanges = () => {
    setHasUnsavedChanges(false);
    
    toast({
      title: "All Changes Saved",
      description: "Your tax configuration has been updated successfully.",
      variant: "default",
    });
  };

  const handleOpenTaxCalculator = () => {
    navigate('/payroll');
    toast({
      title: "Redirecting to Tax Calculator",
      description: "Opening the payroll tax calculator.",
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <TaxSettingsHeader 
        hasUnsavedChanges={hasUnsavedChanges}
        handleSaveAllChanges={handleSaveAllChanges}
        handleOpenTaxCalculator={handleOpenTaxCalculator}
        handleAddTaxField={handleAddTaxField}
        handleAddTaxBracket={handleAddTaxBracket}
        taxFields={taxFields}
      />

      <Tabs defaultValue="tax-fields">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="tax-fields">Tax Fields</TabsTrigger>
          <TabsTrigger value="progressive-brackets">Progressive Brackets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-fields" className="mt-4 space-y-4">
          <TaxFieldsFilterOptions 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterResidency={filterResidency}
            setFilterResidency={setFilterResidency}
            filterVesselType={filterVesselType}
            setFilterVesselType={setFilterVesselType}
            uniqueCategories={uniqueCategories as TaxCategory[]}
          />
          
          <TaxFieldsTable 
            filteredTaxFields={filteredTaxFields}
            handleToggleTaxField={handleToggleTaxField}
            handleEditTaxField={handleEditTaxField}
            handleAddTaxField={handleAddTaxField}
            handleContextMenuAction={handleContextMenuAction}
          />
        </TabsContent>
        
        <TabsContent value="progressive-brackets" className="mt-4 space-y-4">
          <ProgressiveTaxBracketsFilter 
            filterResidency={filterResidency}
            setFilterResidency={setFilterResidency}
          />
          
          <ProgressiveTaxBracketsTable 
            filteredBrackets={filteredBrackets}
            handleEditTaxBracket={handleEditTaxBracket}
            handleAddTaxBracket={handleAddTaxBracket}
          />
        </TabsContent>
      </Tabs>

      <TaxFieldEditDialog 
        isOpen={isEditingTaxField} 
        onClose={() => setIsEditingTaxField(false)} 
        taxField={selectedTaxField}
        onSave={handleSaveTaxField}
        categories={uniqueCategories as TaxCategory[]}
      />

      <TaxBracketEditDialog
        isOpen={isEditingTaxBracket}
        onClose={() => setIsEditingTaxBracket(false)}
        taxBracket={selectedTaxBracket}
        onSave={handleSaveTaxBracket}
      />
    </div>
  );
};

export default TaxSettings;
