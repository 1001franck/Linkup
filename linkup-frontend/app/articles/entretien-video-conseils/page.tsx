/**
 * Page Article - 10 conseils pour réussir votre entretien vidéo
 * Respect des principes SOLID, KISS et DRY
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2, BookOpen, Video, CheckCircle, Lightbulb, Wifi, Camera, Mic } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function EntretienVideoConseilsPage() {
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
              <BookOpen className="w-4 h-4" />
              <span>Article</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              10 conseils pour réussir votre entretien vidéo
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Marie Dubois</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Career Coach</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez les meilleures pratiques pour briller lors de vos entretiens à distance et impressionner vos recruteurs.
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
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&h=400&fit=crop&crop=center" 
                alt="Entretien vidéo professionnel" 
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
                  Les entretiens vidéo sont devenus la norme dans le processus de recrutement. 
                  Maîtriser cet exercice est essentiel pour décrocher le poste de vos rêves. 
                  Voici 10 conseils pratiques pour réussir vos entretiens à distance.
                </p>
              </div>

              {/* Conseil 1 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  1. Testez votre équipement à l'avance
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vérifiez votre caméra, micro et connexion internet au moins 30 minutes avant l'entretien.
                </p>
                <div className="bg-muted/50 rounded-xl p-6 mb-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Checklist technique :
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Testez votre connexion internet (minimum 5 Mbps)</li>
                    <li>• Vérifiez le bon fonctionnement de votre caméra</li>
                    <li>• Testez votre micro et ajustez le volume</li>
                    <li>• Fermez toutes les applications inutiles</li>
                  </ul>
                </div>
              </div>

              {/* Conseil 2 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Camera className="w-6 h-6 text-primary" />
                  2. Préparez votre environnement
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Votre arrière-plan et votre éclairage sont cruciaux pour une première impression positive.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Éclairage optimal</h3>
                    <p className="text-muted-foreground text-sm">
                      Placez-vous face à une source de lumière naturelle ou utilisez un éclairage 
                      artificiel doux. Évitez les contre-jours.
                    </p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">Arrière-plan neutre</h3>
                    <p className="text-muted-foreground text-sm">
                      Choisissez un arrière-plan professionnel et épuré. Évitez les éléments 
                      distrayants ou personnels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conseil 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Mic className="w-6 h-6 text-primary" />
                  3. Habillez-vous professionnellement
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Même à distance, votre tenue doit être adaptée au poste et à l'entreprise. 
                  Habillez-vous comme pour un entretien en présentiel.
                </p>
              </div>

              {/* Conseil 4 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Positionnez-vous correctement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Votre positionnement devant la caméra influence la perception de votre professionnalisme.
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">Cadrage optimal</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Positionnez la caméra à hauteur des yeux, à environ 50-60 cm de votre visage. 
                      Votre visage doit occuper 1/3 de l'écran.
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-medium text-foreground">Posture professionnelle</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Asseyez-vous droit, les épaules détendues. Évitez de vous pencher vers l'écran 
                      ou de vous reculer trop.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conseil 5 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Maintenez le contact visuel</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Regardez la caméra, pas l'écran. Cela donne l'impression que vous regardez 
                  directement votre interlocuteur dans les yeux.
                </p>
              </div>

              {/* Conseil 6 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Gérez les silences</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Les silences sont plus déstabilisants en vidéo. Préparez des questions et 
                  des exemples concrets pour maintenir la fluidité de l'échange.
                </p>
              </div>

              {/* Conseil 7 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Utilisez des notes discrètement</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Préparez des notes avec vos points clés, mais évitez de les lire directement. 
                  Elles doivent servir de support, pas de téléprompter.
                </p>
              </div>

              {/* Conseil 8 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Testez la plateforme</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Familiarisez-vous avec l'outil utilisé (Zoom, Teams, Google Meet) avant l'entretien. 
                  Testez les fonctionnalités de partage d'écran si nécessaire.
                </p>
              </div>

              {/* Conseil 9 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Éliminez les distractions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Fermez les notifications, mettez votre téléphone en silencieux et assurez-vous 
                  qu'aucune interruption ne viendra perturber l'entretien.
                </p>
              </div>

              {/* Conseil 10 */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  10. Restez authentique et souriez
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  La distance ne doit pas vous empêcher d'être vous-même. Sourire et montrer 
                  votre personnalité sont essentiels pour créer une connexion avec le recruteur.
                </p>
              </div>

              {/* Conclusion */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Conclusion</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Réussir un entretien vidéo nécessite une préparation minutieuse et une attention 
                  particulière aux détails techniques. En suivant ces 10 conseils, vous maximisez 
                  vos chances de faire une excellente impression et de décrocher le poste de vos rêves. 
                  N'oubliez pas : la technologie ne doit jamais remplacer votre personnalité et 
                  votre professionnalisme.
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
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Marie Dubois</h3>
                <p className="text-muted-foreground mb-3">
                  Career Coach spécialisée dans la préparation aux entretiens d'embauche. 
                  Experte en communication professionnelle et développement de carrière.
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
              <h3 className="text-2xl font-bold mb-4">Prêt pour votre prochain entretien ?</h3>
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