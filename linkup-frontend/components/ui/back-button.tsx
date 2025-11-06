/**
 * Composant BackButton - Bouton de retour intelligent
 */

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export function BackButton({ 
  fallbackPath, 
  className
}: BackButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    // Essayer d'abord d'utiliser l'historique du navigateur
    if (window?.history?.length > 1) {
      window.history.back();
    } else {
      // Si pas d'historique, utiliser le fallback
      if (fallbackPath) {
        router.push(fallbackPath);
      } else {
        // Si authentifié, aller au dashboard, sinon à l'accueil
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBack();
      }}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-10 w-10 border border-input bg-background ${className || ''}`}
      type="button"
      title="Retour"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
