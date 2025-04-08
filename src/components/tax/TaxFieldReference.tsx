
import React from 'react';
import { TaxField } from '@/types/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const taxCategoryDescriptions = {
  'Basic Income Tax': 'Standard income tax applied to all taxpayers in Norway.',
  'Progressive Tax': 'Tax rates that increase as income increases, applied in brackets.',
  'Social Security': 'Contributions to the Norwegian national insurance scheme (trygdeavgift).',
  'Maritime Allowance': 'Special deductions available to seafarers on eligible vessels.',
  'Special Deduction': 'Various deductions specific to certain employment conditions.',
  'Pension': 'Contributions to and deductions for pension schemes.',
  'Union Fee': 'Membership fees for labor unions, which may be tax deductible.',
  'Insurance': 'Mandatory and optional insurance premiums.',
  'Residence Tax': 'Tax considerations based on residence status.',
  'Other': 'Additional tax elements that don\'t fit other categories.',
};

const taxGuidanceUrls = {
  'Basic Income Tax': 'https://www.skatteetaten.no/en/person/taxes/',
  'Progressive Tax': 'https://www.skatteetaten.no/en/rates/tax-rates-2023/',
  'Social Security': 'https://www.skatteetaten.no/en/business-and-organisation/employer/the-a-melding/rates/national-insurance-contributions/',
  'Maritime Allowance': 'https://www.skatteetaten.no/en/business-and-organisation/reporting-and-industries/industries-special-regulations/shipping/tax-arrangements-for-shipping-companies/',
  'Special Deduction': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/pension/deductions/',
  'Pension': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/pension/',
  'Union Fee': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/employment-benefits-and-pensions/membership-fees/',
  'Insurance': 'https://www.skatteetaten.no/en/business-and-organisation/employer/the-a-melding/rates/',
  'Residence Tax': 'https://www.skatteetaten.no/en/person/foreign/are-you-planning-to-work-in-norway/',
  'Other': 'https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/',
};

interface TaxFieldReferenceProps {
  taxFields: TaxField[];
}

const TaxFieldReference: React.FC<TaxFieldReferenceProps> = ({ taxFields }) => {
  // Get unique categories from taxFields
  const categories = Array.from(new Set(taxFields.map(field => field.category)));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Info className="h-4 w-4" />
          Tax Reference Guide
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Norwegian Tax Reference</SheetTitle>
          <SheetDescription>
            Guide to Norwegian tax fields and maritime allowances
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{category}</h3>
                <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                  <a 
                    href={taxGuidanceUrls[category as keyof typeof taxGuidanceUrls] || taxGuidanceUrls['Other']} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Official Guide <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {taxCategoryDescriptions[category as keyof typeof taxCategoryDescriptions] || 'No description available.'}
              </p>
              
              <div className="space-y-2 mt-2">
                {taxFields
                  .filter(field => field.category === category)
                  .map(field => (
                    <Card key={field.id} className="border-l-4" style={{ borderLeftColor: field.isActive ? '#16a34a' : '#94a3b8' }}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            {field.name}
                            {!field.isActive && <Badge variant="outline" className="bg-slate-100 text-slate-700">Inactive</Badge>}
                          </CardTitle>
                          <Badge variant="outline">
                            {field.valueType === 'percentage' 
                              ? `${field.currentValue}%` 
                              : `${field.currentValue.toLocaleString()} NOK`}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">{field.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                }
              </div>
              
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaxFieldReference;
