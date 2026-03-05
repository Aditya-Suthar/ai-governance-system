import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'resolved';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    'in-progress': {
      label: 'In Progress',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    resolved: {
      label: 'Resolved',
      color: 'bg-green-100 text-green-800 border-green-300',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.color} border ${className}`}>
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: 'Low',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    high: {
      label: 'High',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    critical: {
      label: 'Critical',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge className={`${config.color} border ${className}`}>
      {config.label}
    </Badge>
  );
}
