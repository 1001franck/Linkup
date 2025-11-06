/**
 * Composant Switch - Atom
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des switches/toggles
 * - Open/Closed : Extensible via props et variants
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = 'md', label, description, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-7',
      md: 'h-5 w-9',
      lg: 'h-6 w-11'
    };

    const thumbSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };

    return (
      <div className="flex items-center space-x-3">
        <div className="relative inline-flex">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              sizeClasses[size],
              props.checked
                ? "bg-primary"
                : "bg-muted",
              className
            )}
          >
            <span
              className={cn(
                "inline-block transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                thumbSizeClasses[size],
                props.checked
                  ? size === 'sm' ? "translate-x-3" : size === 'md' ? "translate-x-4" : "translate-x-5"
                  : "translate-x-0"
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label className="text-sm font-medium text-foreground cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
