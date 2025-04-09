
import { PayrollCalculation, PayrollBatchSummary } from "../types/types";

// Mock Payroll Calculations
export const mockPayrollCalculations: PayrollCalculation[] = [
  {
    employeeId: "1",
    grossSalary: 850000,
    componentBreakdown: {
      "basicIncomeTax": 187000,
      "progressiveTax": 62260,
      "socialSecurityEmployee": 69700,
      "pensionContribution": 17000,
      "unionFees": 12750,
      "otherDeductions": 6800,
      "seafarerAllowance": 255000,
      "specialDeductions": 8000
    },
    basicIncomeTax: 187000,
    progressiveTax: 62260,
    socialSecurityEmployee: 69700,
    socialSecurityEmployer: 119850,
    seafarerAllowance: 255000,
    specialDeductions: 8000,
    pensionContribution: 17000,
    unionFees: 12750,
    otherDeductions: 6800,
    netSalary: 757490,
    calculationDate: "2023-03-15",
  },
  {
    employeeId: "2",
    grossSalary: 780000,
    componentBreakdown: {
      "basicIncomeTax": 171600,
      "progressiveTax": 48280,
      "socialSecurityEmployee": 63960,
      "pensionContribution": 15600,
      "unionFees": 11700,
      "otherDeductions": 6240,
      "seafarerAllowance": 234000,
      "specialDeductions": 8000
    },
    basicIncomeTax: 171600,
    progressiveTax: 48280,
    socialSecurityEmployee: 63960,
    socialSecurityEmployer: 109980,
    seafarerAllowance: 234000,
    specialDeductions: 8000,
    pensionContribution: 15600,
    unionFees: 11700,
    otherDeductions: 6240,
    netSalary: 704620,
    calculationDate: "2023-03-15",
  },
  {
    employeeId: "3",
    grossSalary: 650000,
    componentBreakdown: {
      "basicIncomeTax": 143000,
      "progressiveTax": 27580,
      "socialSecurityEmployee": 53300,
      "pensionContribution": 13000,
      "unionFees": 0,
      "otherDeductions": 5200,
      "seafarerAllowance": 156000,
      "specialDeductions": 8000,
      "socialSecurityEmployer": 91650
    },
    basicIncomeTax: 143000,
    progressiveTax: 27580,
    socialSecurityEmployee: 53300,
    socialSecurityEmployer: 91650,
    seafarerAllowance: 156000,
    specialDeductions: 8000,
    pensionContribution: 13000,
    unionFees: 0,
    otherDeductions: 5200,
    netSalary: 571920,
    calculationDate: "2023-03-15",
  },
  {
    employeeId: "4",
    grossSalary: 620000,
    componentBreakdown: {
      "basicIncomeTax": 93000,
      "progressiveTax": 0,
      "socialSecurityEmployee": 0,
      "socialSecurityEmployer": 87420,
      "seafarerAllowance": 148800,
      "specialDeductions": 8000,
      "pensionContribution": 0,
      "unionFees": 0,
      "otherDeductions": 4960
    },
    basicIncomeTax: 93000, // Using non-resident tax rate
    progressiveTax: 0, // Non-residents don't pay progressive tax
    socialSecurityEmployee: 0, // Non-residents don't pay into social security
    socialSecurityEmployer: 87420,
    seafarerAllowance: 148800,
    specialDeductions: 8000,
    pensionContribution: 0, // Non-residents don't contribute to Norwegian pension
    unionFees: 0,
    otherDeductions: 4960,
    netSalary: 678840,
    calculationDate: "2023-03-15",
  },
  {
    employeeId: "6",
    grossSalary: 720000,
    componentBreakdown: {
      "basicIncomeTax": 158400,
      "progressiveTax": 41060,
      "socialSecurityEmployee": 59040,
      "socialSecurityEmployer": 101520,
      "seafarerAllowance": 252000,
      "specialDeductions": 8000,
      "pensionContribution": 14400,
      "unionFees": 10800,
      "otherDeductions": 5760
    },
    basicIncomeTax: 158400,
    progressiveTax: 41060,
    socialSecurityEmployee: 59040,
    socialSecurityEmployer: 101520,
    seafarerAllowance: 252000, // Includes NOR vessel additional allowance
    specialDeductions: 8000,
    pensionContribution: 14400,
    unionFees: 10800,
    otherDeductions: 5760,
    netSalary: 690540,
    calculationDate: "2023-03-15",
  },
  {
    employeeId: "7",
    grossSalary: 590000,
    componentBreakdown: {
      "basicIncomeTax": 88500,
      "progressiveTax": 0,
      "socialSecurityEmployee": 0,
      "socialSecurityEmployer": 83190,
      "seafarerAllowance": 141600,
      "specialDeductions": 8000,
      "pensionContribution": 0,
      "unionFees": 0,
      "otherDeductions": 4720
    },
    basicIncomeTax: 88500, // Using non-resident tax rate
    progressiveTax: 0, // Non-residents don't pay progressive tax
    socialSecurityEmployee: 0, // Non-residents don't pay into social security
    socialSecurityEmployer: 83190,
    seafarerAllowance: 141600,
    specialDeductions: 8000,
    pensionContribution: 0, // Non-residents don't contribute to Norwegian pension
    unionFees: 0,
    otherDeductions: 4720,
    netSalary: 646380,
    calculationDate: "2023-03-15",
  },
];

// Mock Payroll Batch Summaries
export const mockPayrollBatches: PayrollBatchSummary[] = [
  {
    id: "1",
    date: "2023-03-15",
    employeeCount: 6,
    totalGrossSalary: 4210000,
    totalNetSalary: 4049790,
    totalTaxes: 999670,
    status: "Completed",
  },
  {
    id: "2",
    date: "2023-02-15",
    employeeCount: 5,
    totalGrossSalary: 3420000,
    totalNetSalary: 3289320,
    totalTaxes: 820800,
    status: "Completed",
  },
  {
    id: "3",
    date: "2023-01-15",
    employeeCount: 5,
    totalGrossSalary: 3420000,
    totalNetSalary: 3289320,
    totalTaxes: 820800,
    status: "Completed",
  }
];
