
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgressiveTaxBracketsFilterProps {
  filterResidency: 'All' | 'Resident' | 'Non-Resident';
  setFilterResidency: (value: 'All' | 'Resident' | 'Non-Resident') => void;
}

const ProgressiveTaxBracketsFilter: React.FC<ProgressiveTaxBracketsFilterProps> = ({
  filterResidency,
  setFilterResidency
}) => {
  return (
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
  );
};

export default ProgressiveTaxBracketsFilter;
