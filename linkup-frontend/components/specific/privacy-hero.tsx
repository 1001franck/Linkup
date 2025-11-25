/**
 * Composant PrivacyHero - Molecule
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la section hero des préférences
 * - Open/Closed : Extensible via composition et props
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrivacyHeroProps } from "@/types";

const PrivacyHero = React.forwardRef<HTMLElement, PrivacyHeroProps>(
  ({ 
    title = "Préférences de confidentialité",
    subtitle = "Contrôlez vos données",
    description = "Gérez vos préférences de confidentialité et contrôlez la façon dont vos données sont utilisées sur LinkUp.",
    onSavePreferences,
    onResetToDefaults,
    className 
  }, ref) => {
    const features = [
      {
        icon: Shield,
        title: "Protection des données",
        description: "Vos informations sont sécurisées"
      },
      {
        icon: Lock,
        title: "Contrôle total",
        description: "Vous décidez de ce qui est partagé"
      },
      {
        icon: Eye,
        title: "Transparence",
        description: "Visibilité complète sur l'utilisation"
      },
      {
        icon: Settings,
        title: "Personnalisation",
        description: "Ajustez selon vos besoins"
      }
    ];

    return (
      <section ref={ref} className={cn("py-12 lg:py-20", className)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Typography variant="h1" className="mb-4">
              {title}
            </Typography>
            <Typography variant="h3" className="text-primary mb-6">
              {subtitle}
            </Typography>
            <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {description}
            </Typography>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {onSavePreferences && (
                <Button size="lg" onClick={onSavePreferences}>
                  Sauvegarder les préférences
                </Button>
              )}
              {onResetToDefaults && (
                <Button variant="outline" size="lg" onClick={onResetToDefaults}>
                  Réinitialiser par défaut
                </Button>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <Typography variant="small" className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                  {feature.title}
                </Typography>
                <Typography variant="muted" className="text-xs sm:text-sm">
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

PrivacyHero.displayName = "PrivacyHero";

export { PrivacyHero };
