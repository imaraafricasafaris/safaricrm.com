import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Staff } from "../../types/staff";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { 
  dialogContentStyles, 
  dialogHeaderStyles, 
  dialogTitleStyles,
  activityLogCardStyles,
  badgeVariantStyles
} from '../ui/dialog-styles';
import { cn } from '@/lib/utils';
import { 
  LogIn, 
  CheckCircle2, 
  ClipboardCheck, 
  UserCog, 
  Bell,
  Activity
} from 'lucide-react';

interface ActivityLogsProps {
  staff: Staff;
  isOpen: boolean;
  onClose: () => void;
}

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  details?: Record<string, any>;
}

export function ActivityLogs({ staff, isOpen, onClose }: ActivityLogsProps) {
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Here you would typically fetch logs from your API
        // For now, we'll use mock data
        const mockLogs: ActivityLog[] = [
          {
            id: '1',
            type: 'login',
            description: 'Logged into the system',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'task_complete',
            description: 'Completed task: Client meeting',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            type: 'task_assigned',
            description: 'Assigned new task: Safari planning',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: '4',
            type: 'profile_update',
            description: 'Updated profile information',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
          },
          {
            id: '5',
            type: 'notification',
            description: 'Sent notification to team',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
          },
        ];
        setLogs(mockLogs);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-5 w-5" />;
      case 'task_complete':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'task_assigned':
        return <ClipboardCheck className="h-5 w-5" />;
      case 'profile_update':
        return <UserCog className="h-5 w-5" />;
      case 'notification':
        return <Bell className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'default';
      case 'task_complete':
        return 'success';
      case 'task_assigned':
        return 'warning';
      case 'profile_update':
        return 'info';
      case 'notification':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(dialogContentStyles, "max-w-[800px]")}>
        <DialogHeader className={dialogHeaderStyles}>
          <DialogTitle className={dialogTitleStyles}>
            Activity Logs - {staff.first_name} {staff.last_name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No activity logs found
              </div>
            ) : (
              logs.map((log) => (
                <Card 
                  key={log.id} 
                  className={cn(
                    activityLogCardStyles,
                    "animate-fadeIn"
                  )}
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      badgeVariantStyles[getActivityBadgeColor(log.type)]
                    )}>
                      {getActivityIcon(log.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline"
                          className={cn(
                            badgeVariantStyles[getActivityBadgeColor(log.type)],
                            "capitalize"
                          )}
                        >
                          {log.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(new Date(log.timestamp), 'PPpp')}
                        </span>
                      </div>
                      <p className="text-sm">{log.description}</p>
                      {log.details && (
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
