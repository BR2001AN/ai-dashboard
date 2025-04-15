// src/app/settings/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Settings, User, Shield, Bell, Mail, HelpCircle } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
// --- 1. Import sonner ---
import { toast } from "sonner";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';

  // --- State Management ---
  const [username, setUsername] = useState('turbo_user'); // Load initial/fetched value
  const [email, setEmail] = useState('user@example.com'); // Load initial/fetched value
  const [isAccountSaving, setIsAccountSaving] = useState(false);

  const [saveHistoryEnabled, setSaveHistoryEnabled] = useState(true); // Load initial/fetched value
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(false); // Load initial/fetched value

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true); // Load initial/fetched value
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(false); // Load initial/fetched value
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);

  // --- Effect to load initial settings (Placeholder) ---
  useEffect(() => {
    console.log("Settings page loaded. Initial fetch placeholder.");
    // Fetch settings here if needed
  }, []);

  // --- Save Handlers with Toast Notifications ---
  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAccountSaving(true);
    console.log('Saving account settings:', { username, email });
    try {
      // --- TODO: Replace simulation with actual API call ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      // const response = await api.updateAccount({ username, email });
      // if (!response.ok) throw new Error("Failed to save");
      // ---

      // --- 2. Call toast on success ---
      toast.success("Account settings saved successfully!");

    } catch (error) {
      console.error("Failed to save account settings", error);
      // --- 3. Call toast on error ---
      toast.error("Failed to save account settings.", {
          description: error instanceof Error ? error.message : 'Please try again.', // Optional: Add description
      });
    } finally {
      setIsAccountSaving(false);
    }
    // Removed alert(...)
  };

  const handleNotificationsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotificationsSaving(true);
    console.log('Saving notification settings:', { pushNotificationsEnabled, emailUpdatesEnabled });
    try {
        // --- TODO: Replace simulation with actual API call ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        // const response = await api.updateNotificationSettings({...});
        // if (!response.ok) throw new Error("Failed to save");
        // ---

        // --- 4. Call toast on success ---
        toast.success("Notification settings saved successfully!");

    } catch (error) {
        console.error("Failed to save notification settings", error);
        // --- 5. Call toast on error ---
        toast.error("Failed to save notification settings.", {
            description: error instanceof Error ? error.message : 'Please try again.',
        });
    } finally {
        setIsNotificationsSaving(false);
    }
     // Removed alert(...)
  };

  // Placeholder for privacy changes (e.g., autosave logic)
  const handlePrivacyChange = (setting: string, value: boolean) => {
    console.log(`Privacy setting changed: ${setting} = ${value}`);
    // TODO: Implement autosave or other persistence logic
    // Optionally add toast feedback for autosave if needed
    // toast.info(`Preference '${setting}' updated.`);
  };

  // --- Reusable Switch Component ---
  const SettingsSwitch = ({ id, label, description, checked, onCheckedChange }: { /* props */ }) => (
     <div className="flex items-center justify-between space-x-4 p-1">
       <div className="space-y-0.5">
         <Label htmlFor={id} className="text-base font-medium cursor-pointer">{label}</Label>
         <p className="text-sm text-muted-foreground">{description}</p>
       </div>
       <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label}/>
     </div>
   );

  // --- Render JSX ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Manage your Turbo account and application preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        {/* TabsList */}
        <TabsList className="mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2"><User className="h-4 w-4" /> Account</TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2"><Shield className="h-4 w-4" /> Privacy</TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Support</TabsTrigger>
        </TabsList>

        {/* TabsContent Sections */}
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <form onSubmit={handleAccountSave}>
              <CardHeader><CardTitle>Account Settings</CardTitle><CardDescription>Update profile.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                 {/* Input fields */}
                <div className="space-y-2"><Label htmlFor="username">Username</Label><Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <Button type="submit" variant="secondary" className="mt-4" disabled={isAccountSaving}>{isAccountSaving ? 'Saving...' : 'Save Changes'}</Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
         <TabsContent value="privacy">
            <Card>
                <CardHeader><CardTitle>Privacy Settings</CardTitle><CardDescription>Configure privacy preferences.</CardDescription></CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <SettingsSwitch id="save-history" label="Save Conversation History" description="Store chat history locally." checked={saveHistoryEnabled} onCheckedChange={(checked) => { setSaveHistoryEnabled(checked); handlePrivacyChange('saveHistory', checked); }}/>
                    <Separator />
                    <SettingsSwitch id="data-collection" label="Anonymous Usage Data" description="Allow usage data collection." checked={dataCollectionEnabled} onCheckedChange={(checked) => { setDataCollectionEnabled(checked); handlePrivacyChange('dataCollection', checked); }}/>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
            <Card>
                <form onSubmit={handleNotificationsSave}>
                    <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Configure notifications.</CardDescription></CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <SettingsSwitch id="push-notifications" label="Push Notifications" description="Receive important alerts." checked={pushNotificationsEnabled} onCheckedChange={setPushNotificationsEnabled}/>
                        <Separator />
                        <SettingsSwitch id="email-updates" label="Email Updates" description="Get product updates via email." checked={emailUpdatesEnabled} onCheckedChange={setEmailUpdatesEnabled}/>
                        <Button type="submit" variant="secondary" className="mt-4" disabled={isNotificationsSaving}>{isNotificationsSaving ? 'Saving...' : 'Save Notification Settings'}</Button>
                    </CardContent>
                </form>
            </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support">
            <Card>
                <CardHeader><CardTitle>Support</CardTitle><CardDescription>Get help.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                     {/* Support Links as Cards */}
                    <a href="mailto:support@turbo.ai" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg" aria-label="Contact Support"><Card className="hover:bg-accent/50 transition-colors cursor-pointer"><CardHeader className="flex flex-row items-center space-x-4 p-4"><Mail className="h-6 w-6 text-primary shrink-0" /><div className="space-y-0.5"><CardTitle className="text-base font-semibold">Contact Support</CardTitle><CardDescription className="text-sm">Email us at support@turbo.ai</CardDescription></div></CardHeader></Card></a>
                    <a href="/help-center" target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg" aria-label="Visit Help Center"><Card className="hover:bg-accent/50 transition-colors cursor-pointer"><CardHeader className="flex flex-row items-center space-x-4 p-4"><HelpCircle className="h-6 w-6 text-primary shrink-0" /><div className="space-y-0.5"><CardTitle className="text-base font-semibold">Help Center</CardTitle><CardDescription className="text-sm">Visit documentation & FAQs</CardDescription></div></CardHeader></Card></a>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}