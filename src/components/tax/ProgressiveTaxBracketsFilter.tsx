
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProgressiveTaxBracketsFilterProps {
  filterResidency: 'All' | 'Resident' | 'Non-Resident';
  setFilterResidency: (value: 'All' | 'Resident' | 'Non-Resident') => void;
  // Add vessel type filtering
  filterVesselType?: string | 'All';
  setFilterVesselType?: (value: string | 'All') => void;
  vesselTypes?: string[];
}

const ProgressiveTaxBracketsFilter: React.FC<ProgressiveTaxBracketsFilterProps> = ({
  filterResidency,
  setFilterResidency,
  filterVesselType = 'All',
  setFilterVesselType = () => {},
  vesselTypes = ['NOR', 'NIS', 'Other']
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select 
        value={filterResidency} 
        onValueChange={(value) => setFilterResidency(value as 'All' | 'Resident' | 'Non-Resident')}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Residency Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Residency Types</SelectItem>
          <SelectItem value="Resident">Residents Only</SelectItem>
          <SelectItem value="Non-Resident">Non-Residents Only</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filterVesselType} 
        onValueChange={(value) => setFilterVesselType(value)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
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
  );
};

export default ProgressiveTaxBracketsFilter;
