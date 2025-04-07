
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Calculator,
  FileText,
  Home,
  Settings,
  Users,
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/",
    },
    {
      title: "Employees",
      icon: Users,
      url: "/employees",
    },
    {
      title: "Tax Settings",
      icon: FileText,
      url: "/tax-settings",
    },
    {
      title: "Payroll",
      icon: Calculator,
      url: "/payroll",
    },
    {
      title: "Reports",
      icon: BarChart3,
      url: "/reports",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-norwegian-red rounded-md flex items-center justify-center">
              <div className="h-6 w-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-norwegian-blue font-bold text-sm">NP</span>
              </div>
            </div>
            <div className="font-semibold text-white text-lg">NorskPayroll</div>
          </div>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild active={currentPath === item.url}>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-4 text-xs text-sidebar-foreground/60">
          &copy; 2025 NorskPayroll | v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
