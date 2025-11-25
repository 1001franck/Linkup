/**
 * Page Cookies - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Cookies
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Cookie, Settings, Shield, Eye, Database, ToggleLeft, ToggleRight, FileText, Monitor } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    preferences: false,
    marketing: false
  });

  const cookieTypes = [
    {
      name: "Cookies nécessaires",
      key: "necessary",
      required: true,
      description: "Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.",
      examples: ["Authentification", "Sécurité", "Préférences de base"],
      icon: Shield
    },
    {
      name: "Cookies analytiques",
      key: "analytics",
      required: false,
      description: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site.",
      examples: ["Google Analytics", "Statistiques de visite", "Pages les plus consultées"],
      icon: Database
    },
    {
      name: "Cookies de préférences",
      key: "preferences",
      required: false,
      description: "Ces cookies permettent de mémoriser vos choix et préférences.",
      examples: ["Langue", "Thème", "Paramètres d'affichage"],
      icon: Settings
    },
    {
      name: "Cookies marketing",
      key: "marketing",
      required: false,
      description: "Ces cookies sont utilisés pour diffuser des publicités pertinentes.",
      examples: ["Publicités ciblées", "Réseaux sociaux", "Suivi des conversions"],
      icon: Eye
    }
  ];

  const cookieDetails = [
    {
      name: "session_id",
      purpose: "Maintien de la session utilisateur",
      duration: "Session",
      type: "Nécessaire"
    },
    {
      name: "user_preferences",
      purpose: "Stockage des préférences utilisateur",
      duration: "1 an",
      type: "Préférences"
    },
    {
      name: "_ga",
      purpose: "Suivi des visiteurs uniques",
      duration: "2 ans",
      type: "Analytique"
    },
    {
      name: "marketing_campaign",
      purpose: "Suivi des campagnes marketing",
      duration: "6 mois",
      type: "Marketing"
    }
  ];

  const handleToggleCookie = (cookieKey: string) => {
    setCookiePreferences(prev => ({
      ...prev,
      [cookieKey]: !prev[cookieKey as keyof typeof prev]
    }));
  };

  const savePreferences = () => {
    // Here you would typically save the preferences to localStorage or send to your backend
    // Préférences de cookies sauvegardées
    // Show success message or redirect
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Container>
          <div className="py-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </Container>
      </div>

      {/* Article Content */}
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Cookie className="w-4 h-4" />
              <span>Politique des cookies</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Gestion des cookies
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Personnalisation</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Protection des données</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Dernière mise à jour : 13 Octobre 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez comment nous utilisons les cookies et gérez vos préférences pour une expérience personnalisée.
            </p>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-foreground">
              {/* Types de cookies utilisés */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Cookie className="w-6 h-6 text-primary" />
                  Types de cookies utilisés
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous utilisons différents types de cookies pour améliorer votre expérience
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cookieTypes.map((cookieType, index) => (
                    <div key={cookieType.name} className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center">
                            <cookieType.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {cookieType.name}
                            </h3>
                            {cookieType.required && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                Requis
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cookieType.required ? (
                            <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleToggleCookie(cookieType.key)}
                              className="w-12 h-6 rounded-full transition-colors duration-200 flex items-center px-1 cursor-pointer"
                              style={{
                                backgroundColor: cookiePreferences[cookieType.key as keyof typeof cookiePreferences] ? '#10b981' : '#e5e7eb'
                              }}
                            >
                              <div className="w-4 h-4 bg-white rounded-full transition-transform duration-200"
                                   style={{
                                     transform: cookiePreferences[cookieType.key as keyof typeof cookiePreferences] ? 'translateX(24px)' : 'translateX(0)'
                                   }}></div>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {cookieType.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2 text-sm">Exemples :</h4>
                        <ul className="space-y-1">
                          {cookieType.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="flex items-center gap-2 text-muted-foreground text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Cookie Details Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-foreground">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Détails des cookies
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Liste détaillée des cookies utilisés sur notre plateforme
                  </p>

                  <div className="bg-card rounded-xl overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Finalité</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Durée</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {cookieDetails.map((cookie, index) => (
                            <motion.tr
                              key={cookie.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-mono text-foreground">
                                {cookie.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {cookie.purpose}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {cookie.duration}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  cookie.type === 'Nécessaire' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    : cookie.type === 'Analytique'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : cookie.type === 'Préférences'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                }`}>
                                  {cookie.type}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Cookie Management Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-foreground">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" />
                    Gérez vos préférences
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Vous pouvez modifier vos préférences de cookies à tout moment. 
                    Notez que désactiver certains cookies peut affecter le fonctionnement de certaines fonctionnalités.
                  </p>

                  <div className="bg-card rounded-xl p-8 border border-border text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Cookie className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Contrôle total de vos données
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Personnalisez votre expérience en choisissant quels cookies vous souhaitez autoriser.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={savePreferences}
                        className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 px-8 rounded-full cursor-pointer"
                      >
                        Sauvegarder mes préférences
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-border text-foreground hover:bg-muted font-semibold py-3 px-8 rounded-full cursor-pointer"
                      >
                        Accepter tous les cookies
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Browser Settings Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-foreground">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-primary" />
                    Paramètres de votre navigateur
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Vous pouvez également gérer les cookies directement dans votre navigateur
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        browser: "Chrome",
                        steps: [
                          "Cliquez sur le menu Chrome",
                          "Sélectionnez 'Paramètres'",
                          "Cliquez sur 'Confidentialité et sécurité'",
                          "Choisissez 'Cookies et autres données de site'"
                        ]
                      },
                      {
                        browser: "Firefox",
                        steps: [
                          "Cliquez sur le menu Firefox",
                          "Sélectionnez 'Options'",
                          "Cliquez sur 'Vie privée et sécurité'",
                          "Dans la section 'Cookies et données de sites'"
                        ]
                      },
                      {
                        browser: "Safari",
                        steps: [
                          "Cliquez sur le menu Safari",
                          "Sélectionnez 'Préférences'",
                          "Cliquez sur l'onglet 'Confidentialité'",
                          "Gérez les cookies et données de sites web"
                        ]
                      }
                    ].map((browser, index) => (
                      <div key={browser.browser} className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                          {browser.browser}
                        </h3>
                        <ol className="space-y-3">
                          {browser.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3 text-muted-foreground text-sm">
                              <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="space-y-8 text-foreground">
                <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-12 text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Questions sur nos cookies ?
                  </h2>
                  <p className="text-cyan-100 mb-8 leading-relaxed">
                    Notre équipe est là pour vous aider à comprendre notre utilisation des cookies et à gérer vos préférences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="secondary"
                      className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold py-3 px-8 rounded-full cursor-pointer"
                    >
                      Nous contacter
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-full cursor-pointer"
                    >
                      En savoir plus
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}