
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, ChevronDown, Download } from 'lucide-react';
import { Employee, PayrollCalculation } from '@/types/types';

interface CalculationDetailsProps {
  selectedEmployee: Employee | null;
  calculation: PayrollCalculation | null;
}

const CalculationDetails: React.FC<CalculationDetailsProps> = ({ 
  selectedEmployee, 
  calculation 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Results</CardTitle>
        <CardDescription>
          Detailed breakdown of the payroll calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedEmployee ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Select an employee to calculate payroll</p>
          </div>
        ) : !calculation ? (
          <div className="text-center py-8 text-muted-foreground">
            <ChevronDown className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>Click "Calculate Payroll" to see results</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium">Net Salary</h3>
                <span className="text-2xl font-bold">
                  {calculation.netSalary.toLocaleString()} NOK
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Calculation performed on {calculation.calculationDate}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Earnings & Deductions</h3>
              <div className="space-y-2 rounded-lg border p-3">
                <div className="flex justify-between text-sm">
                  <span>Gross Salary</span>
                  <span className="font-medium">+ {calculation.grossSalary.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Basic Income Tax</span>
                  <span className="font-medium text-red-500">- {calculation.basicIncomeTax.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progressive Tax (Trinnskatt)</span>
                  <span className="font-medium text-red-500">- {calculation.progressiveTax.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Social Security (Employee)</span>
                  <span className="font-medium text-red-500">- {calculation.socialSecurityEmployee.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pension Contribution</span>
                  <span className="font-medium text-red-500">- {calculation.pensionContribution.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Union Fees</span>
                  <span className="font-medium text-red-500">- {calculation.unionFees.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other Deductions</span>
                  <span className="font-medium text-red-500">- {calculation.otherDeductions.toLocaleString()} NOK</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-sm">
                  <span>Seafarer Allowance</span>
                  <span className="font-medium text-green-600">+ {calculation.seafarerAllowance.toLocaleString()} NOK</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Special Deductions</span>
                  <span className="font-medium text-green-600">+ {calculation.specialDeductions.toLocaleString()} NOK</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Employer Contributions</h3>
              <div className="space-y-2 rounded-lg border p-3">
                <div className="flex justify-between text-sm">
                  <span>Social Security (Employer)</span>
                  <span className="font-medium">{calculation.socialSecurityEmployer.toLocaleString()} NOK</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationDetails;
