/**
 * Page Statut - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Statut
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock, Activity, Server, Database, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function StatusPage() {
  const services = [
    {
      name: "API LinkUp",
      status: "operational",
      description: "Service principal de l'API",
      uptime: "99.9%",
      responseTime: "45ms"
    },
    {
      name: "Base de données",
      status: "operational",
      description: "Stockage et gestion des données",
      uptime: "99.95%",
      responseTime: "12ms"
    },
    {
      name: "Service d'authentification",
      status: "operational",
      description: "Gestion des connexions et sécurité",
      uptime: "99.8%",
      responseTime: "23ms"
    },
    {
      name: "Service de matching",
      status: "operational",
      description: "Algorithme de correspondance IA",
      uptime: "99.7%",
      responseTime: "156ms"
    },
    {
      name: "Notifications",
      status: "operational",
      description: "Système d'envoi d'emails et SMS",
      uptime: "99.6%",
      responseTime: "89ms"
    },
    {
      name: "CDN & Assets",
      status: "operational",
      description: "Distribution de contenu et fichiers",
      uptime: "99.9%",
      responseTime: "34ms"
    }
  ];

  const incidents = [
    {
      title: "Maintenance programmée - API",
      status: "resolved",
      date: "13 Octobre 2025",
      duration: "2h",
      description: "Mise à jour de sécurité et amélioration des performances de l'API principale."
    },
    {
      title: "Problème de connectivité - Base de données",
      status: "resolved",
      date: "10 Octobre 2025",
      duration: "45min",
      description: "Interruption temporaire de la connectivité avec notre base de données principale."
    },
    {
      title: "Latence élevée - Service de matching",
      status: "monitoring",
      date: "5 Octobre 2025",
      duration: "En cours",
      description: "Surveillance active des performances du service de matching IA."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 dark:text-green-400";
      case "degraded":
        return "text-yellow-600 dark:text-yellow-400";
      case "outage":
        return "text-red-600 dark:text-red-400";
      case "maintenance":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Opérationnel";
      case "degraded":
        return "Dégradé";
      case "outage":
        return "Indisponible";
      case "maintenance":
        return "Maintenance";
      case "resolved":
        return "Résolu";
      case "monitoring":
        return "Surveillance";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Hero Section */}
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Statut des services</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Tous les systèmes opérationnels
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Surveillance en temps réel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>99.8% d'uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Dernière mise à jour : 13 Octobre 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Surveillez en temps réel l'état de tous nos services et infrastructures
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.8%</div>
                <div className="text-sm text-muted-foreground">Uptime global</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">67ms</div>
                <div className="text-sm text-muted-foreground">Temps de réponse moyen</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">0</div>
                <div className="text-sm text-muted-foreground">Incidents actifs</div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Services Status Section */}
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
                    <Activity className="w-6 h-6 text-primary" />
                    État des services
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Surveillance en temps réel de tous nos composants système
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                      <div key={service.name} className="bg-muted/50 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(service.status)}
                            <h3 className="text-lg font-bold text-foreground">
                              {service.name}
                            </h3>
                          </div>
                          <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                            {getStatusText(service.status)}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-4 text-sm">
                          {service.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Uptime (30j)</span>
                            <span className="font-medium text-foreground">{service.uptime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Temps de réponse</span>
                            <span className="font-medium text-foreground">{service.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Recent Incidents Section */}
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
                    <AlertCircle className="w-6 h-6 text-primary" />
                    Incidents récents
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Historique des interruptions de service et maintenances
                  </p>

                  <div className="space-y-4">
                    {incidents.map((incident, index) => (
                      <div key={incident.title} className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(incident.status)}
                            <h3 className="text-lg font-bold text-foreground">
                              {incident.title}
                            </h3>
                          </div>
                          <span className={`text-sm font-medium ${getStatusColor(incident.status)}`}>
                            {getStatusText(incident.status)}
                          </span>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                          {incident.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {incident.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Durée: {incident.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* System Information Section */}
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
                    <Server className="w-6 h-6 text-primary" />
                    Informations système
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Détails techniques sur notre infrastructure
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-muted/50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Server className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        Infrastructure
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        Serveurs haute disponibilité avec redondance géographique et sauvegarde automatique.
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        Base de données
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        PostgreSQL avec réplication en temps réel et chiffrement des données sensibles.
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        CDN & Performance
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        Réseau de distribution mondial pour une latence optimale et une disponibilité maximale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Subscribe Section */}
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
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Restez informé
                  </h2>
                  <p className="text-cyan-100 mb-8 leading-relaxed">
                    Recevez des notifications en cas d'incident ou de maintenance programmée
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="Votre adresse email"
                      className="flex-1 px-6 py-3 rounded-full border-0 bg-white/10 backdrop-blur-sm text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Button className="bg-white hover:bg-cyan-50 text-cyan-700 font-semibold py-3 px-8 rounded-full cursor-pointer">
                      S'abonner
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

