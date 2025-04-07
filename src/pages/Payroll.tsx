
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator, Check, ChevronDown, Download, Play, RefreshCw } from 'lucide-react';
import { Employee, PayrollCalculation, TaxField } from '@/types/types';
import { mockEmployees, mockTaxFields } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateBasicIncomeTax,
  calculateNetSalary,
  calculatePensionContribution,
  calculateProgressiveTax,
  calculateSeafarerAllowance,
  calculateSocialSecurity,
  calculateSpecialDeductions,
} from '@/utils/taxCalculations';
import { mockProgressiveTaxBrackets } from '@/data/mockData';

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // In a real app, these would be API calls
    setEmployees(mockEmployees.filter(e => e.status === 'Active'));
    setTaxFields(mockTaxFields);
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(e => e.id === selectedEmployeeId) || null;
      setSelectedEmployee(employee);
      setCalculation(null);
    } else {
      setSelectedEmployee(null);
      setCalculation(null);
    }
  }, [selectedEmployeeId, employees]);

  const handleCalculate = () => {
    if (!selectedEmployee) return;
    
    setIsCalculating(true);

    // Simulate API call delay
    setTimeout(() => {
      const basicTaxRate = taxFields.find(f => f.name === 'Basic Income Tax Rate')?.currentValue || 22;
      const socialSecurityRate = taxFields.find(f => f.name === 'Employee Social Security Rate')?.currentValue || 8.2;
      const employerSocialSecurityRate = taxFields.find(f => f.name === 'Employer Social Security Rate')?.currentValue || 14.1;
      const seafarerAllowanceRate = taxFields.find(f => f.name === 'Seafarer Allowance')?.currentValue || 30;
      const pensionRate = taxFields.find(f => f.name === 'Standard Pension Contribution')?.currentValue || 2;
      
      const specialDeductionFields = taxFields.filter(f => 
        f.category === 'Special Deduction' && f.isActive
      );

      const grossSalary = selectedEmployee.salary;
      const basicIncomeTax = calculateBasicIncomeTax(grossSalary, basicTaxRate);
      const progressiveTax = calculateProgressiveTax(grossSalary, mockProgressiveTaxBrackets);
      const socialSecurityEmployee = calculateSocialSecurity(grossSalary, socialSecurityRate);
      const socialSecurityEmployer = calculateSocialSecurity(grossSalary, employerSocialSecurityRate);
      const seafarerAllowance = calculateSeafarerAllowance(
        grossSalary, 
        seafarerAllowanceRate, 
        selectedEmployee.vesselType
      );
      const specialDeductions = calculateSpecialDeductions(specialDeductionFields);
      const pensionContribution = calculatePensionContribution(grossSalary, pensionRate);
      
      const netSalary = calculateNetSalary(
        grossSalary,
        basicIncomeTax,
        progressiveTax,
        socialSecurityEmployee,
        pensionContribution,
        seafarerAllowance,
        specialDeductions
      );

      setCalculation({
        employeeId: selectedEmployee.id,
        grossSalary,
        basicIncomeTax,
        progressiveTax,
        socialSecurityEmployee,
        socialSecurityEmployer,
        seafarerAllowance,
        specialDeductions,
        pensionContribution,
        netSalary,
        calculationDate: new Date().toISOString().split('T')[0],
      });

      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Payroll Calculator</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Run Batch Payroll
          </Button>
          <Button disabled={!calculation}>
            <Check className="mr-2 h-4 w-4" />
            Save Calculation
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employee Selection</CardTitle>
            <CardDescription>
              Select an employee to calculate their payroll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Employee
                </label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployee && (
                <>
                  <Separator />
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Employee Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd>{selectedEmployee.firstName} {selectedEmployee.lastName}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Position:</dt>
                        <dd>{selectedEmployee.position}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Department:</dt>
                        <dd>{selectedEmployee.department}</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Vessel Type:</dt>
                        <dd>
                          <Badge variant="outline">{selectedEmployee.vesselType}</Badge>
                        </dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Salary:</dt>
                        <dd className="font-medium">{selectedEmployee.salary.toLocaleString()} NOK</dd>
                      </div>
                      <div className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">Tax Card:</dt>
                        <dd>{selectedEmployee.taxCard}</dd>
                      </div>
                    </dl>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCalculate}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculate Payroll
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

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
                      <span>Basic Income Tax (22%)</span>
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
      </div>
    </div>
  );
};

export default Payroll;
