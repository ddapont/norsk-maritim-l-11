
// Employee Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  position: string;
  department: string;
  vesselType: 'NOR' | 'NIS' | 'Other';
  salary: number;
  taxCard: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
}

// Tax Field Types
export interface TaxField {
  id: string;
  name: string;
  description: string;
  defaultValue: number;
  currentValue: number;
  valueType: 'percentage' | 'fixed' | 'threshold';
  category: TaxCategory;
  isActive: boolean;
  lastUpdated: string;
}

export type TaxCategory = 
  | 'Basic Income Tax'
  | 'Progressive Tax'
  | 'Social Security'
  | 'Maritime Allowance'
  | 'Special Deduction'
  | 'Pension'
  | 'Other';

export interface ProgressiveTaxBracket {
  id: string;
  threshold: number;
  rate: number;
  description: string;
}

// Payroll Types
export interface PayrollCalculation {
  employeeId: string;
  grossSalary: number;
  basicIncomeTax: number;
  progressiveTax: number;
  socialSecurityEmployee: number;
  socialSecurityEmployer: number;
  seafarerAllowance: number;
  specialDeductions: number;
  pensionContribution: number;
  netSalary: number;
  calculationDate: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  pendingPayrolls: number;
  completedPayrolls: number;
  lastUpdated: string;
}
