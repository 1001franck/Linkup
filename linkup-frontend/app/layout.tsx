/**
 * Layout principal de l'application LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du layout global
 * - Open/Closed : Extensible via composition
 * - Dependency Inversion : Dépend des abstractions (composants)
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfilePictureProvider } from "@/contexts/ProfilePictureContext";
import { CompanyLogoProvider } from "@/contexts/CompanyLogoContext";
import { JobsInteractionsProvider } from "@/contexts/JobsInteractionsContext";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkUp - Connectez-vous aux opportunités",
  description: "La plateforme qui connecte les talents aux opportunités. Trouvez votre prochain emploi ou recrutez les meilleurs profils.",
  keywords: ["emploi", "recrutement", "carrière", "réseau professionnel", "talent"],
  authors: [{ name: "LinkUp Team" }],
  creator: "LinkUp",
  publisher: "LinkUp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://linkup.com"),
  icons: {
    icon: [
      { url: "/assets/reallogo.png", type: "image/png" },
      { url: "/assets/reallogo.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/reallogo.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/assets/reallogo.png", type: "image/png" },
    ],
    shortcut: "/assets/reallogo.png",
  },
  openGraph: {
    title: "LinkUp - Connectez-vous aux opportunités",
    description: "La plateforme qui connecte les talents aux opportunités",
    url: "https://linkup.com",
    siteName: "LinkUp",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/assets/reallogo.png",
        width: 1200,
        height: 630,
        alt: "LinkUp Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkUp - Connectez-vous aux opportunités",
    description: "La plateforme qui connecte les talents aux opportunités",
    creator: "@linkup",
    images: ["/assets/reallogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProfilePictureProvider>
              <CompanyLogoProvider>
                <JobsInteractionsProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                  <Toaster />
                </JobsInteractionsProvider>
              </CompanyLogoProvider>
            </ProfilePictureProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
