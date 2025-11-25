/**
 * Composant PrivacySection - Molecule
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique d'une section de préférences
 * - Open/Closed : Extensible via composition et props
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { PrivacyPreference, PrivacySectionProps } from "@/types";

const PrivacySection = React.forwardRef<HTMLDivElement, PrivacySectionProps>(
  ({ title, description, preferences, onPreferenceChange, className }, ref) => {
    return (
      <Card ref={ref} className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {preferences.map((preference) => (
            <div
              key={preference.id}
              className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <Typography variant="small" className="font-medium">
                    {preference.title}
                  </Typography>
                  {preference.required && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary w-fit">
                      Requis
                    </span>
                  )}
                </div>
                <Typography variant="muted" className="text-sm">
                  {preference.description}
                </Typography>
              </div>
              <div className="flex justify-end sm:justify-start">
                <Switch
                  checked={preference.enabled}
                  onChange={(e) => onPreferenceChange?.(preference.id, e.target.checked)}
                  disabled={preference.required}
                  size="md"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
);

PrivacySection.displayName = "PrivacySection";

export { PrivacySection };
