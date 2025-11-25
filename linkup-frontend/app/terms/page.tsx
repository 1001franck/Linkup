/**
 * Page Conditions d'utilisation - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Conditions
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, Users, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function TermsPage() {
  const sections = [
    {
      title: "Acceptation des conditions",
      icon: CheckCircle,
      content: "En utilisant LinkUp, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services."
    },
    {
      title: "Utilisation autorisée",
      icon: Users,
      content: "Vous vous engagez à utiliser LinkUp de manière légale et éthique, en respectant les droits d'autrui et les lois applicables."
    },
    {
      title: "Propriété intellectuelle",
      icon: Shield,
      content: "Tous les contenus de LinkUp sont protégés par des droits de propriété intellectuelle. Vous ne pouvez pas les copier sans autorisation."
    },
    {
      title: "Limitation de responsabilité",
      icon: AlertTriangle,
      content: "LinkUp ne peut être tenu responsable des dommages indirects résultant de l'utilisation de nos services."
    }
  ];

  const userObligations = [
    {
      title: "Informations exactes",
      description: "Vous devez fournir des informations exactes et à jour lors de la création de votre compte."
    },
    {
      title: "Respect des autres utilisateurs",
      description: "Vous vous engagez à respecter tous les autres utilisateurs de la plateforme."
    },
    {
      title: "Utilisation conforme",
      description: "Vous ne devez pas utiliser LinkUp à des fins illégales ou non autorisées."
    },
    {
      title: "Sécurité du compte",
      description: "Vous êtes responsable de la sécurité de votre compte et de votre mot de passe."
    },
    {
      title: "Contenu approprié",
      description: "Tout contenu que vous publiez doit être approprié et respectueux."
    },
    {
      title: "Respect de la confidentialité",
      description: "Vous ne devez pas partager les informations personnelles d'autres utilisateurs."
    }
  ];

  const prohibitedUses = [
    "Publier du contenu illégal, offensant ou inapproprié",
    "Harceler, menacer ou intimider d'autres utilisateurs",
    "Utiliser des informations d'autrui sans autorisation",
    "Tenter de contourner les mesures de sécurité",
    "Utiliser des robots ou scripts automatisés",
    "Vendre ou transférer votre compte à un tiers",
    "Créer de faux profils ou identités",
    "Violer les droits de propriété intellectuelle"
  ];

  const terminationReasons = [
    {
      reason: "Violation des conditions",
      description: "Non-respect des conditions d'utilisation ou des règles de la communauté"
    },
    {
      reason: "Activité frauduleuse",
      description: "Utilisation frauduleuse ou malveillante de la plateforme"
    },
    {
      reason: "Demande de l'utilisateur",
      description: "Fermeture de compte à la demande de l'utilisateur"
    },
    {
      reason: "Inactivité prolongée",
      description: "Compte inactif pendant plus de 24 mois"
    }
  ];

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
              <FileText className="w-4 h-4" />
              <span>Conditions d'utilisation</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Conditions d'utilisation de LinkUp
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>Document légal</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Dernière mise à jour : 13 Octobre 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ces conditions régissent votre utilisation de LinkUp et définissent les droits et obligations de toutes les parties.
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
              {/* Aperçu des conditions */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Aperçu des conditions</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Les points essentiels de nos conditions d'utilisation
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections.map((section, index) => (
                    <div key={section.title} className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <section.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-2">
                            {section.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vos obligations */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Vos obligations
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  En utilisant LinkUp, vous vous engagez à respecter ces obligations
                </p>
                
                <div className="space-y-4">
                  {userObligations.map((obligation, index) => (
                    <div key={obligation.title} className="border-l-4 border-primary pl-4">
                      <p className="font-medium text-foreground">{obligation.title}</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {obligation.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilisations interdites */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  Utilisations interdites
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Ces activités sont strictement interdites sur LinkUp
                </p>
                
                <div className="bg-muted/50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prohibitedUses.map((use, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suspension et résiliation */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                  Suspension et résiliation
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Les conditions dans lesquelles votre compte peut être suspendu ou fermé
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {terminationReasons.map((reason, index) => (
                    <div key={reason.reason} className="bg-background border border-border rounded-xl p-6">
                      <h3 className="font-semibold text-foreground mb-3">{reason.reason}</h3>
                      <p className="text-muted-foreground text-sm">
                        {reason.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informations légales */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Scale className="w-6 h-6 text-primary" />
                  Informations légales
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Droit applicable
                    </h3>
                    <p className="text-muted-foreground">
                      Ces conditions sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux français.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Modification des conditions
                    </h3>
                    <p className="text-muted-foreground">
                      LinkUp se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur la plateforme.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Contact
                    </h3>
                    <p className="text-muted-foreground">
                      Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse : legal@linkup.com
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Divisibilité
                    </h3>
                    <p className="text-muted-foreground">
                      Si une disposition de ces conditions est jugée invalide, les autres dispositions resteront en vigueur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Questions sur nos conditions ?</h3>
              <p className="text-cyan-100 mb-6">
                Notre équipe juridique est à votre disposition pour toute clarification
              </p>
              <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold cursor-pointer">
                <FileText className="h-5 w-5 mr-2" />
                Contacter l'équipe juridique
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

