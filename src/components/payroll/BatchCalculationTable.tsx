
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Employee, PayrollCalculation } from '@/types/types';

interface BatchCalculationTableProps {
  batchCalculations: (PayrollCalculation & { employeeName: string })[];
  employees: Employee[];
}

const BatchCalculationTable: React.FC<BatchCalculationTableProps> = ({ 
  batchCalculations, 
  employees 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Vessel Type</TableHead>
          <TableHead>Gross Salary</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Calc. Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batchCalculations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No calculations available. Run a batch calculation or save individual calculations.
            </TableCell>
          </TableRow>
        ) : (
          batchCalculations.map((calc) => {
            const employee = employees.find(e => e.id === calc.employeeId);
            return (
              <TableRow key={calc.employeeId}>
                <TableCell className="font-medium">{calc.employeeName}</TableCell>
                <TableCell>
                  {employee && (
                    <Badge variant="outline" className={
                      employee.vesselType === 'NOR' 
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-purple-200 bg-purple-50 text-purple-700'
                    }>
                      {employee.vesselType}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{calc.grossSalary.toLocaleString()} NOK</TableCell>
                <TableCell>{calc.netSalary.toLocaleString()} NOK</TableCell>
                <TableCell>{calc.calculationDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default BatchCalculationTable;
