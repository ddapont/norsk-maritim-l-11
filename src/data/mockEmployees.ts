
import { Employee } from "../types/types";

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "Erik",
    lastName: "Hansen",
    email: "erik.hansen@normar.no",
    employeeNumber: "EMP-001",
    position: "Captain",
    department: "Operations",
    vesselType: "NOR",
    salary: 850000,
    taxCard: "Standard",
    hireDate: "2018-03-15",
    status: "Active",
    residencyStatus: "Resident",
    unionMember: true,
    unionName: "Norwegian Maritime Officers' Association",
    tags: ["Captain", "Officer"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "2",
    firstName: "Astrid",
    lastName: "Berg",
    email: "astrid.berg@normar.no",
    employeeNumber: "EMP-002",
    position: "Chief Engineer",
    department: "Engineering",
    vesselType: "NOR",
    salary: 780000,
    taxCard: "Standard",
    hireDate: "2019-05-22",
    status: "Active",
    residencyStatus: "Resident",
    unionMember: true,
    unionName: "Norwegian Union of Marine Engineers",
    tags: ["Engineer", "Chief"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "3",
    firstName: "Magnus",
    lastName: "Olsen",
    email: "magnus.olsen@normar.no",
    employeeNumber: "EMP-003",
    position: "First Officer",
    department: "Operations",
    vesselType: "NIS",
    salary: 650000,
    taxCard: "Standard",
    hireDate: "2020-01-10",
    status: "Active",
    residencyStatus: "Resident",
    unionMember: false,
    tags: ["Officer"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "4",
    firstName: "Ingrid",
    lastName: "Larsen",
    email: "ingrid.larsen@normar.no",
    employeeNumber: "EMP-004",
    position: "Second Engineer",
    department: "Engineering",
    vesselType: "NIS",
    salary: 620000,
    taxCard: "Standard",
    hireDate: "2021-06-05",
    status: "Active",
    residencyStatus: "Non-Resident",
    unionMember: false,
    tags: ["Engineer"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "5",
    firstName: "Lars",
    lastName: "Johansen",
    email: "lars.johansen@normar.no",
    employeeNumber: "EMP-005",
    position: "Deck Officer",
    department: "Operations",
    vesselType: "NOR",
    salary: 580000,
    taxCard: "Standard",
    hireDate: "2021-09-12",
    status: "Inactive",
    residencyStatus: "Resident",
    unionMember: true,
    unionName: "Norwegian Seafarers' Union",
    tags: ["Officer", "Deck"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "6",
    firstName: "Sofie",
    lastName: "Nilsen",
    email: "sofie.nilsen@normar.no",
    employeeNumber: "EMP-006",
    position: "Chief Officer",
    department: "Operations",
    vesselType: "NOR",
    salary: 720000,
    taxCard: "Standard",
    hireDate: "2019-11-05",
    status: "Active",
    residencyStatus: "Resident",
    unionMember: true,
    unionName: "Norwegian Maritime Officers' Association",
    tags: ["Officer", "Chief"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
  {
    id: "7",
    firstName: "Johan",
    lastName: "Anderson",
    email: "johan.anderson@normar.no",
    employeeNumber: "EMP-007",
    position: "Third Engineer",
    department: "Engineering",
    vesselType: "NIS",
    salary: 590000,
    taxCard: "Standard",
    hireDate: "2022-02-15",
    status: "Active",
    residencyStatus: "Non-Resident",
    unionMember: false,
    tags: ["Engineer"],
    taxRulePreferences: {
      useDefaultRules: true
    }
  },
];
