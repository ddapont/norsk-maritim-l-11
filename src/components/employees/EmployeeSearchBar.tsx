
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileDown, Plus } from 'lucide-react';

interface EmployeeSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleAddEmployee: () => void;
  exportEmployees: () => void;
}

const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleAddEmployee,
  exportEmployees
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <h1 className="font-bold">Employees</h1>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 md:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search employees..."
            className="pl-8 h-9 w-full md:w-auto rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={exportEmployees}>
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" onClick={handleAddEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSearchBar;
