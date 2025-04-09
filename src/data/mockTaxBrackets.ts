
import { ProgressiveTaxBracket } from "../types/types";

// Mock Progressive Tax Brackets
export const mockProgressiveTaxBrackets: ProgressiveTaxBracket[] = [
  {
    id: "1",
    threshold: 190350,
    rate: 1.7,
    description: "Step 1 bracket (190,350 - 267,899 NOK)",
    applicableToResidents: true,
    applicableToNonResidents: false,
  },
  {
    id: "2",
    threshold: 267900,
    rate: 4.0,
    description: "Step 2 bracket (267,900 - 643,799 NOK)",
    applicableToResidents: true,
    applicableToNonResidents: false,
  },
  {
    id: "3",
    threshold: 643800,
    rate: 13.4,
    description: "Step 3 bracket (643,800 - 969,199 NOK)",
    applicableToResidents: true,
    applicableToNonResidents: false,
  },
  {
    id: "4",
    threshold: 969200,
    rate: 16.4,
    description: "Step 4 bracket (969,200 - 2,000,000 NOK)",
    applicableToResidents: true,
    applicableToNonResidents: false,
  },
  {
    id: "5",
    threshold: 2000000,
    rate: 17.4,
    description: "Step 5 bracket (Above 2,000,000 NOK)",
    applicableToResidents: true,
    applicableToNonResidents: false,
  },
  {
    id: "6",
    threshold: 0,
    rate: 25.0,
    description: "Non-resident flat rate",
    applicableToResidents: false,
    applicableToNonResidents: true,
  },
];
