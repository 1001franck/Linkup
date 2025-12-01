/**
 * Header Admin - LinkUp
 * Navigation spécifique pour les administrateurs
 * Respect des principes SOLID :
 * - Single Responsibility : Navigation unique pour admin
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUserType } from "@/hooks/use-user-type";
import { 
  Shield, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

const adminNavItems = [
  {
    href: "/admin-dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Vue d'ensemble"
  },
  {
    href: "/admin-dashboard/users",
    label: "Utilisateurs",
    icon: Users,
    description: "Gestion des utilisateurs"
  },
  {
    href: "/admin-dashboard/companies",
    label: "Entreprises",
    icon: Building2,
    description: "Gestion des entreprises"
  },
  {
    href: "/admin-dashboard/jobs",
    label: "Offres d'emploi",
    icon: Briefcase,
    description: "Gestion des offres"
  },
  {
    href: "/admin-dashboard/applications",
    label: "Candidatures",
    icon: FileText,
    description: "Gestion des candidatures"
  }
];

export function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAdmin } = useUserType();
  const { theme, setTheme } = useTheme();

  // Éviter l'erreur d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?'
    );
    if (confirmed) {
      await logout();
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin-dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard" className="flex items-center gap-3">
              <div className="h-48 w-48 flex items-center justify-center">
                <img 
                  src="/assets/reallogo.png" 
                  alt="LinkUp" 
                  className="h-42 w-42 object-contain"
                />
              </div>
            </Link>
            
            <Badge className="bg-primary/10 text-primary">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            )}

            {/* Menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </Button>

            {/* Déconnexion */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
            <div className="py-4 space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-primary/10 text-primary border-l-4 border-primary"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <Typography variant="sm" className="font-medium">
                          {item.label}
                        </Typography>
                        <Typography variant="xs" className="text-muted-foreground">
                          {item.description}
                        </Typography>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default AdminHeader;
