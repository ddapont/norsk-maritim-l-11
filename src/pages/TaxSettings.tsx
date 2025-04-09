
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SalaryComponent, 
  ProgressiveTaxBracket, 
  CustomCategory,
  ComponentType,
  OperationType,
  DefaultCategories
} from '@/types/types';
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
import CustomCategoriesManager from '@/components/tax/CustomCategoriesManager';

const TaxSettings: React.FC = () => {
  // Changed from taxFields to salaryComponents
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [progressiveBrackets, setProgressiveBrackets] = useState<ProgressiveTaxBracket[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  
  // Filter state
  const [filterCategory, setFilterCategory] = useState<string | 'All'>('All');
  const [filterResidency, setFilterResidency] = useState<'All' | 'Resident' | 'Non-Resident'>('All');
  const [filterVesselType, setFilterVesselType] = useState<string | 'All'>('All');
  const [filterComponentType, setFilterComponentType] = useState<ComponentType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit state
  const [selectedComponent, setSelectedComponent] = useState<SalaryComponent | null>(null);
  const [selectedTaxBracket, setSelectedTaxBracket] = useState<ProgressiveTaxBracket | null>(null);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [isEditingTaxBracket, setIsEditingTaxBracket] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize from mock data
    // Convert old tax fields to the new salary component format
    const convertedComponents = mockTaxFields.map(field => ({
      ...field,
      componentType: 'tax' as ComponentType,
      operation: 'subtract' as OperationType,
      operatesOn: ['grossSalary'],
      applicableToCountries: []
    }));
    
    setSalaryComponents(convertedComponents);
    setProgressiveBrackets(mockProgressiveTaxBrackets);
    
    // Initialize with some example custom categories
    setCustomCategories([
      {
        id: 'cat-1',
        name: 'Ship Registers',
        description: 'Types of ship registers',
        isActive: true,
        lastUpdated: '2025-04-09',
        type: 'vesselType',
        values: ['NOR', 'NIS', 'Other', 'FOC']
      },
      {
        id: 'cat-2',
        name: 'Countries',
        description: 'List of countries',
        isActive: true,
        lastUpdated: '2025-04-09',
        type: 'country',
        values: ['Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland']
      }
    ]);
  }, []);

  const filteredComponents = salaryComponents.filter(component => {
    const searchMatch = searchTerm === '' || 
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const categoryMatch = filterCategory === 'All' || component.category === filterCategory;
    
    const componentTypeMatch = filterComponentType === 'All' || component.componentType === filterComponentType;
    
    let residencyMatch = true;
    if (filterResidency === 'Resident') {
      residencyMatch = component.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      residencyMatch = component.applicableToNonResidents;
    }
    
    let vesselMatch = true;
    if (filterVesselType !== 'All') {
      vesselMatch = component.applicableToVesselTypes.includes(filterVesselType);
    }
    
    return searchMatch && categoryMatch && residencyMatch && vesselMatch && componentTypeMatch;
  });

  // Get all unique categories from components and custom categories
  const getAllCategories = () => {
    const componentCategories = Array.from(new Set(salaryComponents.map(comp => comp.category)));
    const taxCategories = customCategories
      .filter(cat => cat.type === 'tax' && cat.isActive)
      .flatMap(cat => cat.values);
    
    // Combine all categories and ensure DefaultCategories are included
    return Array.from(new Set([...DefaultCategories, ...componentCategories, ...taxCategories]));
  };

  const filteredBrackets = progressiveBrackets.filter(bracket => {
    if (filterResidency === 'Resident') {
      return bracket.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      return bracket.applicableToNonResidents;
    }
    
    if (filterVesselType !== 'All' && bracket.applicableToVesselTypes) {
      return bracket.applicableToVesselTypes.includes(filterVesselType);
    }
    
    return true;
  }).sort((a, b) => a.threshold - b.threshold);

  const handleToggleComponent = (id: string, isActive: boolean) => {
    const updatedComponents = salaryComponents.map(component => 
      component.id === id ? { ...component, isActive, lastUpdated: new Date().toISOString().split('T')[0] } : component
    );
    setSalaryComponents(updatedComponents);
    setHasUnsavedChanges(true);
    
    toast({
      title: isActive ? "Component Activated" : "Component Deactivated",
      description: `The component status has been updated.`,
      variant: isActive ? "default" : "destructive",
    });
  };

  const handleEditComponent = (component: SalaryComponent) => {
    setSelectedComponent(component);
    setIsEditingComponent(true);
  };

  const handleSaveComponent = (updatedComponent: SalaryComponent) => {
    const exists = salaryComponents.some(comp => comp.id === updatedComponent.id);
    
    if (exists) {
      // Update existing component
      const updatedComponents = salaryComponents.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      );
      setSalaryComponents(updatedComponents);
      
      toast({
        title: "Component Updated",
        description: `The changes to ${updatedComponent.name} have been saved.`,
      });
    } else {
      // Add new component
      setSalaryComponents([...salaryComponents, updatedComponent]);
      
      toast({
        title: "Component Created",
        description: `New component "${updatedComponent.name}" has been created.`,
      });
    }
    
    setHasUnsavedChanges(true);
    setIsEditingComponent(false);
  };

  const handleAddComponent = () => {
    const newComponent: SalaryComponent = {
      id: `comp-${Date.now()}`,
      name: "New Salary Component",
      description: "Description of the new component",
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
      applicableToNonResidents: false,
      applicableToVesselTypes: ['NOR'],
      applicableToCountries: [],
    };
    
    setSelectedComponent(newComponent);
    setIsEditingComponent(true);
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

  const handleContextMenuAction = (component: SalaryComponent, action: string) => {
    if (action === 'edit') {
      handleEditComponent(component);
    } else if (action === 'toggle') {
      handleToggleComponent(component.id, !component.isActive);
    }
  };

  const handleSaveCategory = (category: CustomCategory) => {
    const exists = customCategories.some(cat => cat.id === category.id);
    
    if (exists) {
      // Update existing category
      const updatedCategories = customCategories.map(cat => 
        cat.id === category.id ? category : cat
      );
      setCustomCategories(updatedCategories);
    } else {
      // Add new category
      setCustomCategories([...customCategories, category]);
    }
    
    setHasUnsavedChanges(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
    setHasUnsavedChanges(true);
  };

  const handleSaveAllChanges = () => {
    setHasUnsavedChanges(false);
    
    toast({
      title: "All Changes Saved",
      description: "Your salary component configuration has been updated successfully.",
      variant: "default",
    });
  };

  const handleOpenTaxCalculator = () => {
    navigate('/payroll');
    toast({
      title: "Redirecting to Payroll Calculator",
      description: "Opening the payroll calculator.",
    });
  };

  return (
    <div className="space-y-6 fade-in">
      <TaxSettingsHeader 
        hasUnsavedChanges={hasUnsavedChanges}
        handleSaveAllChanges={handleSaveAllChanges}
        handleOpenTaxCalculator={handleOpenTaxCalculator}
        handleAddTaxField={handleAddComponent}
        handleAddTaxBracket={handleAddTaxBracket}
        taxFields={salaryComponents}
      />

      <Tabs defaultValue="salary-components">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="salary-components">Salary Components</TabsTrigger>
          <TabsTrigger value="progressive-brackets">Progressive Tax</TabsTrigger>
          <TabsTrigger value="custom-categories">Custom Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salary-components" className="mt-4 space-y-4">
          <TaxFieldsFilterOptions 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterResidency={filterResidency}
            setFilterResidency={setFilterResidency}
            filterVesselType={filterVesselType}
            setFilterVesselType={setFilterVesselType}
            // Pass the unique categories
            uniqueCategories={getAllCategories()}
            // Add new filter for component type
            filterComponentType={filterComponentType}
            setFilterComponentType={setFilterComponentType}
            // Pass the custom vessel types
            vesselTypes={customCategories.find(cat => cat.type === 'vesselType')?.values || ['NOR', 'NIS', 'Other']}
          />
          
          <TaxFieldsTable 
            filteredTaxFields={filteredComponents}
            handleToggleTaxField={handleToggleComponent}
            handleEditTaxField={handleEditComponent}
            handleAddTaxField={handleAddComponent}
            handleContextMenuAction={handleContextMenuAction}
            // Pass enhancedFields flag to show component type and operation
            enhancedFields={true}
          />
        </TabsContent>
        
        <TabsContent value="progressive-brackets" className="mt-4 space-y-4">
          <ProgressiveTaxBracketsFilter 
            filterResidency={filterResidency}
            setFilterResidency={setFilterResidency}
            // Add vessel type filter for brackets
            filterVesselType={filterVesselType}
            setFilterVesselType={setFilterVesselType}
            // Pass the custom vessel types
            vesselTypes={customCategories.find(cat => cat.type === 'vesselType')?.values || ['NOR', 'NIS', 'Other']}
          />
          
          <ProgressiveTaxBracketsTable 
            filteredBrackets={filteredBrackets}
            handleEditTaxBracket={handleEditTaxBracket}
            handleAddTaxBracket={handleAddTaxBracket}
          />
        </TabsContent>

        <TabsContent value="custom-categories" className="mt-4 space-y-4">
          <CustomCategoriesManager 
            categories={customCategories}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>

      <TaxFieldEditDialog 
        isOpen={isEditingComponent} 
        onClose={() => setIsEditingComponent(false)} 
        salaryComponent={selectedComponent}
        onSave={handleSaveComponent}
        categories={getAllCategories()}
        components={salaryComponents}
        customCategories={customCategories}
      />

      <TaxBracketEditDialog
        isOpen={isEditingTaxBracket}
        onClose={() => setIsEditingTaxBracket(false)}
        taxBracket={selectedTaxBracket}
        onSave={handleSaveTaxBracket}
        // Pass custom categories to the brackets dialog
        customCategories={customCategories}
      />
    </div>
  );
};

export default TaxSettings;
