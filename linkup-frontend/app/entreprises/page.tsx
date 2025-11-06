/**
 * Redirection vers la vraie page des entreprises connectée au backend
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntreprisesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers la page des entreprises connectée au backend
    router.replace("/companies");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection vers la page des entreprises...</p>
      </div>
    </div>
  );
}
