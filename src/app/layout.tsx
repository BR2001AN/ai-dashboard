// src/app/layout.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './globals.css';
import Sidebar from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { usePathname, useRouter } from 'next/navigation';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {mounted && (
              <div className="flex min-h-screen">
                <Sidebar 
                  collapsed={sidebarCollapsed} 
                  onCollapse={setSidebarCollapsed}
                  activeRoute={pathname}
                  onNavigate={handleNavigation}
                />
                <main className={`flex-1 transition-all duration-300 ease-in-out ${
                  sidebarCollapsed ? 'ml-16 md:ml-20' : 'ml-0 md:ml-64'
                }`}>
                  <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className={`flex h-14 items-center justify-between ${
                      sidebarCollapsed ? 'pl-4 md:pl-6' : 'pl-4 md:pl-8'
                    } pr-4 md:pr-6`}>
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                          className="md:hidden p-2 rounded-md hover:bg-primary-accent/10"
                        >
                          {sidebarCollapsed ? (
                            <ChevronRight className="h-5 w-5" />
                          ) : (
                            <ChevronLeft className="h-5 w-5" />
                          )}
                        </button>
                        <h1 className="text-lg font-semibold text-foreground hidden md:block">
                          Turbo
                        </h1>
                      </div>
                      <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <SignedOut>
                          <div className="flex gap-2">
                            <SignInButton mode="modal">
                              <button className="text-sm px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground">
                                Sign in
                              </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                              <button className="text-sm px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-accent">
                                Sign up
                              </button>
                            </SignUpButton>
                          </div>
                        </SignedOut>
                        <SignedIn>
                          <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                              elements: {
                                avatarBox: "w-8 h-8",
                                userButtonPopoverCard: "bg-background border-border",
                              }
                            }}
                          />
                        </SignedIn>
                      </div>
                    </div>
                  </header>
                  
                  <div className={`p-4 md:p-6 ${
                    sidebarCollapsed ? 'pl-4 md:pl-6' : 'pl-4 md:pl-8'
                  }`}>
                    {children}
                  </div>
                </main>
              </div>
            )}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default Layout;