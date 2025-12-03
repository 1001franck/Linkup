/**
 * Page Contact - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Contact
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "contact@linkup.com",
      description: "Réponse sous 2h en moyenne"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+33 6 95 49 35 23",
      description: "9h-18h, du lundi au vendredi"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: "40 boulevard la marquette",
      description: "Toulouse, France"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: "9h - 18h",
      description: "Lundi au vendredi"
    }
  ];

  const departments = [
    {
      title: "Support Technique",
      email: "support@linkup.com",
      description: "Aide avec la plateforme, bugs, problèmes techniques",
      responseTime: "Réponse sous 2h"
    },
    {
      title: "Ventes & Partenariats",
      email: "sales@linkup.com",
      description: "Devis, tarifs, partenariats entreprise",
      responseTime: "Réponse sous 4h"
    },
    {
      title: "Presse & Communication",
      email: "press@linkup.com",
      description: "Relations presse, interviews, communiqués",
      responseTime: "Réponse sous 24h"
    },
    {
      title: "Carrières",
      email: "careers@linkup.com",
      description: "Candidatures, questions sur nos offres d'emploi",
      responseTime: "Réponse sous 48h"
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
              <MessageCircle className="w-4 h-4" />
              <span>Contactez-nous</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Nous sommes là pour vous aider
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Réponse sous 2h</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Équipe dédiée</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner dans votre transformation RH.
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
              {/* Formulaire de contact */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Send className="w-6 h-6 text-primary" />
                  Envoyez-nous un message
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>

                <div className="bg-muted/50 rounded-xl p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Prénom *
                        </label>
                        <Input
                          type="text"
                          placeholder="Votre prénom"
                          className="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nom *
                        </label>
                        <Input
                          type="text"
                          placeholder="Votre nom"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Entreprise
                      </label>
                      <Input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Sujet *
                      </label>
                      <select className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Sélectionnez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="sales">Ventes & Partenariats</option>
                        <option value="press">Presse & Communication</option>
                        <option value="careers">Carrières</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Décrivez votre demande..."
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        required
                      ></textarea>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white py-4 text-lg font-semibold cursor-pointer">
                      <Send className="h-5 w-5 mr-2" />
                      Envoyer le message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Nos coordonnées */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  Nos coordonnées
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Plusieurs façons de nous contacter selon vos besoins
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <div key={info.title} className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">
                            {info.title}
                          </h3>
                          <p className="text-foreground font-medium mb-1">
                            {info.details}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contactez le bon service */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Contactez le bon service
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Chaque équipe est spécialisée pour vous offrir la meilleure réponse
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept, index) => (
                    <div key={dept.title} className="bg-muted/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {dept.title}
                          </h3>
                          <p className="text-primary font-medium mb-3">
                            {dept.email}
                          </p>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {dept.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {dept.responseTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions fréquentes */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Questions fréquentes
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Trouvez rapidement les réponses aux questions les plus courantes
                </p>

                <div className="space-y-4">
                  {[
                    {
                      question: "Quels sont vos tarifs ?",
                      answer: "Nos tarifs varient selon vos besoins. Contactez notre équipe commerciale pour un devis personnalisé adapté à votre entreprise."
                    },
                    {
                      question: "Proposez-vous un essai gratuit ?",
                      answer: "Oui, nous offrons un essai gratuit de 14 jours sans engagement pour découvrir toutes nos fonctionnalités."
                    },
                    {
                      question: "Comment créer mon compte ?",
                      answer: "La création de votre compte LinkUp est automatique et instantanée. Il vous suffit de vous inscrire avec votre email et vous pouvez commencer à utiliser la plateforme immédiatement."
                    },
                    {
                      question: "Offrez-vous de la formation ?",
                      answer: "Absolument ! Nous proposons des formations personnalisées pour vos équipes ainsi que des ressources d'apprentissage en ligne."
                    }
                  ].map((faq, index) => (
                    <div key={faq.question} className="bg-muted/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

