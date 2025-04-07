
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { TaxField } from '@/types/types';
import { mockTaxFields } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

const TaxRateOverview: React.FC = () => {
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setTaxFields(mockTaxFields);
  }, []);

  const getBadgeVariant = (category: string): "default" | "secondary" | "outline" => {
    switch (category) {
      case 'Basic Income Tax':
        return 'default';
      case 'Social Security':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Current Tax Rates</CardTitle>
        <CardDescription>
          Overview of active Norwegian tax rates and maritime allowances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rate/Value</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(field.category)}>
                      {field.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {field.valueType === 'percentage'
                      ? `${field.currentValue}%`
                      : `${field.currentValue.toLocaleString()} NOK`}
                  </TableCell>
                  <TableCell className="text-right">{field.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxRateOverview;
