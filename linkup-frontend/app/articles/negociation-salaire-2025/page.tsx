/**
 * Page Article - Comment négocier son salaire en 2025
 * Respect des principes SOLID, KISS et DRY
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2, BookOpen, TrendingUp, Target, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NegociationSalairePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
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
              <BookOpen className="w-4 h-4" />
              <span>Article</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Comment négocier son salaire en 2025
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Agathe Collinet</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6 min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>HelloWork</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Les stratégies gagnantes pour obtenir la rémunération que vous méritez et faire valoir votre expertise.
            </p>
          </motion.div>

          {/* Article Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&h=400&fit=crop&crop=center" 
                alt="Négociation salaire professionnel" 
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-foreground">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  La négociation salariale est un art qui se perfectionne avec l'expérience. En 2025, 
                  avec l'évolution du marché du travail et l'émergence de nouveaux secteurs, les 
                  stratégies de négociation ont évolué. Voici comment maximiser vos chances d'obtenir 
                  la rémunération que vous méritez.
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  1. Préparer sa négociation
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  La préparation est la clé du succès. Avant toute négociation, vous devez :
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Rechercher les salaires moyens de votre poste dans votre secteur</li>
                  <li>Évaluer vos compétences et votre valeur ajoutée</li>
                  <li>Préparer des arguments concrets basés sur vos réalisations</li>
                  <li>Définir votre fourchette salariale acceptable</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  2. Les nouvelles tendances 2025
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Le marché du travail en 2025 présente des spécificités à prendre en compte :
                </p>
                <div className="bg-muted/50 rounded-xl p-6 mb-4">
                  <h3 className="font-semibold text-foreground mb-3">Points clés à retenir :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• La pénurie de talents dans certains secteurs favorise les candidats</li>
                    <li>• L'importance croissante des compétences techniques et soft skills</li>
                    <li>• La flexibilité du travail (remote, hybride) comme argument de négociation</li>
                    <li>• L'évolution des packages de rémunération (actions, bonus, avantages)</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Stratégies de négociation</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Approche collaborative</h3>
                    <p className="text-muted-foreground text-sm">
                      Présentez la négociation comme un partenariat où les deux parties gagnent. 
                      Montrez comment votre rémunération s'aligne sur la valeur que vous apportez.
                    </p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Données et preuves</h3>
                    <p className="text-muted-foreground text-sm">
                      Utilisez des données du marché, des benchmarks sectoriels et vos 
                      réalisations concrètes pour étayer vos demandes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Gérer les objections</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Anticipez les objections courantes et préparez vos réponses :
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">"Le budget est serré"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Proposez des alternatives : augmentation progressive, bonus de performance, 
                      avantages en nature, ou formation.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">"C'est au-dessus du marché"</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Présentez vos données de marché et mettez en avant votre expertise unique 
                      et vos résultats exceptionnels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Conclusion</h2>
                <p className="text-muted-foreground leading-relaxed">
                  La négociation salariale en 2025 nécessite une approche stratégique et bien préparée. 
                  En vous appuyant sur des données concrètes, en valorisant votre expertise unique et 
                  en adoptant une approche collaborative, vous maximisez vos chances d'obtenir la 
                  rémunération que vous méritez. N'oubliez pas : négocier, c'est aussi négocier pour 
                  votre avenir professionnel.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Author Bio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-border"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Agathe Collinet</h3>
                <p className="text-muted-foreground mb-3">
                  Experte en ressources humaines et coach carrière chez HelloWork. 
                  Spécialisée dans la négociation salariale et l'évolution professionnelle.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="cursor-pointer">
                    Suivre
                  </Button>
                  <Button size="sm" variant="outline" className="cursor-pointer">
                    Voir le profil
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Prêt à négocier votre salaire ?</h3>
              <p className="text-cyan-100 mb-6">
                Découvrez nos offres d'emploi et trouvez le poste qui correspond à vos ambitions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jobs" className="cursor-pointer">
                  <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold">
                    Explorer les offres
                  </Button>
                </Link>
                <Link href="/register" className="cursor-pointer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-700">
                    Créer mon profil
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
