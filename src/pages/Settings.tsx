
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CloudUpload, RefreshCw, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Preferences</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-update" className="font-medium">Auto-update tax fields</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically update tax fields when regulatory changes occur
                      </p>
                    </div>
                    <Switch id="auto-update" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="audit-logging" className="font-medium">Enhanced audit logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Keep detailed logs of all tax field changes and calculations
                      </p>
                    </div>
                    <Switch id="audit-logging" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="tax-preview" className="font-medium">Real-time tax preview</Label>
                      <p className="text-sm text-muted-foreground">
                        Show live tax calculation preview when making changes
                      </p>
                    </div>
                    <Switch id="tax-preview" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="tax-updates" className="font-medium">Tax regulation updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about tax regulation changes
                      </p>
                    </div>
                    <Switch id="tax-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payroll-reminders" className="font-medium">Payroll processing reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders for upcoming payroll processing deadlines
                      </p>
                    </div>
                    <Switch id="payroll-reminders" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure integrations with external systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">HR System Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect to your existing HR system to import employee data
                      </p>
                    </div>
                    <Switch id="hr-integration" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hr-api-key">API Key</Label>
                      <input 
                        id="hr-api-key" 
                        type="password" 
                        placeholder="Enter API key" 
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hr-api-url">API URL</Label>
                      <input 
                        id="hr-api-url" 
                        type="text" 
                        placeholder="https://api.hrsystem.com" 
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Test Connection</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Tax Authority Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect to Norwegian tax authority system for automated reporting
                      </p>
                    </div>
                    <Switch id="tax-integration" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-certificate">Digital Certificate</Label>
                      <div className="flex gap-2">
                        <input 
                          id="tax-certificate" 
                          type="text" 
                          placeholder="No certificate uploaded" 
                          className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                          readOnly
                        />
                        <Button variant="outline" size="sm">
                          <CloudUpload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-org-number">Organization Number</Label>
                      <input 
                        id="tax-org-number" 
                        type="text" 
                        placeholder="Enter organization number" 
                        className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Verify Credentials</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import-export" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export</CardTitle>
              <CardDescription>
                Import and export data to and from the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-4">Import Data</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data Type</Label>
                      <select className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background">
                        <option>Employee Data</option>
                        <option>Tax Settings</option>
                        <option>Pay Rates</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>File Format</Label>
                      <select className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background">
                        <option>CSV</option>
                        <option>XML</option>
                        <option>JSON</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>File Upload</Label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="No file selected" 
                          className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background"
                          readOnly
                        />
                        <Button variant="outline" size="sm">Browse</Button>
                      </div>
                    </div>
                    <Button className="w-full">Import Data</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-4">Export Data</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data Type</Label>
                      <select className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background">
                        <option>All Employee Data</option>
                        <option>Tax Settings</option>
                        <option>Payroll Reports</option>
                        <option>Tax Calculations</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>File Format</Label>
                      <select className="w-full rounded-md border border-input px-3 py-2 text-sm bg-background">
                        <option>CSV</option>
                        <option>XML</option>
                        <option>JSON</option>
                        <option>PDF</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date" 
                          className="rounded-md border border-input px-3 py-2 text-sm bg-background"
                        />
                        <input 
                          type="date" 
                          className="rounded-md border border-input px-3 py-2 text-sm bg-background"
                        />
                      </div>
                    </div>
                    <Button className="w-full">Export Data</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-medium mb-2">Data Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download templates for importing data into the system
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Employee Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Tax Settings Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Allowances Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
