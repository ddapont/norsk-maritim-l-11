
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { FileDown, HelpCircle, Save, UserCog } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the form schema for company settings
const companyFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  orgNumber: z.string().min(9, {
    message: "Organization number must be 9 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  postalCode: z.string().min(4, {
    message: "Postal code must be at least 4 characters."
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters."
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(8, {
    message: "Phone number must be at least 8 digits.",
  }),
});

// Define the form schema for notification settings
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  payrollReminders: z.boolean().default(true),
  taxDeadlines: z.boolean().default(true),
  systemUpdates: z.boolean().default(false),
  emailRecipients: z.string().optional(),
});

const Settings: React.FC = () => {
  // Initialize form for company settings
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "Ocean Shipping AS",
      orgNumber: "123456789",
      address: "Sjøveien 42",
      postalCode: "5020",
      city: "Bergen",
      country: "Norway",
      email: "admin@oceanshipping.no",
      phone: "47123456",
    },
  });

  // Initialize form for notification settings
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      payrollReminders: true,
      taxDeadlines: true,
      systemUpdates: false,
      emailRecipients: "admin@oceanshipping.no, finance@oceanshipping.no",
    },
  });

  // Form submission handlers
  const onCompanySubmit = (values: z.infer<typeof companyFormSchema>) => {
    console.log(values);
    // In a real application, this would save to the backend
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationFormSchema>) => {
    console.log(values);
    // In a real application, this would save to the backend
  };

  return (
    <div className="space-y-6 fade-in">
      <h1 className="font-bold text-xl">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 bg-card">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Configure your personal preferences for the payroll system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                </div>
                <div>
                  <select className="w-32 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="en">English</option>
                    <option value="no" selected>Norsk</option>
                    <option value="sv">Svenska</option>
                  </select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Date Format</h3>
                  <p className="text-sm text-muted-foreground">Choose how dates are displayed</p>
                </div>
                <div>
                  <select className="w-32 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="dd-mm-yyyy">DD/MM/YYYY</option>
                    <option value="mm-dd-yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd" selected>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Automatic Sign Out</h3>
                  <p className="text-sm text-muted-foreground">Sign out after inactivity</p>
                </div>
                <div>
                  <select className="w-32 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="15">15 minutes</option>
                    <option value="30" selected>30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details used in payroll processing and reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="orgNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={companyForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={companyForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Company Information
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure which notifications you receive and how they are delivered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Email Notifications</FormLabel>
                          <FormDescription>Receive notifications via email</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="payrollReminders"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Payroll Reminders</FormLabel>
                          <FormDescription>Notifications about upcoming payroll processing</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="taxDeadlines"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Tax Deadlines</FormLabel>
                          <FormDescription>Notifications about upcoming tax deadlines</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="systemUpdates"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>System Updates</FormLabel>
                          <FormDescription>Receive notifications about system updates</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={notificationForm.control}
                    name="emailRecipients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Recipients</FormLabel>
                        <FormDescription>Comma-separated list of email addresses</FormDescription>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="email1@company.com, email2@company.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end mt-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Notification Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                View system details and manage data exports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="text-sm font-medium">Version Information</div>
                <div className="text-sm text-muted-foreground">NorskPayroll v1.0.0 (Build 2025.04.07)</div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="text-sm font-medium">License</div>
                <div className="text-sm text-muted-foreground">Enterprise Edition - Licensed to Ocean Shipping AS</div>
                <div className="text-sm text-muted-foreground">Expires: December 31, 2025</div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Data Management</div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Employee Data
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Tax Settings
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Payroll History
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Support</div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="justify-start">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <UserCog className="mr-2 h-4 w-4" />
                    Contact Support
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
