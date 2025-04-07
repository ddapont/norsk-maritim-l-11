
import { Employee, ProgressiveTaxBracket, TaxField } from "../types/types";

// Calculate basic income tax
export const calculateBasicIncomeTax = (
  salary: number,
  basicTaxRate: number
): number => {
  return salary * (basicTaxRate / 100);
};

// Calculate progressive tax based on brackets
export const calculateProgressiveTax = (
  salary: number,
  brackets: ProgressiveTaxBracket[]
): number => {
  let progressiveTax = 0;
  let remainingSalary = salary;
  
  // Sort brackets by threshold from lowest to highest
  const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold);
  
  for (let i = 0; i < sortedBrackets.length; i++) {
    const currentBracket = sortedBrackets[i];
    const nextBracket = sortedBrackets[i + 1];
    
    if (salary > currentBracket.threshold) {
      // Calculate taxable amount in this bracket
      const taxableInBracket = nextBracket 
        ? Math.min(nextBracket.threshold, salary) - currentBracket.threshold
        : salary - currentBracket.threshold;
      
      progressiveTax += taxableInBracket * (currentBracket.rate / 100);
    }
  }
  
  return progressiveTax;
};

// Calculate social security contribution (employee part)
export const calculateSocialSecurity = (
  salary: number,
  rate: number
): number => {
  return salary * (rate / 100);
};

// Calculate seafarer allowance
export const calculateSeafarerAllowance = (
  salary: number,
  allowanceRate: number,
  vesselType: Employee['vesselType']
): number => {
  // Apply different rates or caps based on vessel type
  let effectiveRate = allowanceRate;
  
  if (vesselType === 'NIS') {
    // For NIS vessels, reduce the allowance rate (example rule)
    effectiveRate = allowanceRate * 0.8;
  }
  
  return salary * (effectiveRate / 100);
};

// Calculate special deductions
export const calculateSpecialDeductions = (
  deductionFields: TaxField[]
): number => {
  return deductionFields.reduce((total, field) => {
    if (field.isActive) {
      if (field.valueType === 'fixed') {
        return total + field.currentValue;
      }
      // Add other types of deduction calculations as needed
    }
    return total;
  }, 0);
};

// Calculate pension contribution
export const calculatePensionContribution = (
  salary: number,
  pensionRate: number
): number => {
  return salary * (pensionRate / 100);
};

// Calculate net salary
export const calculateNetSalary = (
  grossSalary: number,
  basicIncomeTax: number,
  progressiveTax: number,
  socialSecurityEmployee: number,
  pensionContribution: number,
  seafarerAllowance: number,
  specialDeductions: number
): number => {
  return (
    grossSalary -
    basicIncomeTax -
    progressiveTax -
    socialSecurityEmployee -
    pensionContribution +
    seafarerAllowance +
    specialDeductions
  );
};
