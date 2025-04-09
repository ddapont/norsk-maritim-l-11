
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProgressiveTaxBracket } from '@/types/types';
import { Edit, Flag, Plus, AlertTriangle } from 'lucide-react';

interface ProgressiveTaxBracketsTableProps {
  filteredBrackets: ProgressiveTaxBracket[];
  handleEditTaxBracket: (bracket: ProgressiveTaxBracket) => void;
  handleAddTaxBracket: () => void;
}

const ProgressiveTaxBracketsTable: React.FC<ProgressiveTaxBracketsTableProps> = ({
  filteredBrackets,
  handleEditTaxBracket,
  handleAddTaxBracket
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Progressive Tax Brackets</CardTitle>
            <CardDescription>
              Income thresholds and tax rates for the Norwegian step tax (trinnskatt)
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddTaxBracket}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bracket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threshold (NOK)</TableHead>
                <TableHead>Rate (%)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrackets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                      <div className="text-lg font-medium">No tax brackets found</div>
                      <div className="text-sm text-muted-foreground">Try changing your filters or add a new tax bracket.</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrackets.map(bracket => (
                  <TableRow key={bracket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {bracket.threshold.toLocaleString()}
                    </TableCell>
                    <TableCell>{bracket.rate}%</TableCell>
                    <TableCell>{bracket.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {bracket.applicableToResidents && 
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                  <Flag className="h-3 w-3 mr-1" />R
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Applies to Residents</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        }
                        {bracket.applicableToNonResidents && 
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                                  <Flag className="h-3 w-3 mr-1" />NR
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Applies to Non-Residents</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditTaxBracket(bracket)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressiveTaxBracketsTable;
