/**
 * Page Carrières - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Carrières
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Users, Heart, Zap, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Développeur Frontend Senior",
      department: "Engineering",
      location: "Toulouse, France",
      type: "CDI",
      description: "Rejoignez notre équipe pour construire l'interface utilisateur de la prochaine génération de plateformes de recrutement.",
      requirements: ["React", "TypeScript", "Next.js", "5+ ans d'expérience"],
      benefits: ["Télétravail flexible", "Équipement haut de gamme", "Formation continue"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Paris, France",
      type: "CDI",
      description: "Dirigez la stratégie produit et travaillez avec nos équipes pour créer des expériences utilisateur exceptionnelles.",
      requirements: ["3+ ans en Product Management", "Expérience B2B", "Analytics", "Agile"],
      benefits: ["Participation aux bénéfices", "Congés illimités", "Budget formation"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "CDI",
      description: "Créez des interfaces intuitives et engageantes qui transforment l'expérience de recrutement.",
      requirements: ["Figma", "Design System", "User Research", "Prototyping"],
      benefits: ["Travail 100% remote", "Budget design", "Conférences UX"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Bien-être",
      description: "Assurance santé premium, mutuelle, et programmes de bien-être mental"
    },
    {
      icon: Zap,
      title: "Croissance",
      description: "Budget formation, conférences, et mentorat pour votre développement"
    },
    {
      icon: Globe,
      title: "Flexibilité",
      description: "Télétravail, horaires flexibles, et congés illimités"
    },
    {
      icon: Users,
      title: "Équipe",
      description: "Environnement collaboratif avec des talents passionnés"
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
              <Users className="w-4 h-4" />
              <span>Rejoignez notre équipe</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Construisez l'avenir du recrutement
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Toulouse, Paris, Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Postes ouverts</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Rejoignez une équipe passionnée qui révolutionne la façon dont les talents et les entreprises se connectent.
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
              {/* Pourquoi rejoindre LinkUp */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Pourquoi rejoindre LinkUp ?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous offrons un environnement de travail exceptionnel où vous pouvez grandir et avoir un impact réel
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={benefit.title} className="bg-muted/50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offres d'emploi */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Offres d'emploi
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Découvrez les opportunités qui vous attendent chez LinkUp
                </p>

                <div className="space-y-6">
                  {jobOpenings.map((job, index) => (
                    <div key={job.title} className="bg-muted/50 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {job.department}
                            </div>
                          </div>
                        </div>
                        <Button className="mt-4 lg:mt-0 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white cursor-pointer">
                          Postuler
                        </Button>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Compétences requises</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Avantages</h4>
                          <ul className="space-y-2">
                            {job.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
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

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Vous ne trouvez pas votre poste idéal ?
              </h2>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Envoyez-nous votre candidature spontanée et rejoignez notre talent pool
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold cursor-pointer">
                  Candidature spontanée
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-700 font-semibold cursor-pointer">
                  Nous suivre
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

