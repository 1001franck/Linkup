/**
 * Page Confidentialité - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Confidentialité
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, FileText, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Collecte des données",
      icon: Database,
      content: "Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services et à l'amélioration de votre expérience utilisateur."
    },
    {
      title: "Utilisation des données",
      icon: Eye,
      content: "Vos données sont utilisées pour personnaliser votre expérience, améliorer nos services et vous proposer des opportunités pertinentes."
    },
    {
      title: "Protection des données",
      icon: Shield,
      content: "Nous mettons en place des mesures de sécurité strictes pour protéger vos données contre tout accès non autorisé ou toute divulgation."
    },
    {
      title: "Vos droits",
      icon: UserCheck,
      content: "Vous disposez de droits complets sur vos données : accès, rectification, suppression et portabilité conformément au RGPD."
    }
  ];

  const dataTypes = [
    {
      category: "Données d'identification",
      examples: ["Nom, prénom", "Adresse email", "Numéro de téléphone", "Photo de profil"],
      purpose: "Création et gestion de votre compte"
    },
    {
      category: "Données professionnelles",
      examples: ["CV, compétences", "Expérience professionnelle", "Formation", "Préférences d'emploi"],
      purpose: "Matching avec les offres d'emploi"
    },
    {
      category: "Données d'usage",
      examples: ["Pages visitées", "Recherches effectuées", "Candidatures", "Interactions avec la plateforme"],
      purpose: "Amélioration de l'expérience utilisateur"
    },
    {
      category: "Données techniques",
      examples: ["Adresse IP", "Type de navigateur", "Système d'exploitation", "Cookies"],
      purpose: "Fonctionnement technique et sécurité"
    }
  ];

  const rights = [
    {
      title: "Droit d'accès",
      description: "Vous pouvez demander à tout moment quelles données personnelles nous détenons sur vous."
    },
    {
      title: "Droit de rectification",
      description: "Vous pouvez corriger ou mettre à jour vos données personnelles à tout moment."
    },
    {
      title: "Droit à l'effacement",
      description: "Vous pouvez demander la suppression de vos données personnelles dans certaines circonstances."
    },
    {
      title: "Droit à la portabilité",
      description: "Vous pouvez récupérer vos données dans un format structuré et lisible par machine."
    },
    {
      title: "Droit d'opposition",
      description: "Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes."
    },
    {
      title: "Droit de limitation",
      description: "Vous pouvez demander la limitation du traitement de vos données dans certaines situations."
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
              <Shield className="w-4 h-4" />
              <span>Politique de confidentialité</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Protection de vos données personnelles
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Document légal</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Dernière mise à jour : 13 Octobre 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Chez LinkUp, nous nous engageons à protéger votre vie privée et à traiter vos données personnelles avec le plus grand respect et transparence.
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
              {/* Notre engagement */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Notre engagement</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Transparence, sécurité et respect de vos droits fondamentaux
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

              {/* Quelles données collectons-nous ? */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Database className="w-6 h-6 text-primary" />
                  Quelles données collectons-nous ?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous collectons uniquement les données nécessaires à nos services
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dataTypes.map((dataType, index) => (
                    <div key={dataType.category} className="bg-background border border-border rounded-xl p-6">
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {dataType.category}
                      </h3>
                      <p className="text-primary font-medium mb-4">
                        {dataType.purpose}
                      </p>
                      <ul className="space-y-2">
                        {dataType.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-center gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vos droits */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-primary" />
                  Vos droits
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Conformément au RGPD, vous disposez de droits complets sur vos données personnelles
                </p>
                
                <div className="space-y-4">
                  {rights.map((right, index) => (
                    <div key={right.title} className="border-l-4 border-primary pl-4">
                      <p className="font-medium text-foreground">{right.title}</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        {right.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sécurité de vos données */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Sécurité de vos données
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous mettons en place des mesures de sécurité de niveau bancaire pour protéger vos données
                </p>
                
                <div className="bg-muted/50 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Chiffrement SSL/TLS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Sauvegarde sécurisée</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Surveillance 24/7</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Accès restreint</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Audit régulier</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Conformité RGPD</span>
                      </div>
                    </div>
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
              <h3 className="text-2xl font-bold mb-4">Questions sur vos données ?</h3>
              <p className="text-cyan-100 mb-6">
                Notre DPO est à votre disposition pour toute question concernant la protection de vos données
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <Mail className="h-6 w-6 text-cyan-100" />
                <span className="text-lg font-medium">
                  dpo@linkup.com
                </span>
              </div>
              <p className="text-cyan-100 mb-6">
                Réponse garantie sous 72h pour toute demande concernant vos données personnelles
              </p>
              <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold cursor-pointer">
                <Mail className="h-5 w-5 mr-2" />
                Contacter le DPO
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

