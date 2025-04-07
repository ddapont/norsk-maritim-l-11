
import { Employee, ProgressiveTaxBracket, TaxField } from "../types/types";

// Calculate basic income tax
export const calculateBasicIncomeTax = (
  salary: number,
  basicTaxRate: number,
  employee: Employee
): number => {
  // Use NIS special tax rate for NIS vessels if available
  if (employee.vesselType === 'NIS') {
    return salary * (basicTaxRate / 100);
  }
  return salary * (basicTaxRate / 100);
};

// Calculate progressive tax based on brackets
export const calculateProgressiveTax = (
  salary: number,
  brackets: ProgressiveTaxBracket[],
  employee: Employee
): number => {
  // Non-residents don't pay progressive tax in Norway (they pay a flat rate)
  if (employee.residencyStatus === 'Non-Resident') {
    return 0;
  }
  
  let progressiveTax = 0;
  
  // Sort brackets by threshold from lowest to highest
  const sortedBrackets = [...brackets]
    .filter(bracket => bracket.applicableToResidents)
    .sort((a, b) => a.threshold - b.threshold);
  
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
  rate: number,
  employee: Employee
): number => {
  // Non-residents typically don't pay into Norwegian social security
  if (employee.residencyStatus === 'Non-Resident') {
    return 0;
  }
  return salary * (rate / 100);
};

// Calculate seafarer allowance
export const calculateSeafarerAllowance = (
  salary: number,
  allowanceRate: number,
  employee: Employee,
  taxFields: TaxField[]
): number => {
  let effectiveRate = allowanceRate;
  
  // Apply different rates based on vessel type
  if (employee.vesselType === 'NIS') {
    // For NIS vessels, reduce the allowance rate
    effectiveRate = allowanceRate * 0.8;
  } else if (employee.vesselType === 'NOR') {
    // For NOR vessels, check if there's an additional allowance
    const norAdditionalAllowance = taxFields.find(
      f => f.name === 'NOR Vessel Additional Allowance' && 
           f.isActive && 
           f.applicableToVesselTypes.includes('NOR')
    );
    
    if (norAdditionalAllowance) {
      effectiveRate += norAdditionalAllowance.currentValue;
    }
  }
  
  return salary * (effectiveRate / 100);
};

// Calculate special deductions
export const calculateSpecialDeductions = (
  deductionFields: TaxField[],
  employee: Employee
): number => {
  return deductionFields
    .filter(field => 
      field.isActive && 
      (employee.residencyStatus === 'Resident' ? field.applicableToResidents : field.applicableToNonResidents) &&
      field.applicableToVesselTypes.includes(employee.vesselType)
    )
    .reduce((total, field) => {
      if (field.valueType === 'fixed') {
        return total + field.currentValue;
      }
      // Add other types of deduction calculations as needed
      return total;
    }, 0);
};

// Calculate pension contribution
export const calculatePensionContribution = (
  salary: number,
  pensionRate: number,
  employee: Employee
): number => {
  // Non-residents typically don't contribute to Norwegian pension
  if (employee.residencyStatus === 'Non-Resident') {
    return 0;
  }
  return salary * (pensionRate / 100);
};

// Calculate union fees
export const calculateUnionFees = (
  salary: number,
  unionFeeRate: number,
  employee: Employee
): number => {
  if (!employee.unionMember) {
    return 0;
  }
  return salary * (unionFeeRate / 100);
};

// Calculate other deductions (insurance, etc.)
export const calculateOtherDeductions = (
  salary: number,
  taxFields: TaxField[],
  employee: Employee
): number => {
  const otherDeductionFields = taxFields.filter(f => 
    f.isActive && 
    f.category === 'Insurance' &&
    (employee.residencyStatus === 'Resident' ? f.applicableToResidents : f.applicableToNonResidents) &&
    f.applicableToVesselTypes.includes(employee.vesselType)
  );
  
  return otherDeductionFields.reduce((total, field) => {
    if (field.valueType === 'percentage') {
      return total + (salary * (field.currentValue / 100));
    } else if (field.valueType === 'fixed') {
      return total + field.currentValue;
    }
    return total;
  }, 0);
};

// Calculate net salary
export const calculateNetSalary = (
  grossSalary: number,
  basicIncomeTax: number,
  progressiveTax: number,
  socialSecurityEmployee: number,
  pensionContribution: number,
  seafarerAllowance: number,
  specialDeductions: number,
  unionFees: number,
  otherDeductions: number
): number => {
  return (
    grossSalary -
    basicIncomeTax -
    progressiveTax -
    socialSecurityEmployee -
    pensionContribution -
    unionFees -
    otherDeductions +
    seafarerAllowance +
    specialDeductions
  );
};
