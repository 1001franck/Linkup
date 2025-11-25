/**
 * Page Formation - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Formation
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Award, Clock, Play, CheckCircle, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function TrainingPage() {
  const trainingPrograms = [
    {
      title: "Recrutement Digital & IA",
      duration: "2 jours",
      level: "Intermédiaire",
      price: "890€",
      description: "Maîtrisez les outils de recrutement digital et l'intelligence artificielle pour optimiser vos processus RH.",
      features: [
        "Outils de sourcing digital",
        "IA et matching de candidats",
        "Analyse de données RH",
        "Automatisation des processus"
      ],
      instructor: "Marie Dubois",
      rating: 4.9,
      students: 156,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Marque Employeur & Attractivité",
      duration: "1 jour",
      level: "Débutant",
      price: "490€",
      description: "Développez une marque employeur forte pour attirer et fidéliser les meilleurs talents.",
      features: [
        "Stratégie de marque employeur",
        "Communication RH digitale",
        "Expérience candidat",
        "Mesure de l'attractivité"
      ],
      instructor: "Thomas Martin",
      rating: 4.8,
      students: 203,
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Diversité & Inclusion",
      duration: "1.5 jours",
      level: "Tous niveaux",
      price: "690€",
      description: "Intégrez la diversité et l'inclusion dans vos pratiques RH pour créer des équipes plus performantes.",
      features: [
        "Biais inconscients",
        "Processus de recrutement inclusif",
        "Culture d'entreprise inclusive",
        "Mesure de la diversité"
      ],
      instructor: "Fatima Alami",
      rating: 4.9,
      students: 98,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Analytics RH & Tableaux de Bord",
      duration: "2.5 jours",
      level: "Avancé",
      price: "1290€",
      description: "Transformez vos données RH en insights actionnables avec des tableaux de bord performants.",
      features: [
        "Collecte et analyse de données",
        "KPIs RH essentiels",
        "Tableaux de bord interactifs",
        "Reporting automatisé"
      ],
      instructor: "Julien Moreau",
      rating: 4.7,
      students: 87,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const onlineCourses = [
    {
      title: "Introduction au Recrutement Moderne",
      duration: "3h",
      price: "99€",
      description: "Les fondamentaux du recrutement à l'ère digitale",
      modules: 8,
      students: 1247
    },
    {
      title: "LinkedIn Recruiting Masterclass",
      duration: "2h",
      price: "79€",
      description: "Optimisez votre sourcing sur LinkedIn",
      modules: 6,
      students: 892
    },
    {
      title: "Entretiens Vidéo Efficaces",
      duration: "1.5h",
      price: "59€",
      description: "Maîtrisez les entretiens à distance",
      modules: 5,
      students: 634
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Certification",
      description: "Obtenez une certification reconnue par l'industrie"
    },
    {
      icon: Users,
      title: "Réseau",
      description: "Rejoignez une communauté de professionnels RH"
    },
    {
      icon: BookOpen,
      title: "Ressources",
      description: "Accès à une bibliothèque de ressources exclusives"
    },
    {
      icon: Clock,
      title: "Flexibilité",
      description: "Formations en présentiel et en ligne disponibles"
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
              Formation RH
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-cyan-800 to-slate-900 dark:from-white dark:via-cyan-300 dark:to-white bg-clip-text text-transparent mb-8 leading-tight"
            >
              Formez vos équipes RH
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed"
            >
              Développez les compétences de vos équipes RH avec nos formations expertes sur le recrutement moderne, l'IA et les nouvelles technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Voir toutes les formations
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-200 dark:border-cyan-700 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 font-semibold py-4 px-8 rounded-full">
                Formation sur mesure
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Pourquoi choisir nos formations ?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Des formations pratiques et expertes pour transformer vos pratiques RH
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Training Programs Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Formations en présentiel
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Des formations interactives avec nos experts pour approfondir vos compétences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
                      {program.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {program.price}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(program.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
                        {program.rating} ({program.students} participants)
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {program.instructor}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-8">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                    S'inscrire
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Online Courses Section */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Formations en ligne
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Apprenez à votre rythme avec nos cours en ligne accessibles 24h/24
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {onlineCourses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                    {course.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {course.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {course.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    {course.modules} modules
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    {course.students} étudiants
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                  Commencer
                </Button>
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
              Prêt à développer vos compétences RH ?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Rejoignez plus de 2000 professionnels RH qui ont déjà suivi nos formations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Voir le catalogue complet
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white dark:text-white hover:bg-white hover:text-cyan-700 font-semibold py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm">
                Formation sur mesure
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

