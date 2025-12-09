// Utilities
export { cn } from './lib/cn';

// Primitives
export { Button, buttonVariants, type ButtonProps } from './components/primitives/Button';
export { Input, inputVariants, type InputProps } from './components/primitives/Input';
export { Badge, badgeVariants, type BadgeProps } from './components/primitives/Badge';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from './components/primitives/Card';
export { Spinner, spinnerVariants, type SpinnerProps } from './components/primitives/Spinner';

// Domain Components
export {
  WarrantyBadge,
  warrantyBadgeVariants,
  type WarrantyBadgeProps,
} from './components/domain/WarrantyBadge';
export {
  HealthScore,
  getHealthColor,
  getHealthBgColor,
  getHealthLabel,
  type HealthScoreProps,
} from './components/domain/HealthScore';

// Styles
import './styles/tokens.css';
