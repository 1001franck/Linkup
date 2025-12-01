/**
 * Composant Sidebar de navigation pour Settings
 * Affiche les onglets de navigation
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, Shield, Palette, LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: "profile", label: "Profil", icon: User },
  { id: "security", label: "Sécurité", icon: Shield },
  { id: "appearance", label: "Apparence", icon: Palette },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-card backdrop-blur-sm border border-border shadow-lg sticky top-8">
        <CardContent className="p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}


