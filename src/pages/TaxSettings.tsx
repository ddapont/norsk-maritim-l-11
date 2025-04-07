
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Edit, Info, Plus, BarChart3 } from 'lucide-react';
import { ProgressiveTaxBracket, TaxField } from '@/types/types';
import { mockProgressiveTaxBrackets, mockTaxFields } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TaxSettings: React.FC = () => {
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [progressiveBrackets, setProgressiveBrackets] = useState<ProgressiveTaxBracket[]>([]);

  useEffect(() => {
    // In a real app, these would be API calls
    setTaxFields(mockTaxFields);
    setProgressiveBrackets(mockProgressiveTaxBrackets);
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Tax Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Tax Calculator
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tax Field
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tax-fields">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="tax-fields">Tax Fields</TabsTrigger>
          <TabsTrigger value="progressive-brackets">Progressive Brackets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-fields" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Norwegian Tax Fields</CardTitle>
              <CardDescription>
                Standard and maritime-specific tax fields for Norwegian payroll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxFields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1">
                            {field.name}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{field.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{field.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {field.valueType === 'percentage'
                            ? `${field.currentValue}%`
                            : `${field.currentValue.toLocaleString()} NOK`}
                        </TableCell>
                        <TableCell className="capitalize">{field.valueType}</TableCell>
                        <TableCell>
                          <Switch checked={field.isActive} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progressive-brackets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Progressive Tax Brackets</CardTitle>
              <CardDescription>
                Income thresholds and tax rates for the Norwegian step tax (trinnskatt)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Threshold (NOK)</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressiveBrackets
                      .sort((a, b) => a.threshold - b.threshold)
                      .map((bracket) => (
                        <TableRow key={bracket.id}>
                          <TableCell className="font-medium">
                            {bracket.threshold.toLocaleString()}
                          </TableCell>
                          <TableCell>{bracket.rate}%</TableCell>
                          <TableCell>{bracket.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxSettings;
