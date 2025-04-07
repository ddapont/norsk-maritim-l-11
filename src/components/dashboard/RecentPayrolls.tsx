
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Employee, PayrollCalculation } from '@/types/types';
import { mockEmployees, mockPayrollCalculations } from '@/data/mockData';
import { Download, Eye, FileDown } from 'lucide-react';

const RecentPayrolls: React.FC = () => {
  const [payrolls, setPayrolls] = useState<(PayrollCalculation & { employeeName: string; vesselType: string })[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    const enrichedPayrolls = mockPayrollCalculations.map(payroll => {
      const employee = mockEmployees.find(emp => emp.id === payroll.employeeId);
      return {
        ...payroll,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee',
        vesselType: employee?.vesselType || 'Unknown'
      };
    });
    
    setPayrolls(enrichedPayrolls);
  }, []);

  const getVesselTypeBadge = (vesselType: string) => {
    switch (vesselType) {
      case 'NOR':
        return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">NOR</Badge>;
      case 'NIS':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">NIS</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

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
                <TableHead>Vessel</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.employeeId}>
                  <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                  <TableCell>{getVesselTypeBadge(payroll.vesselType)}</TableCell>
                  <TableCell>{payroll.grossSalary.toLocaleString()} NOK</TableCell>
                  <TableCell>{payroll.netSalary.toLocaleString()} NOK</TableCell>
                  <TableCell>{payroll.calculationDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
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
