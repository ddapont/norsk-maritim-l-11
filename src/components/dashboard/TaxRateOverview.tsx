
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
import { mockTaxFields } from '@/data/mockSalaryComponents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TaxRateOverview: React.FC = () => {
  const [taxFields, setTaxFields] = useState<TaxField[]>([]);
  const [filteredTaxFields, setFilteredTaxFields] = useState<TaxField[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    const activeTaxFields = mockTaxFields.filter(field => field.isActive);
    setTaxFields(activeTaxFields);
    
    // Initialize filtered fields
    setFilteredTaxFields(activeTaxFields.slice(0, 5));
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

  const handleFilterByCategory = (category: string | null) => {
    setFilterCategory(category);
    
    if (category === null) {
      // Show top 5 when no filter is applied
      setFilteredTaxFields(taxFields.slice(0, 5));
    } else {
      // Show up to 5 items from the filtered category
      const filtered = taxFields.filter(field => field.category === category);
      setFilteredTaxFields(filtered.slice(0, 5));
    }
  };

  const handleViewAllRates = () => {
    navigate('/tax-settings');
    toast({
      title: "Navigating to Tax Settings",
      description: "View and manage all tax rates.",
    });
  };

  const categories = Array.from(new Set(taxFields.map(field => field.category)));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Current Tax Rates</CardTitle>
          <CardDescription>
            Overview of active Norwegian tax rates and maritime allowances
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filterCategory || 'All Categories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleFilterByCategory(null)}>
                All Categories
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => handleFilterByCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              {filteredTaxFields.map((field) => (
                <TableRow key={field.id} className="cursor-pointer hover:bg-muted/50" onClick={handleViewAllRates}>
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{field.name}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="max-w-xs">{field.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
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
        
        <div className="mt-4">
          <Button variant="ghost" className="w-full flex justify-between" onClick={handleViewAllRates}>
            <span>View all tax rates</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxRateOverview;
