/**
 * Page Réseau - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du réseau professionnel
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MessageCircle, 
  MapPin, 
  Building2, 
  Star,
  MoreHorizontal
} from "lucide-react";

function NetworkContent() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("connections");

  // Connexions existantes
  const connections = [
    {
      id: 1,
      name: "Marie Dubois",
      title: "Product Manager",
      company: "TechCorp",
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 12,
      connectedAt: "Il y a 2 mois"
    },
    {
      id: 2,
      name: "Pierre Martin",
      title: "Développeur Full Stack",
      company: "StartupX",
      location: "Lyon, France",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 8,
      connectedAt: "Il y a 1 mois"
    },
    {
      id: 3,
      name: "Sophie Chen",
      title: "UX Designer",
      company: "DesignStudio",
      location: "Remote",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 5,
      connectedAt: "Il y a 3 semaines"
    }
  ];

  // Suggestions de connexions
  const suggestions = [
    {
      id: 4,
      name: "Alexandre Rousseau",
      title: "Tech Lead",
      company: "InnovateCorp",
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 15,
      reason: "Vous connaissez 15 personnes en commun"
    },
    {
      id: 5,
      name: "Emma Laurent",
      title: "Marketing Manager",
      company: "GrowthCo",
      location: "Lyon, France",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 7,
      reason: "Même secteur d'activité"
    },
    {
      id: 6,
      name: "Thomas Moreau",
      title: "Data Scientist",
      company: "DataCorp",
      location: "Remote",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      mutualConnections: 3,
      reason: "Compétences similaires"
    }
  ];

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
                  Mon Réseau
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Gérez vos connexions professionnelles
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des personnes..."
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Statistiques du réseau */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Connexions</span>
                  <span className="font-semibold text-cyan-600">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Nouvelles cette semaine</span>
                  <span className="font-semibold text-teal-600">+12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Vues de profil</span>
                  <span className="font-semibold text-cyan-600">1,234</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter des contacts
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Trouver des collègues
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages récents
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Onglets */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {[
                { id: "connections", label: "Mes connexions", count: connections.length },
                { id: "suggestions", label: "Suggestions", count: suggestions.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-cyan-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {tab.count}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            {activeTab === "connections" && (
              <div className="space-y-4">
                {connections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden">
                            <img 
                              src={connection.avatar} 
                              alt={connection.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Typography variant="h4" className="font-semibold mb-1">
                              {connection.name}
                            </Typography>
                            <Typography variant="muted" className="text-sm mb-2">
                              {connection.title} • {connection.company}
                            </Typography>
                            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{connection.location}</span>
                              </div>
                              <span>{connection.mutualConnections} connexions communes</span>
                              <span>Connecté {connection.connectedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link href="/messages">
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "suggestions" && (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden">
                            <img 
                              src={suggestion.avatar} 
                              alt={suggestion.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <Typography variant="h4" className="font-semibold mb-1">
                              {suggestion.name}
                            </Typography>
                            <Typography variant="muted" className="text-sm mb-2">
                              {suggestion.title} • {suggestion.company}
                            </Typography>
                            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{suggestion.location}</span>
                              </div>
                              <span>{suggestion.mutualConnections} connexions communes</span>
                            </div>
                            <Typography variant="muted" className="text-sm">
                              {suggestion.reason}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                              onClick={() => {
                                toast({
                                  title: "Demande envoyée",
                                  description: "Votre demande de connexion a été envoyée",
                                  variant: "default",
                                  duration: 3000,
                                });
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connecter
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
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
      <Toaster />
    </div>
  );
}

export default function NetworkPage() {
  return (
    <ProtectedRoute>
      <NetworkContent />
    </ProtectedRoute>
  );
}
