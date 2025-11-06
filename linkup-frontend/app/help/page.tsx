/**
 * Page Centre d'aide - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Centre d'aide
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, HelpCircle, MessageCircle, BookOpen, Video, FileText, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Premiers pas",
      description: "Guide de démarrage et configuration de votre compte",
      icon: BookOpen,
      articles: 12,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "Recrutement",
      description: "Créer des offres, gérer les candidatures et optimiser vos processus",
      icon: HelpCircle,
      articles: 18,
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Outils & Fonctionnalités",
      description: "Maîtriser tous les outils et fonctionnalités de la plateforme",
      icon: FileText,
      articles: 25,
      color: "from-cyan-500 to-teal-600"
    },
    {
      title: "Intégrations",
      description: "Connecter LinkUp à vos outils existants",
      icon: MessageCircle,
      articles: 8,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const popularArticles = [
    {
      title: "Comment créer ma première offre d'emploi ?",
      category: "Recrutement",
      views: 1247,
      helpful: 89
    },
    {
      title: "Optimiser mon profil entreprise",
      category: "Premiers pas",
      views: 892,
      helpful: 76
    },
    {
      title: "Intégrer LinkUp avec LinkedIn",
      category: "Intégrations",
      views: 634,
      helpful: 82
    },
    {
      title: "Comprendre les analytics de recrutement",
      category: "Outils & Fonctionnalités",
      views: 521,
      helpful: 71
    },
    {
      title: "Gérer les notifications et alertes",
      category: "Outils & Fonctionnalités",
      views: 445,
      helpful: 68
    }
  ];

  const videoTutorials = [
    {
      title: "Tour complet de la plateforme",
      duration: "8:32",
      views: "2.1k",
      thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Créer une offre d'emploi efficace",
      duration: "5:18",
      views: "1.8k",
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Utiliser les filtres avancés",
      duration: "3:45",
      views: "1.2k",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const contactOptions = [
    {
      title: "Chat en direct",
      description: "Obtenez une réponse immédiate de notre équipe",
      icon: MessageCircle,
      availability: "Disponible 9h-18h",
      responseTime: "Réponse instantanée"
    },
    {
      title: "Email support",
      description: "Envoyez-nous votre question par email",
      icon: FileText,
      availability: "24h/24",
      responseTime: "Réponse sous 2h"
    },
    {
      title: "Appel téléphonique",
      description: "Parlez directement avec un expert",
      icon: HelpCircle,
      availability: "9h-17h",
      responseTime: "Rendez-vous sur demande"
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
              <HelpCircle className="w-4 h-4" />
              <span>Centre d'aide</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Comment pouvons-nous vous aider ?
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Guides complets</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Tutoriels vidéo</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Trouvez rapidement les réponses à vos questions grâce à notre centre d'aide complet et nos ressources d'apprentissage.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-border rounded-2xl bg-background focus:border-primary focus:ring-0"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-2 rounded-full cursor-pointer">
                Rechercher
              </Button>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-foreground">
              {/* Parcourir par catégorie */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Parcourir par catégorie
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Explorez nos guides organisés par thème pour trouver rapidement l'information dont vous avez besoin
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category, index) => (
                    <div key={category.title} className="bg-muted/50 rounded-xl p-6 hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <category.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {category.title}
                            </h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{category.articles} articles</span>
                            <span>•</span>
                            <span>Mis à jour récemment</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Articles populaires */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Articles populaires
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Les articles les plus consultés par notre communauté
                </p>

                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <div key={article.title} className="bg-muted/50 rounded-xl p-6 hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{article.views} vues</span>
                            <span>•</span>
                            <span>{article.helpful}% ont trouvé utile</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tutoriels vidéo */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Video className="w-6 h-6 text-primary" />
                  Tutoriels vidéo
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Apprenez en regardant nos tutoriels vidéo étape par étape
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videoTutorials.map((video, index) => (
                    <div key={video.title} className="bg-muted/50 rounded-xl overflow-hidden hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Video className="h-6 w-6 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{video.views} vues</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Besoin d'aide personnalisée */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Besoin d'aide personnalisée ?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Notre équipe support est là pour vous accompagner
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactOptions.map((option, index) => (
                    <div key={option.title} className="bg-muted/50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div>{option.availability}</div>
                        <div>{option.responseTime}</div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white cursor-pointer">
                        Contacter
                      </Button>
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
