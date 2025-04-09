
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ComponentType } from '@/types/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface TaxFieldsFilterOptionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string | 'All';
  setFilterCategory: (value: string | 'All') => void;
  filterResidency: 'All' | 'Resident' | 'Non-Resident';
  setFilterResidency: (value: 'All' | 'Resident' | 'Non-Resident') => void;
  filterVesselType: string | 'All';
  setFilterVesselType: (value: string | 'All') => void;
  uniqueCategories: string[];
  // New props for component type filtering
  filterComponentType?: ComponentType | 'All';
  setFilterComponentType?: (value: ComponentType | 'All') => void;
  // Custom vessel types
  vesselTypes?: string[];
}

const TaxFieldsFilterOptions: React.FC<TaxFieldsFilterOptionsProps> = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterResidency,
  setFilterResidency,
  filterVesselType,
  setFilterVesselType,
  uniqueCategories,
  filterComponentType = 'All',
  setFilterComponentType = () => {},
  vesselTypes = ['NOR', 'NIS', 'Other']
}) => {
  const activeFiltersCount = [
    filterCategory !== 'All',
    filterResidency !== 'All',
    filterVesselType !== 'All',
    filterComponentType !== 'All'
  ].filter(Boolean).length;

  const componentTypes = [
    { label: 'All Types', value: 'All' },
    { label: 'Taxes', value: 'tax' },
    { label: 'Deductions', value: 'deduction' },
    { label: 'Contributions', value: 'contribution' },
    { label: 'Allowances', value: 'allowance' },
    { label: 'Custom', value: 'custom' }
  ];

  const resetFilters = () => {
    setFilterCategory('All');
    setFilterResidency('All');
    setFilterVesselType('All');
    setFilterComponentType('All');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or description"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select
        value={filterComponentType}
        onValueChange={(value) => setFilterComponentType(value as ComponentType | 'All')}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Component Type" />
        </SelectTrigger>
        <SelectContent>
          {componentTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4 space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select 
              value={filterCategory} 
              onValueChange={(value) => setFilterCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Residency</Label>
            <Select 
              value={filterResidency} 
              onValueChange={(value) => setFilterResidency(value as 'All' | 'Resident' | 'Non-Resident')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Residency Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Residency Types</SelectItem>
                <SelectItem value="Resident">Residents Only</SelectItem>
                <SelectItem value="Non-Resident">Non-Residents Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Vessel Type</Label>
            <Select 
              value={filterVesselType} 
              onValueChange={(value) => setFilterVesselType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Vessel Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Vessel Types</SelectItem>
                {vesselTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaxFieldsFilterOptions;
