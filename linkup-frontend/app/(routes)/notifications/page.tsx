/**
 * Page Notifications - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des notifications
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  MoreVertical,
  Mail,
  Users,
  Briefcase,
  Heart,
  MessageCircle,
  Calendar,
  Settings,
  Filter,
  Search,
  Trash2,
  CheckCheck
} from "lucide-react";

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "job_match",
      title: "Nouvelle offre correspondante",
      message: "Une offre de Développeur React chez TechCorp correspond à votre profil",
      time: "Il y a 2 heures",
      isRead: false,
      priority: "high",
      icon: Briefcase,
      action: "Voir l'offre"
    },
    {
      id: 2,
      type: "message",
      title: "Nouveau message",
      message: "Sarah Martin vous a envoyé un message",
      time: "Il y a 4 heures",
      isRead: false,
      priority: "medium",
      icon: MessageCircle,
      action: "Répondre"
    },
    {
      id: 3,
      type: "connection",
      title: "Demande de connexion",
      message: "Alex Dubois souhaite se connecter avec vous",
      time: "Il y a 6 heures",
      isRead: true,
      priority: "low",
      icon: Users,
      action: "Accepter"
    },
    {
      id: 4,
      type: "application",
      title: "Candidature mise à jour",
      message: "Votre candidature chez StartupX est en cours d'examen",
      time: "Il y a 1 jour",
      isRead: true,
      priority: "medium",
      icon: Check,
      action: "Voir le statut"
    },
    {
      id: 5,
      type: "event",
      title: "Événement à venir",
      message: "Webinaire 'Carrières Tech' dans 2 heures",
      time: "Il y a 1 jour",
      isRead: true,
      priority: "low",
      icon: Calendar,
      action: "Rejoindre"
    },
    {
      id: 6,
      type: "profile_view",
      title: "Profil consulté",
      message: "Votre profil a été consulté par 3 recruteurs aujourd'hui",
      time: "Il y a 2 jours",
      isRead: true,
      priority: "low",
      icon: Users,
      action: "Voir les détails"
    }
  ]);

  const filters = [
    { id: "all", label: "Toutes", count: notifications.length },
    { id: "unread", label: "Non lues", count: notifications.filter(n => !n.isRead).length },
    { id: "job_match", label: "Offres", count: notifications.filter(n => n.type === "job_match").length },
    { id: "message", label: "Messages", count: notifications.filter(n => n.type === "message").length },
    { id: "connection", label: "Connexions", count: notifications.filter(n => n.type === "connection").length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.isRead;
    return notification.type === activeFilter;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job_match": return "text-cyan-600";
      case "message": return "text-blue-600";
      case "connection": return "text-green-600";
      case "application": return "text-purple-600";
      case "event": return "text-orange-600";
      case "profile_view": return "text-teal-600";
      default: return "text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <Container>
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BackButton fallbackPath="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-cyan-600 transition-colors" />
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Typography variant="h1" className="text-2xl font-bold">
                      Notifications
                    </Typography>
                    <Typography variant="muted">
                      Restez informé de vos activités
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={notifications.every(n => n.isRead)}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Tout marquer comme lu
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Filtres */}
          <Card className="backdrop-blur-sm border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? "bg-cyan-500 text-white shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span>{filter.label}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        activeFilter === filter.id 
                          ? "bg-white/20 text-white" 
                          : "bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    !notification.isRead ? 'ring-2 ring-cyan-500/20' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Icône */}
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          !notification.isRead 
                            ? 'bg-primary/10' 
                            : 'bg-muted'
                        }`}>
                          <notification.icon className={`h-6 w-6 ${getTypeColor(notification.type)}`} />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Typography variant="h4" className={`text-lg font-semibold ${
                                  !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </Typography>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                                )}
                                <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority === "high" ? "Important" : 
                                   notification.priority === "medium" ? "Normal" : "Faible"}
                                </Badge>
                              </div>
                              
                              <Typography variant="muted" className="mb-2">
                                {notification.message}
                              </Typography>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{notification.time}</span>
                                <span>•</span>
                                <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-slate-500 hover:text-cyan-600"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-slate-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white border-0"
                              >
                                {notification.action}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <BellOff className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Typography variant="h3" className="text-xl font-semibold mb-2">
                    Aucune notification
                  </Typography>
                  <Typography variant="muted">
                    Vous êtes à jour ! Aucune nouvelle notification pour le moment.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
}
