/**
 * Page Outils - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Outils
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, FileText, BarChart3, Users, Zap, Shield, Download, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function ToolsPage() {
  const tools = [
    {
      title: "Moteur de Recherche Avancé",
      description: "Trouvez les candidats parfaits grâce à notre moteur de recherche alimenté par l'IA.",
      features: [
        "Recherche sémantique intelligente",
        "Filtres multicritères",
        "Suggestions automatiques",
        "Sauvegarde des recherches"
      ],
      icon: Search,
      category: "Recrutement",
      pricing: "Inclus dans tous les plans",
      demo: "#"
    },
    {
      title: "Générateur d'Offres d'Emploi",
      description: "Créez des offres d'emploi attractives et optimisées en quelques minutes.",
      features: [
        "Templates personnalisables",
        "Optimisation SEO",
        "A/B testing intégré",
        "Analytics de performance"
      ],
      icon: FileText,
      category: "Création de contenu",
      pricing: "Gratuit jusqu'à 5 offres/mois",
      demo: "#"
    },
    {
      title: "Tableaux de Bord Analytics",
      description: "Visualisez et analysez vos données de recrutement avec des dashboards interactifs.",
      features: [
        "KPIs en temps réel",
        "Rapports personnalisables",
        "Export de données",
        "Alertes automatiques"
      ],
      icon: BarChart3,
      category: "Analytics",
      pricing: "À partir de 99€/mois",
      demo: "#"
    },
    {
      title: "Gestion des Candidatures",
      description: "Organisez et suivez toutes vos candidatures dans un pipeline unifié.",
      features: [
        "Pipeline personnalisable",
        "Automatisation des tâches",
        "Communication intégrée",
        "Collaboration équipe"
      ],
      icon: Users,
      category: "Gestion",
      pricing: "Inclus dans tous les plans",
      demo: "#"
    },
    {
      title: "Automatisation RH",
      description: "Automatisez vos processus RH répétitifs pour gagner en efficacité.",
      features: [
        "Workflows personnalisables",
        "Intégrations tierces",
        "Notifications intelligentes",
        "Historique des actions"
      ],
      icon: Zap,
      category: "Automatisation",
      pricing: "À partir de 199€/mois",
      demo: "#"
    },
    {
      title: "Centre de Sécurité",
      description: "Protégez vos données avec nos outils de sécurité et conformité RGPD.",
      features: [
        "Chiffrement end-to-end",
        "Audit de sécurité",
        "Conformité RGPD",
        "Sauvegarde automatique"
      ],
      icon: Shield,
      category: "Sécurité",
      pricing: "Inclus dans tous les plans",
      demo: "#"
    }
  ];

  const integrations = [
    {
      name: "LinkedIn",
      description: "Importez directement les profils LinkedIn",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/100px-LinkedIn_logo_initials.png"
    },
    {
      name: "Slack",
      description: "Notifications et collaboration en équipe",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/100px-Slack_Technologies_Logo.svg.png"
    },
    {
      name: "Google Workspace",
      description: "Intégration avec Gmail, Calendar et Drive",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_logo_%282013-2019%29.svg/100px-Google_logo_%282013-2019%29.svg.png"
    },
    {
      name: "Microsoft 365",
      description: "Synchronisation avec Outlook et Teams",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/100px-Microsoft_logo.svg.png"
    },
    {
      name: "Zoom",
      description: "Planification d'entretiens vidéo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Zoom_logo.png/100px-Zoom_logo.png"
    },
    {
      name: "Calendly",
      description: "Gestion des créneaux d'entretiens",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Calendly_logo.svg/100px-Calendly_logo.svg.png"
    }
  ];

  const resources = [
    {
      title: "Guide de l'Utilisateur",
      description: "Documentation complète pour maîtriser tous nos outils",
      type: "PDF",
      size: "2.3 MB",
      download: "#"
    },
    {
      title: "Templates d'Offres",
      description: "Collection de modèles d'offres d'emploi optimisés",
      type: "ZIP",
      size: "5.1 MB",
      download: "#"
    },
    {
      title: "API Documentation",
      description: "Guide technique pour intégrer nos outils",
      type: "Web",
      size: "En ligne",
      download: "#"
    },
    {
      title: "Vidéos de Formation",
      description: "Tutoriels vidéo pour utiliser efficacement nos outils",
      type: "Vidéo",
      size: "45 min",
      download: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <Container>
          <div className="py-6">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-cyan-600 transition-colors mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-48 w-48 flex items-center justify-center">
                <img 
                  src="/assets/reallogo.png" 
                  alt="LinkUp Logo" 
                  className="h-42 w-42 object-contain"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50/30 to-cyan-50/10 dark:from-slate-900 dark:via-slate-800/30 dark:to-cyan-900/10">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-700/50 text-cyan-700 dark:text-cyan-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
            >
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              Boîte à outils RH
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent mb-8 leading-tight"
            >
              Outils RH intelligents
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed"
            >
              Découvrez notre suite d'outils RH conçus pour optimiser chaque étape de votre processus de recrutement et de gestion des talents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Essayer gratuitement
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-semibold py-4 px-8 rounded-full">
                Voir les démos
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Nos outils en détail
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Une suite complète d'outils pour transformer vos pratiques RH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm">
                      {tool.pricing}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                    Essayer
                  </Button>
                  <Button size="sm" variant="outline" className="border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Intégrations populaires
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Connectez LinkUp à vos outils existants pour un workflow unifié
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 text-center"
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-12 h-12 mx-auto mb-4 object-contain"
                />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {integration.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Resources Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ressources utiles
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Téléchargez nos guides, templates et documentations pour optimiser l'utilisation de nos outils
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {resource.type} • {resource.size}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                  {resource.description}
                </p>
                <Button size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                  Télécharger
                </Button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <Container className="relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à optimiser vos outils RH ?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Découvrez comment nos outils peuvent transformer votre processus de recrutement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Essai gratuit 14 jours
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white dark:text-white hover:bg-white hover:text-cyan-700 font-semibold py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm">
                Planifier une démo
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

