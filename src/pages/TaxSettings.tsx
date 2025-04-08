
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { ProgressiveTaxBracket, TaxCategory, TaxField } from '@/types/types';
import { mockProgressiveTaxBrackets, mockTaxFields } from '@/data/mockData';
import { Anchor, BarChart3, Edit, Filter, Flag, Info, Plus, Ship, X, Save, FileCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaxFieldEditDialog from '@/components/tax/TaxFieldEditDialog';
import TaxBracketEditDialog from '@/components/tax/TaxBracketEditDialog';
import TaxFieldReference from '@/components/tax/TaxFieldReference';
import { useNavigate } from 'react-router-dom';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    // In a real app, these would be API calls
    setTaxFields(mockTaxFields);
    setProgressiveBrackets(mockProgressiveTaxBrackets);
  }, []);

  // Apply filters and search
  const filteredTaxFields = taxFields.filter(field => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Category filter
    let categoryMatch = filterCategory === 'All' || field.category === filterCategory;
    
    // Residency filter
    let residencyMatch = true;
    if (filterResidency === 'Resident') {
      residencyMatch = field.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      residencyMatch = field.applicableToNonResidents;
    }
    
    // Vessel type filter
    let vesselMatch = true;
    if (filterVesselType !== 'All') {
      vesselMatch = field.applicableToVesselTypes.includes(filterVesselType as 'NOR' | 'NIS' | 'Other');
    }
    
    return searchMatch && categoryMatch && residencyMatch && vesselMatch;
  });

  const uniqueCategories = Array.from(new Set(taxFields.map(field => field.category)));

  // Filter brackets
  const filteredBrackets = progressiveBrackets.filter(bracket => {
    if (filterResidency === 'Resident') {
      return bracket.applicableToResidents;
    } else if (filterResidency === 'Non-Resident') {
      return bracket.applicableToNonResidents;
    }
    return true;
  }).sort((a, b) => a.threshold - b.threshold);

  // Handle tax field toggle
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

  // Edit tax field
  const handleEditTaxField = (field: TaxField) => {
    setSelectedTaxField(field);
    setIsEditingTaxField(true);
  };

  // Save tax field changes
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

  // Add new tax field
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

  // Handle tax bracket related functions
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

  // Save all changes
  const handleSaveAllChanges = () => {
    // In a real app, this would call an API to save all changes to the backend
    setHasUnsavedChanges(false);
    
    toast({
      title: "All Changes Saved",
      description: "Your tax configuration has been updated successfully.",
      variant: "default",
    });
  };

  // Open tax calculator
  const handleOpenTaxCalculator = () => {
    navigate('/payroll');
    toast({
      title: "Redirecting to Tax Calculator",
      description: "Opening the payroll tax calculator.",
    });
  };

  return (
    <div className="space-y-6 fade-in">
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

      <Tabs defaultValue="tax-fields">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="tax-fields">Tax Fields</TabsTrigger>
          <TabsTrigger value="progressive-brackets">Progressive Brackets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-fields" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter Options</CardTitle>
              <CardDescription>
                Filter tax fields by category, residency status, and vessel type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Input 
                      placeholder="Search tax fields..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={filterCategory} onValueChange={value => setFilterCategory(value as TaxCategory | 'All')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      {uniqueCategories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Residency Status</label>
                  <Select value={filterResidency} onValueChange={value => setFilterResidency(value as 'All' | 'Resident' | 'Non-Resident')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by residency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Resident">Resident</SelectItem>
                      <SelectItem value="Non-Resident">Non-Resident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vessel Type</label>
                  <Select value={filterVesselType} onValueChange={value => setFilterVesselType(value as 'All' | 'NOR' | 'NIS' | 'Other')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by vessel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Vessels</SelectItem>
                      <SelectItem value="NOR">NOR Vessels</SelectItem>
                      <SelectItem value="NIS">NIS Vessels</SelectItem>
                      <SelectItem value="Other">Other Vessels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payroll Glossary</CardTitle>
                  <CardDescription>
                    Standard and maritime-specific tax fields for Norwegian payroll
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddTaxField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Applicable To</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTaxFields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                            <div className="text-lg font-medium">No tax fields found</div>
                            <div className="text-sm text-muted-foreground">Try changing your filters or add a new tax field.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTaxFields.map(field => (
                        <ContextMenuTrigger key={field.id} asChild>
                          <TableRow className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-1">
                                {field.name}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs">{field.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{field.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {field.valueType === 'percentage' ? `${field.currentValue}%` : `${field.currentValue.toLocaleString()} NOK`}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {field.applicableToResidents && <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                          <Flag className="h-3 w-3 mr-1" />R
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Applies to Residents</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>}
                                {field.applicableToNonResidents && <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                          <Flag className="h-3 w-3 mr-1" />NR
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Applies to Non-Residents</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>}
                                {field.applicableToVesselTypes.includes('NOR') && <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                          <Ship className="h-3 w-3 mr-1" />NOR
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Applies to NOR Vessels</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>}
                                {field.applicableToVesselTypes.includes('NIS') && <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                                          <Anchor className="h-3 w-3 mr-1" />NIS
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Applies to NIS Vessels</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Switch 
                                checked={field.isActive} 
                                onCheckedChange={(checked) => handleToggleTaxField(field.id, checked)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditTaxField(field)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </ContextMenuTrigger>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progressive-brackets" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Filter Options</CardTitle>
                  <CardDescription>
                    Filter tax brackets by residency status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Residency Status</label>
                  <Select value={filterResidency} onValueChange={value => setFilterResidency(value as 'All' | 'Resident' | 'Non-Resident')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by residency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Resident">Resident</SelectItem>
                      <SelectItem value="Non-Resident">Non-Resident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Progressive Tax Brackets</CardTitle>
                  <CardDescription>
                    Income thresholds and tax rates for the Norwegian step tax (trinnskatt)
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddTaxBracket}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bracket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Threshold (NOK)</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Applicable To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrackets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                            <div className="text-lg font-medium">No tax brackets found</div>
                            <div className="text-sm text-muted-foreground">Try changing your filters or add a new tax bracket.</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBrackets.map(bracket => (
                        <TableRow key={bracket.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {bracket.threshold.toLocaleString()}
                          </TableCell>
                          <TableCell>{bracket.rate}%</TableCell>
                          <TableCell>{bracket.description}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {bracket.applicableToResidents && <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                        <Flag className="h-3 w-3 mr-1" />R
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Applies to Residents</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>}
                              {bracket.applicableToNonResidents && <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                        <Flag className="h-3 w-3 mr-1" />NR
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Applies to Non-Residents</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditTaxBracket(bracket)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tax Field Edit Dialog */}
      <TaxFieldEditDialog 
        isOpen={isEditingTaxField} 
        onClose={() => setIsEditingTaxField(false)} 
        taxField={selectedTaxField}
        onSave={handleSaveTaxField}
        categories={uniqueCategories as TaxCategory[]}
      />

      {/* Tax Bracket Edit Dialog */}
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
