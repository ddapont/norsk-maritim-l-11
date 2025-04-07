
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employee, PayrollCalculation } from '@/types/types';
import { mockEmployees, mockPayrollCalculations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

const RecentPayrolls: React.FC = () => {
  const [payrolls, setPayrolls] = useState<(PayrollCalculation & { employeeName: string })[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const enrichedPayrolls = mockPayrollCalculations.map(payroll => {
      const employee = mockEmployees.find(emp => emp.id === payroll.employeeId);
      return {
        ...payroll,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'
      };
    });
    
    setPayrolls(enrichedPayrolls);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Recent Payroll Calculations</CardTitle>
          <CardDescription>
            The last payroll calculations for your employees
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.employeeId}>
                  <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                  <TableCell>{payroll.grossSalary.toLocaleString()} NOK</TableCell>
                  <TableCell>{(payroll.basicIncomeTax + payroll.progressiveTax).toLocaleString()} NOK</TableCell>
                  <TableCell>{payroll.netSalary.toLocaleString()} NOK</TableCell>
                  <TableCell className="text-right">{payroll.calculationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPayrolls;
