
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TaxField } from '@/types/types';
import { Anchor, Edit, FileCheck, Flag, Info, Plus, Ship, X } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { AlertTriangle } from 'lucide-react';

interface TaxFieldsTableProps {
  filteredTaxFields: TaxField[];
  handleToggleTaxField: (id: string, isActive: boolean) => void;
  handleEditTaxField: (field: TaxField) => void;
  handleAddTaxField: () => void;
  handleContextMenuAction: (field: TaxField, action: string) => void;
}

const TaxFieldsTable: React.FC<TaxFieldsTableProps> = ({
  filteredTaxFields,
  handleToggleTaxField,
  handleEditTaxField,
  handleAddTaxField,
  handleContextMenuAction
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payroll Glossary</CardTitle>
            <CardDescription>
              Standard and maritime-specific tax fields for Norwegian payroll
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddTaxField}>
            <Plus className="mr-2 h-4 w-4" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxFields.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                      <div className="text-lg font-medium">No tax fields found</div>
                      <div className="text-sm text-muted-foreground">Try changing your filters or add a new tax field.</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTaxFields.map(field => (
                  <ContextMenu key={field.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50">
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
                          {field.valueType === 'percentage' ? `${field.currentValue}%` : `${field.currentValue.toLocaleString()} NOK`}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {field.applicableToResidents && 
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
                            {field.applicableToNonResidents && 
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
                            {field.applicableToVesselTypes.includes('NOR') && 
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                      <Ship className="h-3 w-3 mr-1" />NOR
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Applies to NOR Vessels</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            }
                            {field.applicableToVesselTypes.includes('NIS') && 
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                                      <Anchor className="h-3 w-3 mr-1" />NIS
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Applies to NIS Vessels</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch 
                            checked={field.isActive} 
                            onCheckedChange={(checked) => handleToggleTaxField(field.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditTaxField(field)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => handleContextMenuAction(field, 'edit')}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tax Field
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => handleContextMenuAction(field, 'toggle')}>
                        {field.isActive ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Deactivate Field
                          </>
                        ) : (
                          <>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Activate Field
                          </>
                        )}
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxFieldsTable;
