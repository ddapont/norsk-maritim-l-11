// Employee Types
export interface Employee {
  id: string;
  employeeNumber: string; // This becomes our visible ID
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  vesselType: string; // Changed from enum to string for more flexibility
  salary: number;
  taxCard: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
  residencyStatus: string; // Changed from enum to string for more flexibility
  unionMember: boolean;
  unionName?: string;
  tags: string[]; // New field for additional tags
  taxRulePreferences: {
    useDefaultRules: boolean;
    customRules?: string[]; // IDs of tax fields that apply specifically to this employee
  };
  customAttributes?: Record<string, string>; // Add support for custom attributes
}

// Renamed from TaxField to SalaryComponent for more generic use
export interface SalaryComponent {
  id: string;
  name: string;
  description: string;
  defaultValue: number;
  currentValue: number;
  valueType: 'percentage' | 'fixed' | 'threshold';
  category: string; // Changed from enum to string for custom categories
  componentType: ComponentType; // Added to identify the type of component
  operation: OperationType; // Added to specify how this component affects salary
  operatesOn: string[]; // IDs of other components or special values like 'grossSalary'
  isActive: boolean;
  lastUpdated: string;
  applicableToResidents: boolean;
  applicableToNonResidents: boolean;
  applicableToVesselTypes: string[]; // Changed from enum to string array
  applicableToCountries?: string[]; // New field for country-specific components
  customConditions?: Record<string, any>; // For future custom conditions
}

// Basic predefined categories for backward compatibility
export const DefaultCategories = [
  'Basic Income Tax',
  'Progressive Tax',
  'Social Security',
  'Maritime Allowance',
  'Special Deduction',
  'Pension',
  'Union Fee',
  'Insurance',
  'Residence Tax',
  'Employer Contribution',
  'Employee Contribution',
  'Special Allowance',
  'Other'
] as const;

// Operation types
export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide' | 'override' | 'condition';

// Component types
export type ComponentType = 'deduction' | 'contribution' | 'allowance' | 'tax' | 'custom';

// Custom category type
export interface CustomCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  lastUpdated: string;
  type: 'vesselType' | 'country' | 'residencyStatus' | 'tax' | 'custom';
  values: string[]; // Available values for this category
}

export interface ProgressiveTaxBracket {
  id: string;
  threshold: number;
  rate: number;
  description: string;
  applicableToResidents: boolean;
  applicableToNonResidents: boolean;
  applicableToVesselTypes?: string[]; // Made optional and more generic
  applicableToCountries?: string[]; // Added country support
}

// Payroll Types
export interface PayrollCalculation {
  employeeId: string;
  grossSalary: number;
  componentBreakdown: Record<string, number>; // Itemized breakdown of all components
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
  // Additional breakdown fields can be computed dynamically based on categories
  employeeBreakdowns: Record<string, Record<string, number>>; // Category -> Value -> Count
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

// For backward compatibility, keep TaxCategory and TaxField aliases
export type TaxCategory = string;

// Type alias for backward compatibility
export type TaxField = SalaryComponent;
