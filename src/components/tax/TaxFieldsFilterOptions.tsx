
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaxCategory } from '@/types/types';

interface TaxFieldsFilterOptionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: TaxCategory | 'All';
  setFilterCategory: (value: TaxCategory | 'All') => void;
  filterResidency: 'All' | 'Resident' | 'Non-Resident';
  setFilterResidency: (value: 'All' | 'Resident' | 'Non-Resident') => void;
  filterVesselType: 'All' | 'NOR' | 'NIS' | 'Other';
  setFilterVesselType: (value: 'All' | 'NOR' | 'NIS' | 'Other') => void;
  uniqueCategories: TaxCategory[];
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
  uniqueCategories
}) => {
  return (
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
  );
};

export default TaxFieldsFilterOptions;
