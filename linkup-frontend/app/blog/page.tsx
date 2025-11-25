/**
 * Page Blog - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la page Blog
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Liskov Substitution : Composants interchangeables
 * - Dependency Inversion : Dépend des abstractions
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function BlogPage() {

  const blogPosts = [
    {
      title: "5 tendances du recrutement tech en 2025",
      excerpt: "Les nouvelles tendances qui façonnent le recrutement dans le secteur technologique cette année.",
      author: "Thomas Martin",
      date: "13 Octobre 2025",
      readTime: "6 min",
      category: "Tendances",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "tendances-recrutement-tech-2025"
    },
    {
      title: "Comment créer une marque employeur attractive",
      excerpt: "Les stratégies essentielles pour développer une marque employeur qui attire les meilleurs talents.",
      author: "Sophie Laurent",
      date: "10 Octobre 2025",
      readTime: "7 min",
      category: "Marque employeur",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "marque-employeur-attractive"
    },
    {
      title: "Le télétravail : impact sur le recrutement",
      excerpt: "Comment le télétravail transforme les attentes des candidats et les stratégies de recrutement.",
      author: "Alexandre Petit",
      date: "8 Octobre 2025",
      readTime: "5 min",
      category: "Télétravail",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "teletravail-impact-recrutement"
    },
    {
      title: "Diversité et inclusion : un enjeu RH majeur",
      excerpt: "L'importance de la diversité dans les équipes et les bonnes pratiques pour l'encourager.",
      author: "Fatima Alami",
      date: "5 Octobre 2025",
      readTime: "9 min",
      category: "Diversité",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "diversite-inclusion-enjeu-rh"
    },
    {
      title: "Recrutement data-driven : les métriques qui comptent",
      excerpt: "Quelles données analyser pour optimiser votre processus de recrutement et améliorer vos résultats.",
      author: "Julien Moreau",
      date: "3 Octobre 2025",
      readTime: "6 min",
      category: "Data",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "recrutement-data-driven-metriques"
    },
    {
      title: "L'expérience candidat : clé du succès",
      excerpt: "Comment créer une expérience candidat exceptionnelle qui fait la différence dans la guerre des talents.",
      author: "Camille Rousseau",
      date: "1 Octobre 2025",
      readTime: "8 min",
      category: "Expérience candidat",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      slug: "experience-candidat-cle-succes"
    }
  ];

  const categories = [
    { name: "Tous", count: 12, active: true },
    { name: "Innovation", count: 3 },
    { name: "Tendances", count: 2 },
    { name: "Marque employeur", count: 2 },
    { name: "Télétravail", count: 2 },
    { name: "Diversité", count: 1 },
    { name: "Data", count: 1 },
    { name: "Expérience candidat", count: 1 }
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
              <Tag className="w-4 h-4" />
              <span>Blog LinkUp</span>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Insights & Tendances
            </h1>

            {/* Meta informations */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Articles récents</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Experts RH</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez les dernières tendances du recrutement, les meilleures pratiques RH et les innovations qui transforment le monde du travail
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
              {/* Filtres par catégorie */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Tag className="w-6 h-6 text-primary" />
                  Filtres par catégorie
                </h2>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category, index) => (
                    <button
                      key={category.name}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                        category.active
                          ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg"
                          : "bg-muted/50 border border-border text-foreground hover:bg-primary/10 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>


              {/* Articles de blog */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Articles récents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map((post, index) => (
                    <article key={post.slug} className="bg-muted/50 rounded-xl overflow-hidden hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {post.author}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 cursor-pointer">
                            Lire
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Newsletter Section */}
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
                Restez informé
              </h2>
              <p className="text-xl text-cyan-100 mb-8">
                Recevez nos derniers articles et insights directement dans votre boîte mail
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-6 py-4 rounded-full border-0 bg-white/10 backdrop-blur-sm text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button size="lg" className="bg-white hover:bg-slate-100 text-cyan-700 font-semibold cursor-pointer">
                  S'abonner
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}

