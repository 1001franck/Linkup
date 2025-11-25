/**
 * Page Article - De photographe à directeur créatif : les clés de l'évolution
 * Respect des principes SOLID, KISS et DRY
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2, BookOpen, Camera, TrendingUp, Target, Users, Lightbulb, Award } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function PhotographeDirecteurCreatifPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
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
              <User className="w-4 h-4" />
              <span>Témoignage</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Témoignage : De photographe freelance à directeur créatif chez TechCorp
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Alexandre Chen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <span>Directeur Créatif @ TechCorp</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Alexandre nous raconte comment LinkUp l'a aidé à transformer sa carrière de photographe freelance en poste de direction créative.
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
                src="/assets/graphiste_testimonials.jpg" 
                alt="Directeur créatif professionnel" 
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
                <h2 className="text-2xl font-bold mb-4 text-foreground">Mon parcours avec LinkUp</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "Il y a 3 ans, j'étais photographe freelance, jonglant entre différents clients 
                  sans vision claire de mon évolution de carrière. Aujourd'hui, je suis directeur 
                  créatif chez TechCorp, et c'est en grande partie grâce à LinkUp que j'ai pu 
                  transformer ma carrière. Je vous raconte mon parcours."
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Ma découverte de LinkUp
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "J'ai découvert LinkUp par hasard, en cherchant des opportunités de collaboration 
                  avec des entreprises tech. Ce qui m'a immédiatement séduit, c'est la qualité 
                  des profils d'entreprises et la transparence des offres."
                </p>
                <div className="bg-muted/50 rounded-xl p-6 mb-4">
                  <h3 className="font-semibold text-foreground mb-3">Ce qui m'a convaincu :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Des entreprises qui valorisent vraiment la créativité</li>
                    <li>• Des offres détaillées avec les vraies attentes</li>
                    <li>• Un processus de candidature simple et efficace</li>
                    <li>• Une communauté de créatifs inspirants</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Mon premier poste chez TechCorp
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "Grâce à LinkUp, j'ai postulé pour un poste de photographe corporate chez TechCorp. 
                  L'équipe RH a été impressionnée par mon portfolio et ma vision créative. 
                  C'était exactement le type d'entreprise que je cherchais."
                </p>
                <div className="bg-muted/50 rounded-xl p-6 mb-4">
                  <h3 className="font-semibold text-foreground mb-3">Ce qui a fait la différence :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Mon profil LinkUp était complet et professionnel</li>
                    <li>• J'ai pu échanger directement avec l'équipe créative</li>
                    <li>• L'entreprise a apprécié ma démarche proactive</li>
                    <li>• Le processus de recrutement était transparent</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Mon évolution vers la direction</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "En 2 ans, j'ai évolué de photographe à directeur créatif. LinkUp m'a aidé 
                  à comprendre les enjeux business et à développer mes compétences de leadership."
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Formation continue</h3>
                    <p className="text-muted-foreground text-sm">
                      J'ai suivi les formations recommandées par LinkUp sur le management 
                      créatif et la stratégie business.
                    </p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Réseau professionnel</h3>
                    <p className="text-muted-foreground text-sm">
                      La communauté LinkUp m'a permis de rencontrer d'autres directeurs créatifs 
                      et d'échanger sur les bonnes pratiques.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Les avantages de LinkUp</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "LinkUp ne m'a pas seulement aidé à trouver un emploi, mais aussi à 
                  construire ma carrière sur le long terme."
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">Mentoring et conseils</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Les conseils d'experts LinkUp m'ont aidé à préparer mes entretiens 
                      et à négocier mon salaire.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">Communauté active</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      J'ai pu échanger avec d'autres professionnels et apprendre de leurs 
                      expériences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Mes conseils pour réussir
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "Pour ceux qui veulent suivre un parcours similaire, voici mes conseils 
                  basés sur mon expérience avec LinkUp."
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3">Mes recommandations :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Créez un profil LinkUp complet et authentique</li>
                    <li>• Soyez proactif dans vos candidatures et vos échanges</li>
                    <li>• Utilisez les ressources de formation de LinkUp</li>
                    <li>• Participez à la communauté et échangez avec d'autres professionnels</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary" />
                  Aujourd'hui chez TechCorp
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "Aujourd'hui, je dirige une équipe de 8 créatifs et je suis fier de ce 
                  que nous accomplissons ensemble. LinkUp a été le déclic de ma carrière."
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Équipe créative</h4>
                    <p className="text-muted-foreground text-sm">8 créatifs talentueux sous ma direction</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Projets innovants</h4>
                    <p className="text-muted-foreground text-sm">Campagnes créatives primées</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2">Évolution continue</h4>
                    <p className="text-muted-foreground text-sm">Formation et développement d'équipe</p>
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Mon message à la communauté LinkUp</h2>
                <p className="text-muted-foreground leading-relaxed">
                  "Si vous me l'aviez dit il y a 3 ans, je n'aurais jamais cru que je deviendrais 
                  directeur créatif. LinkUp a transformé ma vision de ma carrière et m'a donné 
                  les outils pour réussir. Aujourd'hui, je recommande LinkUp à tous les créatifs 
                  qui veulent évoluer. C'est plus qu'une plateforme de recrutement, c'est un 
                  véritable partenaire de carrière. Merci LinkUp pour cette transformation !"
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
                <h3 className="text-xl font-bold text-foreground mb-2">Alexandre Chen</h3>
                <p className="text-muted-foreground mb-3">
                  Directeur Créatif chez TechCorp, ancien photographe freelance. 
                  Membre de la communauté LinkUp depuis 2021, il partage son expérience 
                  pour inspirer d'autres créatifs à évoluer dans leur carrière.
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
              <h3 className="text-2xl font-bold mb-4">Prêt à évoluer dans votre carrière créative ?</h3>
              <p className="text-cyan-100 mb-6">
                Découvrez nos offres d'emploi dans le secteur créatif et trouvez le poste qui correspond à vos ambitions.
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
