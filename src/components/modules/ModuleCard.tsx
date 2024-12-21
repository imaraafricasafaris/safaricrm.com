import React from 'react';
import { useModules } from '@/contexts/ModuleContext';
import { Module, SubscriptionTier } from '@/contexts/ModuleContext/types';
import { Switch } from '@/components/ui/switch';
import { Settings, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface ModuleCardProps {
  module: Module;
  isAccessible: boolean;
  currentTier: SubscriptionTier;
}

export default function ModuleCard({ module, isAccessible, currentTier }: ModuleCardProps) {
  const { toggleModule, configureModule, activateSubscription } = useModules();

  // Dynamically get the icon component
  const IconComponent = (Icons as any)[module.icon] || Icons.Box;

  const handleToggle = async () => {
    if (!isAccessible) {
      // Show upgrade prompt
      return;
    }
    await toggleModule(module.id);
  };

  const handleConfigure = async () => {
    if (!isAccessible || !module.is_configurable) return;
    // Open configuration modal
    // await configureModule(module.id, newSettings);
  };

  const getSubscriptionBadge = () => {
    if (module.is_core) {
      return (
        <div className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          Core
        </div>
      );
    }

    const tierColors = {
      free: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      basic: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      premium: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    };

    return (
      <div className={cn('px-2 py-0.5 text-xs rounded-full', tierColors[module.min_subscription_tier])}>
        {module.min_subscription_tier.charAt(0).toUpperCase() + module.min_subscription_tier.slice(1)}
      </div>
    );
  };

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-colors',
      isAccessible 
        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            isAccessible 
              ? 'bg-primary/10 text-primary' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
          )}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{module.name}</h3>
            {getSubscriptionBadge()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {module.is_configurable && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                !isAccessible && 'opacity-50 cursor-not-allowed'
              )}
              onClick={handleConfigure}
              disabled={!isAccessible}
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          <Switch
            checked={module.is_enabled}
            onCheckedChange={handleToggle}
            disabled={!isAccessible}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {module.description}
      </p>

      {!isAccessible && (
        <div className="mt-4 flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Requires {module.min_subscription_tier} plan</span>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              // Open upgrade modal
            }}
          >
            Upgrade
          </Button>
        </div>
      )}

      {module.features && Array.isArray(module.features) && module.features.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features</h4>
          <ul className="space-y-1">
            {module.features.map((feature, index) => (
              <li
                key={index}
                className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}