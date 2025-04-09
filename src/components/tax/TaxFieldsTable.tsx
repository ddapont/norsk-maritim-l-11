
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SalaryComponent } from '@/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaxFieldsTableProps {
  filteredTaxFields: SalaryComponent[];
  handleToggleTaxField: (id: string, isActive: boolean) => void;
  handleEditTaxField: (field: SalaryComponent) => void;
  handleAddTaxField: () => void;
  handleContextMenuAction: (field: SalaryComponent, action: string) => void;
  enhancedFields?: boolean;
}

const TaxFieldsTable: React.FC<TaxFieldsTableProps> = ({
  filteredTaxFields,
  handleToggleTaxField,
  handleEditTaxField,
  handleAddTaxField,
  handleContextMenuAction,
  enhancedFields = false
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Basic Income Tax':
        return <Badge variant="default">{category}</Badge>;
      case 'Social Security':
        return <Badge variant="secondary">{category}</Badge>;
      case 'Special Deduction':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">{category}</Badge>;
      case 'Maritime Allowance':
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{category}</Badge>;
      case 'Progressive Tax':
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{category}</Badge>;
      case 'Union Fee':
        return <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">{category}</Badge>;
      case 'Employer Contribution':
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{category}</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getComponentTypeBadge = (type: string) => {
    switch (type) {
      case 'tax':
        return <Badge variant="destructive" className="text-xs">Tax</Badge>;
      case 'deduction':
        return <Badge variant="secondary" className="text-xs">Deduction</Badge>;
      case 'contribution':
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-xs">Contribution</Badge>;
      case 'allowance':
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-xs">Allowance</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Custom</Badge>;
    }
  };

  const getOperationBadge = (operation: string) => {
    switch (operation) {
      case 'add':
        return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 text-xs">+ Add</Badge>;
      case 'subtract':
        return <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 text-xs">- Subtract</Badge>;
      case 'multiply':
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-xs">× Multiply</Badge>;
      case 'divide':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-xs">÷ Divide</Badge>;
      case 'override':
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 text-xs">Replace</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{operation}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            {enhancedFields && <TableHead>Type/Operation</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Applicability</TableHead>
            <TableHead className="text-right">Active</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTaxFields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={enhancedFields ? 7 : 6} className="h-24 text-center">
                No tax fields found. 
                <Button variant="link" className="p-0 h-8 ml-2" onClick={handleAddTaxField}>
                  Add a new one
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            filteredTaxFields.map((field) => (
              <TableRow 
                key={field.id} 
                className={cn(
                  "group cursor-pointer hover:bg-muted/50",
                  !field.isActive && "opacity-60"
                )}
                onClick={() => handleEditTaxField(field)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{field.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                      {field.description}
                    </span>
                  </div>
                </TableCell>

                {enhancedFields && (
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getComponentTypeBadge(field.componentType)}
                      {getOperationBadge(field.operation)}
                    </div>
                  </TableCell>
                )}

                <TableCell>
                  {getCategoryBadge(field.category)}
                </TableCell>

                <TableCell>
                  {field.valueType === 'percentage'
                    ? `${field.currentValue}%`
                    : field.valueType === 'fixed'
                      ? `${field.currentValue.toLocaleString()} NOK`
                      : `${field.currentValue.toLocaleString()} (Threshold)`}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex gap-1 items-center text-xs">
                      <span className="text-muted-foreground">Residency:</span>
                      <span>
                        {field.applicableToResidents && field.applicableToNonResidents ? 'All' :
                         field.applicableToResidents ? 'Residents Only' :
                         field.applicableToNonResidents ? 'Non-Residents Only' : 'None'}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center text-xs">
                      <span className="text-muted-foreground">Vessels:</span>
                      <span className="truncate max-w-[150px]">
                        {field.applicableToVesselTypes.length === 0 ? 'None' :
                         field.applicableToVesselTypes.join(', ')}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Switch
                    checked={field.isActive}
                    onCheckedChange={(checked) => {
                      handleToggleTaxField(field.id, checked);
                      // Prevent the row click from triggering
                      event?.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleContextMenuAction(field, 'edit')}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleContextMenuAction(field, 'toggle')}>
                        {field.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="flex p-4 border-t">
        <Button onClick={handleAddTaxField} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Component
        </Button>
      </div>
    </div>
  );
};

export default TaxFieldsTable;
