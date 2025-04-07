
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, RefreshCw } from 'lucide-react';
import { Employee } from '@/types/types';

interface EmployeeSelectionProps {
  employees: Employee[];
  selectedEmployeeId: string;
  selectedEmployee: Employee | null;
  isCalculating: boolean;
  setSelectedEmployeeId: (id: string) => void;
  handleCalculate: () => void;
}

const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  employees,
  selectedEmployeeId,
  selectedEmployee,
  isCalculating,
  setSelectedEmployeeId,
  handleCalculate
}) => {
  return (
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
  );
};

export default EmployeeSelection;
