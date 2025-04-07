
import React, { useEffect, useState } from 'react';
import { Users, Calculator, Clock, CalendarRange, Ship, Flag, PieChart, AreaChart } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import TaxRateOverview from '@/components/dashboard/TaxRateOverview';
import RecentPayrolls from '@/components/dashboard/RecentPayrolls';
import { DashboardSummary, PayrollBatchSummary } from '@/types/types';
import { mockDashboardSummary, mockPayrollBatches } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import EmployeeDistributionChart from '@/components/dashboard/EmployeeDistributionChart';
import PayrollBatchHistory from '@/components/dashboard/PayrollBatchHistory';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [payrollBatches, setPayrollBatches] = useState<PayrollBatchSummary[]>([]);

  useEffect(() => {
    // In a real app, these would be API calls
    setSummary(mockDashboardSummary);
    setPayrollBatches(mockPayrollBatches);
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <h1 className="font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            Select Period
          </Button>
          <Button size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>
      
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
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
            <CardDescription>
              Overview of employee distributions by residency and vessel type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="residency">
              <TabsList className="mb-4">
                <TabsTrigger value="residency">
                  <Flag className="mr-2 h-4 w-4" />
                  Residency
                </TabsTrigger>
                <TabsTrigger value="vessel">
                  <Ship className="mr-2 h-4 w-4" />
                  Vessel Type
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="residency">
                <EmployeeDistributionChart 
                  data={[
                    { name: 'Resident', value: summary.residentEmployees, color: '#10B981' },
                    { name: 'Non-Resident', value: summary.nonResidentEmployees, color: '#3B82F6' },
                  ]}
                />
              </TabsContent>
              
              <TabsContent value="vessel">
                <EmployeeDistributionChart 
                  data={[
                    { name: 'NOR', value: summary.norVesselEmployees, color: '#F59E0B' },
                    { name: 'NIS', value: summary.nisVesselEmployees, color: '#8B5CF6' },
                    { name: 'Other', value: summary.otherVesselEmployees, color: '#6B7280' },
                  ]}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <TaxRateOverview />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PayrollBatchHistory payrollBatches={payrollBatches} />
        <RecentPayrolls />
      </div>
    </div>
  );
};

export default Dashboard;
