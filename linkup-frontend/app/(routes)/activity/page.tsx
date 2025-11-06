/**
 * Page Activité - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'activité utilisateur
 * - Open/Closed : Extensible via props et composition
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BackButton } from "@/components/ui/back-button";
import { 
  Search,
  Filter,
  Eye,
  Users,
  MessageCircle,
  Briefcase,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle,
  Star,
  Bookmark
} from "lucide-react";

function ActivityContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Activité récente
  const activities = [
    {
      id: 1,
      type: "profile_view",
      title: "Votre profil a été consulté",
      description: "Marie Dubois, Recruteuse chez TechCorp",
      time: "Il y a 2 heures",
      icon: Eye,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "views",
      isRead: false
    },
    {
      id: 2,
      type: "job_match",
      title: "Nouvelle offre correspondante",
      description: "Développeur Frontend React - StartupX (95% match)",
      time: "Il y a 4 heures",
      icon: Briefcase,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "jobs",
      isRead: false
    },
    {
      id: 3,
      type: "connection",
      title: "Nouvelle connexion",
      description: "Pierre Martin vous a ajouté à son réseau",
      time: "Il y a 1 jour",
      icon: Users,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "network",
      isRead: true
    },
    {
      id: 4,
      type: "message",
      title: "Nouveau message",
      description: "Sophie Chen vous a envoyé un message",
      time: "Il y a 2 jours",
      icon: MessageCircle,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "messages",
      isRead: true
    },
    {
      id: 5,
      type: "application_status",
      title: "Mise à jour de candidature",
      description: "Votre candidature chez TechCorp a été mise à jour",
      time: "Il y a 3 jours",
      icon: CheckCircle,
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "applications",
      isRead: true
    },
    {
      id: 6,
      type: "post_like",
      title: "Votre post a été aimé",
      description: "Alexandre Rousseau a aimé votre post sur React",
      time: "Il y a 4 jours",
      icon: Heart,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "social",
      isRead: true
    },
    {
      id: 7,
      type: "skill_endorsement",
      title: "Compétence validée",
      description: "Emma Laurent a validé votre compétence 'React'",
      time: "Il y a 1 semaine",
      icon: Star,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "skills",
      isRead: true
    },
    {
      id: 8,
      type: "event_reminder",
      title: "Rappel d'événement",
      description: "Entretien TechCorp demain à 14h00",
      time: "Il y a 1 semaine",
      icon: Calendar,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      category: "events",
      isRead: true
    }
  ];

  const filters = [
    { id: "all", label: "Toutes", count: activities.length },
    { id: "views", label: "Vues de profil", count: activities.filter(a => a.category === "views").length },
    { id: "jobs", label: "Offres d'emploi", count: activities.filter(a => a.category === "jobs").length },
    { id: "network", label: "Réseau", count: activities.filter(a => a.category === "network").length },
    { id: "messages", label: "Messages", count: activities.filter(a => a.category === "messages").length },
    { id: "applications", label: "Candidatures", count: activities.filter(a => a.category === "applications").length },
    { id: "social", label: "Social", count: activities.filter(a => a.category === "social").length },
    { id: "skills", label: "Compétences", count: activities.filter(a => a.category === "skills").length },
    { id: "events", label: "Événements", count: activities.filter(a => a.category === "events").length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "views": return "text-cyan-600 bg-cyan-100";
      case "jobs": return "text-teal-600 bg-teal-100";
      case "network": return "text-blue-600 bg-blue-100";
      case "messages": return "text-green-600 bg-green-100";
      case "applications": return "text-orange-600 bg-orange-100";
      case "social": return "text-pink-600 bg-pink-100";
      case "skills": return "text-purple-600 bg-purple-100";
      case "events": return "text-indigo-600 bg-indigo-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "views": return "Vue de profil";
      case "jobs": return "Offre d'emploi";
      case "network": return "Réseau";
      case "messages": return "Message";
      case "applications": return "Candidature";
      case "social": return "Social";
      case "skills": return "Compétence";
      case "events": return "Événement";
      default: return "Autre";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-cyan-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <BackButton fallbackPath="/dashboard" />
              <div>
                <Typography variant="h2" className="text-2xl font-bold">
                  Activité Récente
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Suivez toutes vos interactions et notifications
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans l'activité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistiques */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Total d'activités</span>
                  <span className="font-semibold text-cyan-600">{activities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Non lues</span>
                  <span className="font-semibold text-teal-600">{activities.filter(a => !a.isRead).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Cette semaine</span>
                  <span className="font-semibold text-cyan-600">+12</span>
                </div>
              </CardContent>
            </Card>

            {/* Filtres */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filtres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                      activeFilter === filter.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border border-cyan-200 dark:border-cyan-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{filter.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Marquer tout comme lu
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir les tendances
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendrier d'activité
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6">
            {activities.length === 0 ? (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-slate-400" />
                  </div>
                  <Typography variant="h4" className="font-semibold mb-2">
                    Aucune activité récente
                  </Typography>
                  <Typography variant="muted" className="mb-6">
                    Votre activité apparaîtra ici au fur et à mesure
                  </Typography>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700">
                      Retour au dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activities
                  .filter(activity => 
                    activeFilter === "all" || activity.category === activeFilter
                  )
                  .filter(activity =>
                    searchTerm === "" || 
                    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        !activity.isRead ? 'ring-2 ring-cyan-500/20' : ''
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full overflow-hidden">
                                <img 
                                  src={activity.avatar} 
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center ${getCategoryColor(activity.category)}`}>
                                <activity.icon className="h-3 w-3" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Typography variant="small" className="font-semibold mb-1">
                                    {activity.title}
                                  </Typography>
                                  <Typography variant="muted" className="text-sm mb-2">
                                    {activity.description}
                                  </Typography>
                                  <div className="flex items-center space-x-3">
                                    <Badge className={`text-xs ${getCategoryColor(activity.category)}`}>
                                      {getCategoryLabel(activity.category)}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                                      <Clock className="h-3 w-3" />
                                      <span>{activity.time}</span>
                                    </div>
                                    {!activity.isRead && (
                                      <div className="h-2 w-2 bg-cyan-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <ActivityContent />
    </ProtectedRoute>
  );
}
