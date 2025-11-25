/**
 * Page Conseil - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Conseil
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Target, TrendingUp, Users, CheckCircle, Star, Award } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function ConsultingPage() {
  const consultingServices = [
    {
      title: "Transformation RH Digitale",
      duration: "3-6 mois",
      price: "À partir de 15k€",
      description: "Accompagnement complet dans la digitalisation de vos processus RH et l'intégration de nouvelles technologies.",
      features: [
        "Audit des processus actuels",
        "Roadmap de transformation",
        "Sélection d'outils adaptés",
        "Formation des équipes",
        "Suivi et optimisation"
      ],
      icon: Lightbulb,
      deliverables: ["Rapport d'audit", "Plan de transformation", "Formation équipes"]
    },
    {
      title: "Stratégie de Marque Employeur",
      duration: "2-4 mois",
      price: "À partir de 12k€",
      description: "Développez une marque employeur forte qui attire et fidélise les meilleurs talents de votre secteur.",
      features: [
        "Analyse de l'attractivité actuelle",
        "Définition de la proposition de valeur",
        "Stratégie de communication",
        "Mise en place des canaux",
        "Mesure de l'impact"
      ],
      icon: Target,
      deliverables: ["Stratégie marque employeur", "Guide de communication", "Plan d'action"]
    },
    {
      title: "Optimisation du Recrutement",
      duration: "1-3 mois",
      price: "À partir de 8k€",
      description: "Améliorez l'efficacité de votre processus de recrutement et réduisez vos coûts de recrutement.",
      features: [
        "Analyse des processus",
        "Identification des goulots",
        "Optimisation des étapes",
        "Formation des recruteurs",
        "Mise en place d'outils"
      ],
      icon: TrendingUp,
      deliverables: ["Audit processus", "Plan d'optimisation", "Formation équipe"]
    },
    {
      title: "Diversité & Inclusion",
      duration: "2-5 mois",
      price: "À partir de 10k€",
      description: "Intégrez la diversité et l'inclusion dans votre culture d'entreprise et vos pratiques RH.",
      features: [
        "Audit de la diversité actuelle",
        "Formation aux biais inconscients",
        "Processus de recrutement inclusif",
        "Culture d'entreprise inclusive",
        "Mesure et suivi"
      ],
      icon: Users,
      deliverables: ["Plan D&I", "Formations", "Indicateurs de suivi"]
    }
  ];

  const methodology = [
    {
      step: "01",
      title: "Diagnostic",
      description: "Analyse approfondie de votre situation actuelle et identification des opportunités d'amélioration."
    },
    {
      step: "02",
      title: "Stratégie",
      description: "Définition d'une stratégie personnalisée avec des objectifs clairs et mesurables."
    },
    {
      step: "03",
      title: "Implémentation",
      description: "Mise en œuvre progressive avec accompagnement et formation de vos équipes."
    },
    {
      step: "04",
      title: "Suivi",
      description: "Mesure des résultats et ajustements continus pour garantir le succès."
    }
  ];

  const testimonials = [
    {
      name: "Claire Moreau",
      role: "DRH, FinTech Corp",
      content: "L'accompagnement de LinkUp nous a permis de réduire notre temps de recrutement de 50% tout en améliorant la qualité des candidats.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      name: "Pierre Dubois",
      role: "CEO, StartupTech",
      content: "Grâce à leur expertise, nous avons développé une marque employeur qui nous permet d'attirer les meilleurs talents du marché.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    }
  ];

  const experts = [
    {
      name: "Marie Dubois",
      role: "Senior Consultant RH",
      expertise: "Transformation digitale, IA RH",
      experience: "12 ans",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Thomas Martin",
      role: "Expert Marque Employeur",
      expertise: "Communication RH, Employer Branding",
      experience: "8 ans",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Fatima Alami",
      role: "Consultante D&I",
      expertise: "Diversité, Inclusion, Culture d'entreprise",
      experience: "10 ans",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
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
              Conseil RH Expert
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent mb-8 leading-tight"
            >
              Accompagnement RH sur mesure
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed"
            >
              Nos experts RH vous accompagnent dans la transformation de vos pratiques pour attirer, recruter et fidéliser les meilleurs talents.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Demander un devis
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-semibold py-4 px-8 rounded-full">
                Consultation gratuite
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Nos services de conseil
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Des solutions personnalisées pour transformer vos pratiques RH
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {consultingServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <span>{service.duration}</span>
                      <span>•</span>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">{service.price}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Ce qui est inclus :</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Livrables :</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.deliverables.map((deliverable, deliverableIndex) => (
                      <span key={deliverableIndex} className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-sm">
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                  En savoir plus
                </Button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Methodology Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Notre méthodologie
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Une approche structurée et éprouvée pour garantir le succès de votre transformation RH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Experts Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Nos experts
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Une équipe d'experts RH reconnus pour leur expertise et leur expérience terrain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experts.map((expert, index) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
              >
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {expert.name}
                </h3>
                <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-2">
                  {expert.role}
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {expert.expertise}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Award className="h-4 w-4" />
                  {expert.experience} d'expérience
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Témoignages clients
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Découvrez comment nos clients ont transformé leurs pratiques RH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-current"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
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
              Prêt à transformer vos pratiques RH ?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Contactez nos experts pour une consultation gratuite et découvrez comment nous pouvons vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Consultation gratuite
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white dark:text-white hover:bg-white hover:text-cyan-700 font-semibold py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm">
                Télécharger notre brochure
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

