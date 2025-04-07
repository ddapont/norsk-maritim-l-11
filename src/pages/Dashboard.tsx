
import React, { useEffect, useState } from 'react';
import { Users, Calculator, Clock, CalendarRange } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import TaxRateOverview from '@/components/dashboard/TaxRateOverview';
import RecentPayrolls from '@/components/dashboard/RecentPayrolls';
import { DashboardSummary } from '@/types/types';
import { mockDashboardSummary } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setSummary(mockDashboardSummary);
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <h1 className="font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Employees" 
          value={summary.totalEmployees} 
          icon={Users}
          description={`${summary.activeEmployees} active employees`}
        />
        <DashboardCard 
          title="Pending Payrolls" 
          value={summary.pendingPayrolls} 
          icon={Clock}
          description="Awaiting processing"
        />
        <DashboardCard 
          title="Completed Payrolls" 
          value={summary.completedPayrolls} 
          icon={Calculator}
          description="This year"
        />
        <DashboardCard 
          title="Last Updated" 
          value={summary.lastUpdated} 
          icon={CalendarRange}
          description="Tax rates and calculations"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <TaxRateOverview />
        <RecentPayrolls />
      </div>
    </div>
  );
};

export default Dashboard;
