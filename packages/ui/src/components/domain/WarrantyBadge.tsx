import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const warrantyBadgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      status: {
        active: 'bg-green-100 text-green-800',
        expiring_soon: 'bg-yellow-100 text-yellow-800',
        expiring: 'bg-orange-100 text-orange-800',
        critical: 'bg-red-100 text-red-800 animate-pulse',
        expired: 'bg-gray-100 text-gray-600',
        unknown: 'bg-gray-100 text-gray-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      status: 'unknown',
      size: 'md',
    },
  }
);

export interface WarrantyBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof warrantyBadgeVariants> {
  expiresAt?: Date;
  isExtended?: boolean;
}

function getWarrantyStatus(expiresAt?: Date): 'active' | 'expiring_soon' | 'expiring' | 'critical' | 'expired' | 'unknown' {
  if (!expiresAt) return 'unknown';

  const now = new Date();
  const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 7) return 'critical';
  if (daysRemaining <= 30) return 'expiring';
  if (daysRemaining <= 90) return 'expiring_soon';
  return 'active';
}

function getStatusLabel(status: string, daysRemaining?: number): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expiring_soon':
      return daysRemaining ? `${daysRemaining}d left` : 'Expiring Soon';
    case 'expiring':
      return daysRemaining ? `${daysRemaining}d left` : 'Expiring';
    case 'critical':
      return daysRemaining ? `${daysRemaining}d left!` : 'Expires Soon!';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
}

const WarrantyBadge = React.forwardRef<HTMLSpanElement, WarrantyBadgeProps>(
  ({ className, status: statusProp, size, expiresAt, isExtended, ...props }, ref) => {
    const calculatedStatus = statusProp || getWarrantyStatus(expiresAt);

    const daysRemaining = expiresAt
      ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

    return (
      <span
        className={cn(warrantyBadgeVariants({ status: calculatedStatus, size }), className)}
        ref={ref}
        {...props}
      >
        {isExtended && (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )}
        {getStatusLabel(calculatedStatus, daysRemaining && daysRemaining > 0 ? daysRemaining : undefined)}
      </span>
    );
  }
);

WarrantyBadge.displayName = 'WarrantyBadge';

export { WarrantyBadge, warrantyBadgeVariants };
