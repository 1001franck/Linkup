/**
 * Composant Onglet Apparence
 * Gère le thème, la langue et la densité d'affichage
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AppearanceTab() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="bg-card backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Thème et apparence</CardTitle>
          <CardDescription className="text-muted-foreground">
            Personnalisez l'apparence de votre interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Thème</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "light", label: "Clair", icon: "☀️" },
                { id: "dark", label: "Sombre", icon: "🌙" },
                { id: "system", label: "Système", icon: "💻" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  className="flex flex-col items-center space-y-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-2xl">{theme.icon}</span>
                  <span className="text-sm font-medium text-foreground">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Langue</label>
            <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Densité d'affichage
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "compact", label: "Compact" },
                { id: "normal", label: "Normal" },
                { id: "comfortable", label: "Confortable" },
              ].map((density) => (
                <button
                  key={density.id}
                  className="p-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium text-foreground"
                >
                  {density.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


