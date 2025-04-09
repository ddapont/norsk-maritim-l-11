import { useState, useEffect } from 'react';
import { Employee, PayrollCalculation } from '@/types/types';
import { mockPayrollCalculations } from '@/data/mockPayrollData';

export const useBatchCalculation = (employees: Employee[]) => {
  const [batchCalculations, setBatchCalculations] = useState<(PayrollCalculation & { employeeName: string })[]>([]);
  const [isBatchCalculating, setIsBatchCalculating] = useState(false);

  useEffect(() => {
    // Initialize batch calculations with mock data
    const enrichedCalculations = mockPayrollCalculations.map(calc => {
      const employee = employees.find(e => e.id === calc.employeeId);
      return {
        ...calc,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'
      };
    });
    setBatchCalculations(enrichedCalculations);
  }, [employees]);

  const handleRunBatchCalculation = () => {
    setIsBatchCalculating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would call the API to calculate for all employees
      setIsBatchCalculating(false);
      // Already loaded mock batch calculations in useEffect
    }, 1500);
  };

  const addCalculationToBatch = (calculation: PayrollCalculation, employeeName: string) => {
    setBatchCalculations(prev => [
      { ...calculation, employeeName },
      ...prev.filter(c => c.employeeId !== calculation.employeeId)
    ]);
  };

  return {
    batchCalculations,
    isBatchCalculating,
    handleRunBatchCalculation,
    addCalculationToBatch
  };
};
