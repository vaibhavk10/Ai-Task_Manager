import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Mail,
  Smartphone,
  Save,
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
}

const SettingsView = ({ isDarkMode, onThemeChange }: SettingsViewProps) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      desktop: false,
    },
    language: 'en',
    timezone: 'UTC',
    privacy: {
      showOnline: true,
      showTasks: true,
    },
  });

  const handleNotificationChange = (type: 'email' | 'push' | 'desktop') => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type],
      },
    });
  };

  const handlePrivacyChange = (type: 'showOnline' | 'showTasks') => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [type]: !settings.privacy[type],
      },
    });
  };

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('taskManagerSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label>Dark Mode</Label>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={onThemeChange}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label>Email Notifications</Label>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationChange('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Label>Push Notifications</Label>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={() => handleNotificationChange('push')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label>Desktop Notifications</Label>
              </div>
              <Switch
                checked={settings.notifications.desktop}
                onCheckedChange={() => handleNotificationChange('desktop')}
              />
            </div>
          </div>
        </Card>

        {/* Localization */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Localization</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {settings.language === 'en' ? 'English' : 'Other'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue>{settings.timezone}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Label>Show Online Status</Label>
              </div>
              <Switch
                checked={settings.privacy.showOnline}
                onCheckedChange={() => handlePrivacyChange('showOnline')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <Label>Show Tasks to Team</Label>
              </div>
              <Switch
                checked={settings.privacy.showTasks}
                onCheckedChange={() => handlePrivacyChange('showTasks')}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsView; 