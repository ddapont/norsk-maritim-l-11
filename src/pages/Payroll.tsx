
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calculator, Check, Play, Ship } from 'lucide-react';
import { Employee, TaxField } from '@/types/types';
import { mockEmployees, mockTaxFields } from '@/data/mockData';
import EmployeeSelection from '@/components/payroll/EmployeeSelection';
import CalculationDetails from '@/components/payroll/CalculationDetails';
import BatchCalculation from '@/components/payroll/BatchCalculation';
import { usePayrollCalculation } from '@/hooks/usePayrollCalculation';
import { useBatchCalculation } from '@/hooks/useBatchCalculation';

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [calculationsTab, setCalculationsTab] = useState<'single' | 'batch'>('single');
  
  // Use custom hooks
  const {
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployee,
    calculation,
    isCalculating,
    handleCalculate
  } = usePayrollCalculation(employees, taxFields);
  
  const {
    batchCalculations,
    isBatchCalculating,
    handleRunBatchCalculation,
    addCalculationToBatch
  } = useBatchCalculation(employees);

  useEffect(() => {
    // In a real app, these would be API calls
    setEmployees(mockEmployees.filter(e => e.status === 'Active'));
    setTaxFields(mockTaxFields);
  }, []);

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
              addCalculationToBatch(calculation, employeeName);
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
            <EmployeeSelection
              employees={employees}
              selectedEmployeeId={selectedEmployeeId}
              selectedEmployee={selectedEmployee}
              isCalculating={isCalculating}
              setSelectedEmployeeId={setSelectedEmployeeId}
              handleCalculate={handleCalculate}
            />
            
            <CalculationDetails
              selectedEmployee={selectedEmployee}
              calculation={calculation}
            />
          </div>
        </TabsContent>

        <TabsContent value="batch">
          <BatchCalculation
            employees={employees}
            batchCalculations={batchCalculations}
            isBatchCalculating={isBatchCalculating}
            handleRunBatchCalculation={handleRunBatchCalculation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;
