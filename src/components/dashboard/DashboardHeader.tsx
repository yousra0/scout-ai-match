
import { useState } from 'react';
import { Bell, Mail, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const DashboardHeader = ({ onMenuClick, isSidebarOpen }: DashboardHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-white flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMenuClick} 
          className="mr-2 md:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>

        <div className="hidden md:block flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search players, clubs, agents..." 
              className="pl-9 bg-gray-50 border-gray-200" 
            />
          </div>
        </div>

        {/* Mobile search toggle */}
        <div className="md:hidden mr-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search size={20} />
          </Button>
        </div>

        <div className="flex items-center ml-auto space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            aria-label="Messages"
          >
            <Mail size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <div className="border-l border-border pl-3 ml-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Mobile search input (conditionally rendered) */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-white border-b border-border z-10 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search players, clubs, agents..." 
              className="pl-9 bg-gray-50 border-gray-200" 
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
