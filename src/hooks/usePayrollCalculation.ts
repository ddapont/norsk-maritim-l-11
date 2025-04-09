
import { useState, useEffect } from 'react';
import { Employee, PayrollCalculation, SalaryComponent } from '@/types/types';
import { mockProgressiveTaxBrackets } from '@/data/mockData';
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

export const usePayrollCalculation = (
  employees: Employee[],
  taxFields: SalaryComponent[]
) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

      // Create component breakdown for the new PayrollCalculation type
      const componentBreakdown: Record<string, number> = {
        "basicIncomeTax": basicIncomeTax,
        "progressiveTax": progressiveTax,
        "socialSecurityEmployee": socialSecurityEmployee,
        "socialSecurityEmployer": socialSecurityEmployer,
        "seafarerAllowance": seafarerAllowance,
        "specialDeductions": specialDeductions,
        "pensionContribution": pensionContribution,
        "unionFees": unionFees,
        "otherDeductions": otherDeductions
      };

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
        componentBreakdown,
        calculationDate: new Date().toISOString().split('T')[0],
      });

      setIsCalculating(false);
    }, 800);
  };

  return {
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployee,
    calculation,
    isCalculating,
    handleCalculate
  };
};
