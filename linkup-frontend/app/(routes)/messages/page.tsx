/**
 * Page Messages - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la messagerie
 * - Open/Closed : Extensible via props et composition
 */

"use client";

import React, { useState, useEffect } from "react";
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
import { useConversations, useMessagesWithUser } from "@/hooks/use-messages";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Clock,
  Check,
  CheckCheck,
  Phone,
  Video,
  Archive,
  Trash2,
  AlertCircle,
  Construction
} from "lucide-react";

function MessagesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState("");

  // Récupération de l'utilisateur connecté
  const { user: authUser } = useAuth();
  const currentUserId = authUser && 'id_user' in authUser ? authUser.id_user : 1; // Fallback à 1 si pas d'utilisateur

  // Récupération des conversations depuis l'API
  const { data: conversationsData, loading: conversationsLoading, error: conversationsError } = useConversations();
  
  // Récupération des messages de la conversation sélectionnée
  const { data: messagesData, loading: messagesLoading, error: messagesError } = useMessagesWithUser(selectedConversation);

  // Debug: Afficher les données reçues de l'API
  useEffect(() => {
    if (conversationsError) {
      console.error('❌ Messages Page - Erreur API conversations:', conversationsError);
    }
  }, [conversationsError]);

  useEffect(() => {
    if (messagesError) {
      console.error('❌ Messages Page - Erreur API messages:', messagesError);
    }
  }, [messagesError]);

  // Transformer les données de l'API au format attendu par le frontend
  const transformConversations = (apiData: any[]) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map((conv: any) => ({
      id: conv.other_user_id,
      name: `Utilisateur ${conv.other_user_id}`, // TODO: Récupérer le nom depuis l'API users
      title: "Correspondant", // TODO: Récupérer le titre depuis l'API users
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80&sig=${conv.other_user_id}`, // Avatar par défaut
      lastMessage: conv.last_message?.content || "Aucun message",
      time: conv.last_message?.send_at ? new Date(conv.last_message.send_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "N/A",
      unread: conv.unread_count || 0,
      isOnline: false // TODO: Implémenter le statut en ligne
    }));
  };

  // Utiliser les données de l'API transformées ou un tableau vide
  const conversations = Array.isArray((conversationsData as any)?.data) 
    ? transformConversations((conversationsData as any).data)
    : Array.isArray(conversationsData) 
    ? transformConversations(conversationsData)
    : [];

  // Transformer les messages de l'API au format attendu par le frontend
  const transformMessages = (apiMessages: any[], currentUserId: number) => {
    if (!Array.isArray(apiMessages)) return [];
    
    return apiMessages.map((msg: any) => ({
      id: msg.id_message,
      sender: msg.id_sender === currentUserId ? "Vous" : `Utilisateur ${msg.id_sender}`, // TODO: Récupérer le nom depuis l'API users
      content: msg.content,
      time: new Date(msg.send_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: msg.id_sender === currentUserId,
      avatar: msg.id_sender === currentUserId ? undefined : `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80&sig=${msg.id_sender}`
    }));
  };

  // Messages de la conversation sélectionnée depuis l'API
  const messages = Array.isArray(messagesData) 
    ? transformMessages(messagesData, currentUserId)
    : [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Simulation d'envoi de message
      // Message envoyé avec succès
      setMessageText("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/20">
      
      {/* Banner "En cours de développement" */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <Container>
          <div className="flex items-center gap-3 py-3">
            <Construction className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <Typography variant="small" className="font-semibold text-amber-900 dark:text-amber-100">
                Page en cours de développement
              </Typography>
              <Typography variant="muted" className="text-sm text-amber-700 dark:text-amber-300">
                Cette fonctionnalité est actuellement en développement. Certaines fonctionnalités peuvent ne pas être disponibles.
              </Typography>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Indicateurs de chargement et d'erreur */}
      {conversationsLoading && (
        <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg">
          <Typography variant="muted">Chargement des conversations...</Typography>
        </div>
      )}
      {conversationsError && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 p-4 rounded-lg shadow-lg border border-red-200">
          <Typography variant="muted" className="text-red-500">
            Erreur conversations: {conversationsError}
          </Typography>
        </div>
      )}
      {messagesLoading && (
        <div className="fixed top-16 right-4 z-50 bg-white p-4 rounded-lg shadow-lg">
          <Typography variant="muted">Chargement des messages...</Typography>
        </div>
      )}
      {messagesError && (
        <div className="fixed top-16 right-4 z-50 bg-red-50 p-4 rounded-lg shadow-lg border border-red-200">
          <Typography variant="muted" className="text-red-500">
            Erreur messages: {messagesError}
          </Typography>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <BackButton fallbackPath="/dashboard" />
              <div>
                <Typography variant="h2" className="text-2xl font-bold">
                  Messages
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Communiquez avec votre réseau
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {Array.isArray(conversations) && conversations.length > 0 ? (
                    conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`p-4 cursor-pointer transition-all duration-200 ${
                          selectedConversation === conversation.id
                            ? "bg-primary/10 dark:bg-primary/20 border-r-2 border-primary"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full overflow-hidden">
                              <img 
                                src={conversation.avatar} 
                                alt={conversation.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {conversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <Typography variant="small" className="font-semibold truncate">
                                {conversation.name}
                              </Typography>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-slate-500">{conversation.time}</span>
                                {conversation.unread > 0 && (
                                  <Badge className="bg-primary text-primary-foreground text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Typography variant="muted" className="text-sm truncate">
                              {conversation.title}
                            </Typography>
                            <Typography variant="muted" className="text-xs truncate">
                              {conversation.lastMessage}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <Typography variant="muted">
                        {conversationsLoading ? "Chargement..." : "Aucune conversation"}
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
              {/* Header de la conversation */}
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={conversations.find(c => c.id === selectedConversation)?.avatar} 
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {conversations.find(c => c.id === selectedConversation)?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                      )}
                    </div>
                    <div>
                      <Typography variant="h4" className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </Typography>
                      <Typography variant="muted" className="text-sm">
                        {conversations.find(c => c.id === selectedConversation)?.title}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[70%] ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!message.isOwn && (
                          <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={message.avatar} 
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.isOwn 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                        }`}>
                          <Typography variant="small" className="text-sm">
                            {message.content}
                          </Typography>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.isOwn ? 'text-primary-foreground/80' : 'text-slate-500'
                          }`}>
                            <span className="text-xs">{message.time}</span>
                            {message.isOwn && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <Typography variant="large" className="mb-2">
                          {messagesLoading ? "Chargement des messages..." : "Aucun message"}
                        </Typography>
                        <Typography variant="small">
                          {messagesLoading ? "Veuillez patienter..." : "Commencez une conversation !"}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Tapez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-10"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}
