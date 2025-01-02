```typescript
import React from 'react';
import { CreditCard, Star, TrendingUp } from 'lucide-react';
import { Switch } from '../../shared/ui/Switch';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { usePremiumSettings } from '../../../hooks/lawyers/usePremiumSettings';

export function PremiumSettings() {
  const { 
    settings,
    isLoading,
    updateSettings,
    openBillingPortal
  } = usePremiumSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Premium Settings</h2>
        <Button
          variant="secondary"
          onClick={openBillingPortal}
          icon={<CreditCard className="h-4 w-4" />}
        >
          Manage Billing
        </Button>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <Star className="h-6 w-6 text-yellow-400 mt-1" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Premium Directory Placement</h3>
                <p className="text-sm text-gray-500">
                  Get featured at the top of lawyer search results for increased visibility
                </p>
              </div>
            </div>
            <Switch
              checked={settings?.premiumPlacement || false}
              onChange={(checked) => updateSettings({ premiumPlacement: checked })}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <TrendingUp className="h-6 w-6 text-indigo-400 mt-1" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Analytics & Insights</h3>
                <p className="text-sm text-gray-500">
                  Access detailed analytics about your profile views and client engagement
                </p>
              </div>
            </div>
            <Switch
              checked={settings?.analyticsEnabled || false}
              onChange={(checked) => updateSettings({ analyticsEnabled: checked })}
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Current Plan</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {settings?.plan || 'Free Plan'}
                </p>
                <p className="text-sm text-gray-500">
                  {settings?.planDescription || 'Basic features included'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.href = '/lawyers/plans'}
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
```