
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getEmployeeStatusBadge = (status: 'Active' | 'Inactive') => {
  return status === 'Active' 
    ? <Badge variant="default">{status}</Badge>
    : <Badge variant="secondary">{status}</Badge>;
};

export const getResidencyBadge = (status: 'Resident' | 'Non-Resident') => {
  return status === 'Resident'
    ? <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">{status}</Badge>
    : <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{status}</Badge>;
};

export const getVesselTypeBadge = (type: 'NOR' | 'NIS' | 'Other') => {
  switch(type) {
    case 'NOR':
      return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{type}</Badge>;
    case 'NIS':
      return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">{type}</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export const getTaxRulesBadge = (useDefaultRules: boolean) => {
  return useDefaultRules
    ? <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">Default</Badge>
    : <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Custom</Badge>;
};
