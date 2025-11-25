/**
 * Page RGPD - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page RGPD
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, UserCheck, Database, Lock, Eye, Download, Trash2, Edit3 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function GDPRPage() {
  const principles = [
    {
      title: "Légalité",
      description: "Nous traitons vos données uniquement sur des bases légales claires et transparentes.",
      icon: Shield
    },
    {
      title: "Loyauté et transparence",
      description: "Nous vous informons clairement de l'utilisation de vos données personnelles.",
      icon: Eye
    },
    {
      title: "Minimisation",
      description: "Nous collectons uniquement les données strictement nécessaires à nos services.",
      icon: Database
    },
    {
      title: "Exactitude",
      description: "Nous nous efforçons de maintenir vos données à jour et exactes.",
      icon: Edit3
    },
    {
      title: "Limitation de conservation",
      description: "Nous ne conservons vos données que le temps nécessaire à leur finalité.",
      icon: Lock
    },
    {
      title: "Intégrité et confidentialité",
      description: "Nous protégeons vos données contre tout accès non autorisé ou perte.",
      icon: UserCheck
    }
  ];

  const rights = [
    {
      title: "Droit d'accès",
      description: "Vous pouvez demander quelles données personnelles nous détenons sur vous.",
      icon: Eye,
      action: "Demander l'accès"
    },
    {
      title: "Droit de rectification",
      description: "Vous pouvez corriger ou mettre à jour vos données personnelles.",
      icon: Edit3,
      action: "Modifier mes données"
    },
    {
      title: "Droit à l'effacement",
      description: "Vous pouvez demander la suppression de vos données personnelles.",
      icon: Trash2,
      action: "Supprimer mes données"
    },
    {
      title: "Droit à la portabilité",
      description: "Vous pouvez récupérer vos données dans un format structuré.",
      icon: Download,
      action: "Exporter mes données"
    },
    {
      title: "Droit d'opposition",
      description: "Vous pouvez vous opposer au traitement de vos données.",
      icon: UserCheck,
      action: "M'opposer au traitement"
    },
    {
      title: "Droit de limitation",
      description: "Vous pouvez demander la limitation du traitement de vos données.",
      icon: Lock,
      action: "Limiter le traitement"
    }
  ];

  const legalBases = [
    {
      basis: "Consentement",
      description: "Vous avez donné votre consentement explicite au traitement de vos données.",
      examples: ["Newsletter", "Cookies marketing", "Communications commerciales"]
    },
    {
      basis: "Exécution du contrat",
      description: "Le traitement est nécessaire à l'exécution d'un contrat avec vous.",
      examples: ["Création de compte", "Matching de candidats", "Services de recrutement"]
    },
    {
      basis: "Intérêt légitime",
      description: "Nous avons un intérêt légitime à traiter vos données.",
      examples: ["Amélioration des services", "Sécurité de la plateforme", "Analytics"]
    },
    {
      basis: "Obligation légale",
      description: "Le traitement est requis par la loi.",
      examples: ["Conservation des données", "Obligations comptables", "Demandes des autorités"]
    }
  ];

  const dataRetention = [
    {
      category: "Données de compte",
      duration: "3 ans après la dernière activité",
      reason: "Gestion de votre compte et historique des interactions"
    },
    {
      category: "Données de candidature",
      duration: "2 ans après la candidature",
      reason: "Suivi des candidatures et statistiques"
    },
    {
      category: "Données de communication",
      duration: "1 an après la dernière communication",
      reason: "Support client et historique des échanges"
    },
    {
      category: "Données analytiques",
      duration: "26 mois",
      reason: "Amélioration des services et analytics"
    }
  ];

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
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Conformité RGPD</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Protection de vos données personnelles
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Document légal</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Conformité européenne</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Dernière mise à jour : 13 Octobre 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              LinkUp respecte scrupuleusement le Règlement Général sur la Protection des Données (RGPD) et s'engage à protéger vos droits fondamentaux.
            </p>
          </motion.div>
        </div>
      </Container>

      {/* Principles Section */}
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
                    <Shield className="w-6 h-6 text-primary" />
                    Principes fondamentaux du RGPD
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Les 6 principes qui guident notre traitement de vos données personnelles
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((principle, index) => (
                      <div key={principle.title} className="bg-muted/50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <principle.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {principle.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {principle.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Legal Bases Section */}
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
                    Bases légales du traitement
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Nous traitons vos données uniquement sur des bases légales claires et transparentes
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {legalBases.map((basis, index) => (
                      <div key={basis.basis} className="bg-card rounded-xl p-6 border border-border">
                        <h3 className="text-xl font-bold text-foreground mb-4">
                          {basis.basis}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                          {basis.description}
                        </p>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 text-sm">Exemples d'utilisation :</h4>
                          <ul className="space-y-2">
                            {basis.examples.map((example, exampleIndex) => (
                              <li key={exampleIndex} className="flex items-center gap-3 text-muted-foreground text-sm">
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
      </section>

      {/* Rights Section */}
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
                    <UserCheck className="w-6 h-6 text-primary" />
                    Vos droits RGPD
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Vous disposez de droits complets sur vos données personnelles
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rights.map((right, index) => (
                      <div key={right.title} className="bg-muted/50 rounded-xl p-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center mb-4">
                          <right.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {right.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                          {right.description}
                        </p>
                        <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white text-sm cursor-pointer">
                          {right.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Data Retention Section */}
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
                    <Lock className="w-6 h-6 text-primary" />
                    Durées de conservation
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Nous ne conservons vos données que le temps nécessaire à leur finalité
                  </p>

                  <div className="bg-card rounded-xl overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type de données</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Durée de conservation</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Justification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {dataRetention.map((item, index) => (
                            <motion.tr
                              key={item.category}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-foreground">
                                {item.category}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {item.duration}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {item.reason}
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

      {/* DPO Contact Section */}
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
                    <FileText className="w-6 h-6 text-primary" />
                    Délégué à la Protection des Données (DPO)
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Notre DPO est votre interlocuteur privilégié pour toute question concernant la protection de vos données personnelles et l'exercice de vos droits RGPD.
                  </p>

                  <div className="bg-card rounded-xl p-8 border border-border text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Contact du DPO
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Notre délégué à la protection des données est à votre disposition pour toute question.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-6">
                      <div className="space-y-2 text-muted-foreground text-sm">
                        <p><strong className="text-foreground">Email :</strong> dpo@linkup.com</p>
                        <p><strong className="text-foreground">Délai de réponse :</strong> 72h maximum</p>
                        <p><strong className="text-foreground">Langues :</strong> Français, Anglais</p>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 px-8 rounded-full cursor-pointer">
                      Contacter le DPO
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Authority Contact Section */}
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
                    Autorité de contrôle
                  </h2>
                  <p className="text-cyan-100 mb-8 leading-relaxed">
                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Commission Nationale de l'Informatique et des Libertés (CNIL)
                    </h3>
                    <div className="space-y-2 text-cyan-100 text-sm">
                      <p><strong>Site web :</strong> www.cnil.fr</p>
                      <p><strong>Formulaire de plainte :</strong> Disponible sur le site de la CNIL</p>
                      <p><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
                    </div>
                  </div>
                  <Button className="bg-white hover:bg-cyan-50 text-cyan-700 font-semibold py-3 px-8 rounded-full cursor-pointer">
                    <Shield className="h-4 w-4 mr-2" />
                    Accéder au site de la CNIL
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

