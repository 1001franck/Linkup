"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Vérifier si on est sur une page admin ou entreprise
  const isAdminPage = pathname?.startsWith('/admin-dashboard');
  const isCompanyPage = pathname?.startsWith('/company-dashboard');
  
  // Si c'est une page admin ou entreprise, ne pas afficher le header/footer principal
  // Ces pages gèrent leur propre header
  if (isAdminPage || isCompanyPage) {
    return <>{children}</>;
  }
  
  // Pour les autres pages, afficher le header et footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
