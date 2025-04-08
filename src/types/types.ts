// Employee Types
export interface Employee {
  id: string;
  employeeNumber: string; // This becomes our visible ID
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  vesselType: 'NOR' | 'NIS' | 'Other';
  salary: number;
  taxCard: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
  residencyStatus: 'Resident' | 'Non-Resident';
  unionMember: boolean;
  unionName?: string;
  tags: string[]; // New field for additional tags
  taxRulePreferences: {
    useDefaultRules: boolean;
    customRules?: string[]; // IDs of tax fields that apply specifically to this employee
  };
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
  applicableToResidents: boolean;
  applicableToNonResidents: boolean;
  applicableToVesselTypes: ('NOR' | 'NIS' | 'Other')[];
}

export type TaxCategory = 
  | 'Basic Income Tax'
  | 'Progressive Tax'
  | 'Social Security'
  | 'Maritime Allowance'
  | 'Special Deduction'
  | 'Pension'
  | 'Union Fee'
  | 'Insurance'
  | 'Residence Tax'
  | 'Other';

export interface ProgressiveTaxBracket {
  id: string;
  threshold: number;
  rate: number;
  description: string;
  applicableToResidents: boolean;
  applicableToNonResidents: boolean;
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
  unionFees: number;
  otherDeductions: number;
  netSalary: number;
  calculationDate: string;
  employeeName?: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  pendingPayrolls: number;
  completedPayrolls: number;
  lastUpdated: string;
  residentEmployees: number;
  nonResidentEmployees: number;
  norVesselEmployees: number;
  nisVesselEmployees: number;
  otherVesselEmployees: number;
}

export interface PayrollBatchSummary {
  id: string;
  date: string;
  employeeCount: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalTaxes: number;
  status: 'Completed' | 'Processing' | 'Error';
}
