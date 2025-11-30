/**
 * Composant Header de la page Settings
 * Affiche le titre et la description
 */

"use client";

import { Container } from "@/components/layout/container";
import { BackButton } from "@/components/ui/back-button";
import { Typography } from "@/components/ui/typography";
import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <Container>
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton
                fallbackPath="/dashboard"
                className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
              />

              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <Typography variant="h1" className="text-2xl font-bold text-foreground">
                    Paramètres
                  </Typography>
                  <Typography variant="muted" className="text-muted-foreground">
                    Gérez vos préférences et votre compte
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

