/**
 * Page À propos - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page À propos
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Target, Award, Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function AboutPage() {
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
              <span>À propos de LinkUp</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Connecter les talents aux opportunités
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Notre mission</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Depuis 2025</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              LinkUp révolutionne le recrutement en créant des connexions authentiques entre les talents et les entreprises qui partagent leurs valeurs.
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
              {/* Notre Mission */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Notre Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Chez LinkUp, nous croyons que chaque talent mérite de trouver sa place idéale. 
                  Notre mission est de transformer le recrutement en créant des connexions 
                  authentiques et durables.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Nous utilisons la technologie pour humaniser le processus de recrutement, 
                  en mettant l'accent sur la compatibilité culturelle et les valeurs partagées.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-foreground">50k+</h3>
                    <p className="text-muted-foreground text-sm">Talents connectés</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-foreground">500+</h3>
                    <p className="text-muted-foreground text-sm">Entreprises partenaires</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-foreground">95%</h3>
                    <p className="text-muted-foreground text-sm">Taux de satisfaction</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-foreground">24h</h3>
                    <p className="text-muted-foreground text-sm">Temps de réponse moyen</p>
                  </div>
                </div>
              </div>

              {/* Nos Valeurs */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Nos Valeurs
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Les principes qui guident notre action et façonnent notre culture d'entreprise
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Authenticité",
                      description: "Nous privilégions la transparence et l'authenticité dans toutes nos interactions, créant un environnement de confiance mutuelle.",
                      icon: Users
                    },
                    {
                      title: "Innovation",
                      description: "Nous repoussons les limites du recrutement traditionnel en utilisant les dernières technologies pour améliorer l'expérience.",
                      icon: Target
                    },
                    {
                      title: "Impact",
                      description: "Chaque connexion que nous créons a un impact positif sur la vie des talents et le succès des entreprises.",
                      icon: Award
                    }
                  ].map((value, index) => (
                    <div key={value.title} className="bg-muted/50 rounded-xl p-6">
                      <value.icon className="h-8 w-8 text-primary mb-4" />
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
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
                Rejoignez l'aventure LinkUp
              </h2>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Découvrez comment nous transformons le recrutement et créez des connexions qui comptent
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold cursor-pointer">
                  Découvrir nos offres
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-700 font-semibold cursor-pointer">
                  Nous contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

