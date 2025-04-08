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
import { Anchor, BarChart3, Edit, Filter, Flag, Info, Plus, Ship } from 'lucide-react';
const TaxSettings: React.FC = () => {
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [progressiveBrackets, setProgressiveBrackets] = useState<ProgressiveTaxBracket[]>([]);
  const [filterCategory, setFilterCategory] = useState<TaxCategory | 'All'>('All');
  const [filterResidency, setFilterResidency] = useState<'All' | 'Resident' | 'Non-Resident'>('All');
  const [filterVesselType, setFilterVesselType] = useState<'All' | 'NOR' | 'NIS' | 'Other'>('All');
  useEffect(() => {
    // In a real app, these would be API calls
    setTaxFields(mockTaxFields);
    setProgressiveBrackets(mockProgressiveTaxBrackets);
  }, []);
  const filteredTaxFields = taxFields.filter(field => {
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
    return categoryMatch && residencyMatch && vesselMatch;
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
  return <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Tax Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Tax Calculator
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tax Field
          </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardTitle>Payroll Glossary</CardTitle>
              <CardDescription>
                Standard and maritime-specific tax fields for Norwegian payroll
              </CardDescription>
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
                    {filteredTaxFields.map(field => <TableRow key={field.id}>
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
                          <Switch checked={field.isActive} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
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
              <CardTitle>Progressive Tax Brackets</CardTitle>
              <CardDescription>
                Income thresholds and tax rates for the Norwegian step tax (trinnskatt)
              </CardDescription>
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
                    {filteredBrackets.map(bracket => <TableRow key={bracket.id}>
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
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default TaxSettings;