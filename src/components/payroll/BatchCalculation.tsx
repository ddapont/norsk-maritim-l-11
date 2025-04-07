
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import { Employee, PayrollCalculation } from '@/types/types';
import BatchCalculationTable from './BatchCalculationTable';
import CalculationResult from './CalculationResult';

interface BatchCalculationProps {
  employees: Employee[];
  batchCalculations: (PayrollCalculation & { employeeName: string })[];
  isBatchCalculating: boolean;
  handleRunBatchCalculation: () => void;
}

const BatchCalculation: React.FC<BatchCalculationProps> = ({
  employees,
  batchCalculations,
  isBatchCalculating,
  handleRunBatchCalculation
}) => {
  return (
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
          <BatchCalculationTable 
            batchCalculations={batchCalculations} 
            employees={employees} 
          />
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
  );
};

export default BatchCalculation;
