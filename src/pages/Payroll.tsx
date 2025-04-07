
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator, Check, ChevronDown, Download, Eye, Filter, Play, Plus, RefreshCw, Ship } from 'lucide-react';
import { Employee, PayrollCalculation, TaxField } from '@/types/types';
import { mockEmployees, mockPayrollCalculations, mockTaxFields } from '@/data/mockData';
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
  calculateOtherDeductions,
  calculatePensionContribution,
  calculateProgressiveTax,
  calculateSeafarerAllowance,
  calculateSocialSecurity,
  calculateSpecialDeductions,
  calculateUnionFees,
} from '@/utils/taxCalculations';
import { mockProgressiveTaxBrackets } from '@/data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Component for displaying a single calculation result
interface CalculationResultProps {
  calculation: PayrollCalculation;
  employeeName: string;
}

const CalculationResult: React.FC<CalculationResultProps> = ({ calculation, employeeName }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calculation for {employeeName}</CardTitle>
        <CardDescription>
          Performed on {calculation.calculationDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium">Net Salary</h3>
              <span className="text-2xl font-bold">
                {calculation.netSalary.toLocaleString()} NOK
              </span>
            </div>
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
      </CardContent>
    </Card>
  );
};

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [batchCalculations, setBatchCalculations] = useState<(PayrollCalculation & { employeeName: string })[]>([]);
  const [calculationsTab, setCalculationsTab] = useState<'single' | 'batch'>('single');
  const [isBatchCalculating, setIsBatchCalculating] = useState(false);

  useEffect(() => {
    // In a real app, these would be API calls
    setEmployees(mockEmployees.filter(e => e.status === 'Active'));
    setTaxFields(mockTaxFields);

    // Initialize batch calculations with mock data
    const enrichedCalculations = mockPayrollCalculations.map(calc => {
      const employee = mockEmployees.find(e => e.id === calc.employeeId);
      return {
        ...calc,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'
      };
    });
    setBatchCalculations(enrichedCalculations);
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
      const basicTaxRateField = taxFields.find(f => {
        if (selectedEmployee.vesselType === 'NIS' && f.name === 'NIS Special Tax Rate' && f.isActive) {
          return true;
        }
        if (selectedEmployee.residencyStatus === 'Non-Resident' && f.name === 'Non-Resident Tax Rate' && f.isActive) {
          return true;
        }
        return f.name === 'Basic Income Tax Rate' && f.isActive;
      });
      
      const basicTaxRate = basicTaxRateField?.currentValue || 22;
      const socialSecurityRate = taxFields.find(f => f.name === 'Employee Social Security Rate')?.currentValue || 8.2;
      const employerSocialSecurityRate = taxFields.find(f => f.name === 'Employer Social Security Rate')?.currentValue || 14.1;
      const seafarerAllowanceRate = taxFields.find(f => f.name === 'Seafarer Allowance')?.currentValue || 30;
      const pensionRate = taxFields.find(f => f.name === 'Standard Pension Contribution')?.currentValue || 2;
      const unionFeeRate = taxFields.find(f => f.name === 'Union Membership Fee')?.currentValue || 1.5;
      
      const specialDeductionFields = taxFields.filter(f => 
        f.category === 'Special Deduction' && f.isActive
      );

      const grossSalary = selectedEmployee.salary;
      const basicIncomeTax = calculateBasicIncomeTax(grossSalary, basicTaxRate, selectedEmployee);
      const progressiveTax = calculateProgressiveTax(grossSalary, mockProgressiveTaxBrackets, selectedEmployee);
      const socialSecurityEmployee = calculateSocialSecurity(grossSalary, socialSecurityRate, selectedEmployee);
      const socialSecurityEmployer = calculateSocialSecurity(grossSalary, employerSocialSecurityRate, selectedEmployee);
      const seafarerAllowance = calculateSeafarerAllowance(
        grossSalary, 
        seafarerAllowanceRate, 
        selectedEmployee,
        taxFields
      );
      const specialDeductions = calculateSpecialDeductions(specialDeductionFields, selectedEmployee);
      const pensionContribution = calculatePensionContribution(grossSalary, pensionRate, selectedEmployee);
      const unionFees = calculateUnionFees(grossSalary, unionFeeRate, selectedEmployee);
      const otherDeductions = calculateOtherDeductions(grossSalary, taxFields, selectedEmployee);
      
      const netSalary = calculateNetSalary(
        grossSalary,
        basicIncomeTax,
        progressiveTax,
        socialSecurityEmployee,
        pensionContribution,
        seafarerAllowance,
        specialDeductions,
        unionFees,
        otherDeductions
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
        unionFees,
        otherDeductions,
        netSalary,
        calculationDate: new Date().toISOString().split('T')[0],
      });

      setIsCalculating(false);
    }, 800);
  };

  const handleRunBatchCalculation = () => {
    setIsBatchCalculating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would call the API to calculate for all employees
      setIsBatchCalculating(false);
      // Already loaded mock batch calculations in useEffect
    }, 1500);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Payroll Calculator</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCalculationsTab('batch')}>
            <Play className="mr-2 h-4 w-4" />
            Run Batch Payroll
          </Button>
          <Button disabled={!calculation} onClick={() => {
            if (calculation && selectedEmployee) {
              const employeeName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
              setBatchCalculations(prev => [
                { ...calculation, employeeName },
                ...prev.filter(c => c.employeeId !== selectedEmployee.id)
              ]);
            }
          }}>
            <Check className="mr-2 h-4 w-4" />
            Save Calculation
          </Button>
        </div>
      </div>

      <Tabs value={calculationsTab} onValueChange={(v) => setCalculationsTab(v as 'single' | 'batch')}>
        <TabsList className="mb-4">
          <TabsTrigger value="single">
            <Calculator className="mr-2 h-4 w-4" />
            Single Employee
          </TabsTrigger>
          <TabsTrigger value="batch">
            <Ship className="mr-2 h-4 w-4" />
            Batch Payroll
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
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
                            <dt className="text-muted-foreground">Residency:</dt>
                            <dd>
                              <Badge variant="outline" className={selectedEmployee.residencyStatus === 'Resident' ? 
                                'border-green-200 bg-green-50 text-green-700' : 
                                'border-blue-200 bg-blue-50 text-blue-700'}>
                                {selectedEmployee.residencyStatus}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between text-sm">
                            <dt className="text-muted-foreground">Vessel Type:</dt>
                            <dd>
                              <Badge variant="outline" className={
                                selectedEmployee.vesselType === 'NOR' 
                                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                                  : 'border-purple-200 bg-purple-50 text-purple-700'
                              }>
                                {selectedEmployee.vesselType}
                              </Badge>
                            </dd>
                          </div>
                          <div className="flex justify-between text-sm">
                            <dt className="text-muted-foreground">Salary:</dt>
                            <dd className="font-medium">{selectedEmployee.salary.toLocaleString()} NOK</dd>
                          </div>
                          <div className="flex justify-between text-sm">
                            <dt className="text-muted-foreground">Union Member:</dt>
                            <dd>{selectedEmployee.unionMember ? `Yes (${selectedEmployee.unionName})` : 'No'}</dd>
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
          </div>
        </TabsContent>

        <TabsContent value="batch">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Batch Payroll Calculation</CardTitle>
                    <CardDescription>
                      Calculate payroll for all active employees at once
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleRunBatchCalculation}
                    disabled={isBatchCalculating}
                  >
                    {isBatchCalculating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Batch Calculation
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {batchCalculations.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {batchCalculations.slice(0, 2).map((calc) => (
                  <CalculationResult 
                    key={calc.employeeId} 
                    calculation={calc} 
                    employeeName={calc.employeeName} 
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
