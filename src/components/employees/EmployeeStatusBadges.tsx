
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Get badge for employee status
export const getEmployeeStatusBadge = (status: 'Active' | 'Inactive') => {
  if (status === 'Active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
};

// Get badge for residency status - updated to accept any string
export const getResidencyBadge = (residencyStatus: string) => {
  if (residencyStatus === 'Resident') {
    return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Resident</Badge>;
  } else if (residencyStatus === 'Non-Resident') {
    return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Non-Resident</Badge>;
  }
  // Handle any other residency status
  return <Badge variant="outline">{residencyStatus}</Badge>;
};

// Get badge for vessel type - updated to accept any string
export const getVesselTypeBadge = (vesselType: string) => {
  if (vesselType === 'NOR') {
    return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">NOR</Badge>;
  } else if (vesselType === 'NIS') {
    return <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">NIS</Badge>;
  } else if (vesselType === 'Other') {
    return <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">Other</Badge>;
  }
  // Handle any other vessel type
  return <Badge variant="outline">{vesselType}</Badge>;
};

// Get badge for tax rule preference
export const getTaxRulesBadge = (useDefaultRules?: boolean) => {
  if (useDefaultRules) {
    return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Default Rules</Badge>;
  }
  return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Custom Rules</Badge>;
};

export default { getEmployeeStatusBadge, getResidencyBadge, getVesselTypeBadge, getTaxRulesBadge };
