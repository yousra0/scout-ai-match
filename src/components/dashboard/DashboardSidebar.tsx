
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, 
  Calendar, 
  Grid, 
  LifeBuoy, 
  LogOut, 
  MessageSquare, 
  Settings, 
  UserCircle, 
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  badge?: string | number;
}

const NavItem = ({ icon, label, to, isActive, badge }: NavItemProps) => (
  <Link to={to} className="w-full">
    <Button 
      variant="ghost" 
      className={cn(
        "w-full justify-start gap-3", 
        isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:text-primary"
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <Badge variant="default" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Button>
  </Link>
);

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-scout-900">ScoutAI</span>
          </Link>
        </div>

        {/* User profile */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-gray-500">Club Representative</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavItem 
            icon={<Grid size={18} />} 
            label="Dashboard" 
            to="/dashboard" 
            isActive={currentPath === "/dashboard"} 
          />
          <NavItem 
            icon={<Users size={18} />} 
            label="Matches" 
            to="/dashboard/matches" 
            isActive={currentPath === "/dashboard/matches"} 
            badge={5}
          />
          <NavItem 
            icon={<MessageSquare size={18} />} 
            label="Messages" 
            to="/dashboard/messages" 
            isActive={currentPath === "/dashboard/messages"} 
            badge={3}
          />
          <NavItem 
            icon={<Calendar size={18} />} 
            label="Calendar" 
            to="/dashboard/calendar" 
            isActive={currentPath === "/dashboard/calendar"} 
          />
          <NavItem 
            icon={<BarChart2 size={18} />} 
            label="Analytics" 
            to="/dashboard/analytics" 
            isActive={currentPath === "/dashboard/analytics"} 
          />
          <NavItem 
            icon={<UserCircle size={18} />} 
            label="Profile" 
            to="/dashboard/profile" 
            isActive={currentPath === "/dashboard/profile"} 
          />

          <div className="pt-3 mt-3 border-t border-border">
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              to="/dashboard/settings" 
              isActive={currentPath === "/dashboard/settings"} 
            />
            <NavItem 
              icon={<LifeBuoy size={18} />} 
              label="Help & Support" 
              to="/dashboard/support" 
              isActive={currentPath === "/dashboard/support"} 
            />
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-600 hover:text-red-600"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
