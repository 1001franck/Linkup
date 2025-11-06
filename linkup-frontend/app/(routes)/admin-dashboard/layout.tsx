/**
 * Layout Admin Dashboard - LinkUp
 * Layout spécifique pour les pages d'administration
 * Respect des principes SOLID :
 * - Single Responsibility : Layout unique pour admin
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserType } from "@/hooks/use-user-type";
import { Shield, Loader2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: userTypeLoading } = useUserType();

  // Loading state
  if (authLoading || userTypeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <Typography variant="muted">Chargement du dashboard admin...</Typography>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <Typography variant="h2" className="font-bold mb-2">
            Accès Refusé
          </Typography>
          <Typography variant="muted" className="mb-4">
            Vous devez être connecté pour accéder à cette page.
          </Typography>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <Typography variant="h2" className="font-bold mb-2">
            Accès Refusé
          </Typography>
          <Typography variant="muted" className="mb-4">
            Vous n'avez pas les permissions d'administrateur nécessaires pour accéder à cette page.
          </Typography>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Mon tableau de bord</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin authenticated - show layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex flex-col">
      <AdminHeader />
      <main className="relative flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
