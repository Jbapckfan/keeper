import * as React from 'react';
import { cn } from '../../lib/cn';

export interface HealthScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

function getHealthColor(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-lime-500';
  if (score >= 50) return 'text-yellow-500';
  if (score >= 30) return 'text-orange-500';
  return 'text-red-500';
}

function getHealthBgColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-lime-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}

function getHealthLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Poor';
  return 'Critical';
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', text: 'text-sm', ring: 'stroke-[4]' },
  md: { container: 'w-16 h-16', text: 'text-lg', ring: 'stroke-[5]' },
  lg: { container: 'w-24 h-24', text: 'text-2xl', ring: 'stroke-[6]' },
};

const HealthScore = React.forwardRef<HTMLDivElement, HealthScoreProps>(
  ({ className, score, size = 'md', showLabel = true, animated = true, ...props }, ref) => {
    const normalizedScore = Math.max(0, Math.min(100, score));
    const config = sizeConfig[size];
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

    return (
      <div ref={ref} className={cn('flex flex-col items-center gap-1', className)} {...props}>
        <div className={cn('relative', config.container)}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              className="text-gray-200"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              className={cn(getHealthColor(normalizedScore), config.ring)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: animated ? 'stroke-dashoffset 1s ease-out' : undefined,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('font-bold', config.text, getHealthColor(normalizedScore))}>
              {normalizedScore}
            </span>
          </div>
        </div>
        {showLabel && (
          <span className={cn('text-sm font-medium', getHealthColor(normalizedScore))}>
            {getHealthLabel(normalizedScore)}
          </span>
        )}
      </div>
    );
  }
);

HealthScore.displayName = 'HealthScore';

export { HealthScore, getHealthColor, getHealthBgColor, getHealthLabel };
