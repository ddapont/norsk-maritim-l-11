
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, Download, FileText, PieChart } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
    {
      title: "Payroll Summary",
      description: "Monthly summary of payroll calculations and taxes",
      icon: FileText,
    },
    {
      title: "Tax Deductions",
      description: "Detailed breakdown of all tax deductions by category",
      icon: BarChart,
    },
    {
      title: "Employee Tax Reports",
      description: "Individual tax reports for all employees",
      icon: FileText,
    },
    {
      title: "Contributions Overview",
      description: "Summary of employer and employee contributions",
      icon: PieChart,
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      <h1 className="font-bold">Reports</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report, index) => (
          <Card key={`${report.title}-${index}`} className="h-full">
            <CardHeader>
              <report.icon className="h-6 w-6 mb-2 text-primary" />
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Custom Report Builder</h2>
        <p className="text-muted-foreground mb-6">
          Build custom reports with specific fields, date ranges, and formats to meet your specific needs.
        </p>
        <div className="text-center">
          <Button>Create Custom Report</Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
