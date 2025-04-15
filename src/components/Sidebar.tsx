// src/components/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { 
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
  collapsed?: boolean;
  activeRoute?: string;
  onNavigate?: (route: string) => void;
}

const Sidebar = ({ onCollapse, collapsed: externalCollapsed, activeRoute, onNavigate }: SidebarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        onCollapse?.(true);
        setInternalCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [onCollapse]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    if (externalCollapsed === undefined) {
      setInternalCollapsed(newState);
    }
    onCollapse?.(newState);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { name: 'History', icon: History, route: '/history' },
    { name: 'Settings', icon: Settings, route: '/settings' }
  ];

  const handleNavigation = (route: string) => {
    onNavigate?.(route);
    router.push(route);
  };

  const handleAccountClick = () => {
    handleNavigation('/settings?tab=account');
  };

  return (
    <aside className={`
      fixed h-full transition-all duration-300 ease-in-out z-20
      ${collapsed ? 'w-16 md:w-20' : 'w-64'}
      bg-background/95 backdrop-blur-lg
      border-r border-border
      ${isMobile && !collapsed ? 'shadow-xl' : ''}
    `}>
      <div className="flex flex-col h-full p-2">
        {/* Logo/Collapse Button */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
          {!collapsed && (
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              <span>Turbo</span>
            </h2>
          )}
          <Button 
            onClick={toggleCollapse}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  onClick={() => handleNavigation(item.route)}
                  variant={activeRoute === item.route ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 ${
                    collapsed ? 'px-2' : 'px-4'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {!collapsed && item.name}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Menu */}
        <div className="mt-auto p-2">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-3'}`}>
            <Button 
              variant="ghost" 
              onClick={handleAccountClick}
              className={`p-0 h-auto rounded-full hover:bg-accent ${
                collapsed ? 'w-10 h-10' : 'w-full justify-start'
              }`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      {user?.firstName || 'Account'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress || 'Settings'}
                    </p>
                  </div>
                )}
              </div>
            </Button>
            
            {!collapsed && user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => signOut()}
                className="rounded-full hover:bg-accent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" x2="9" y1="12" y2="12"/>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;