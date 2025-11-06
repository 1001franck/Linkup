/**
 * Page Créer un Post - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de la création de posts
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
  Image,
  Video,
  FileText,
  Link as LinkIcon,
  Smile,
  MapPin,
  Users,
  Globe,
  Hash,
  Send,
  X,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";

function CreatePostContent() {
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("text");
  const [visibility, setVisibility] = useState("public");
  const [attachments, setAttachments] = useState<Array<{id: string, type: string, url: string}>>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const postTypes = [
    { id: "text", label: "Texte", icon: FileText, description: "Partagez vos pensées" },
    { id: "image", label: "Image", icon: Image, description: "Ajoutez une photo" },
    { id: "video", label: "Vidéo", icon: Video, description: "Partagez une vidéo" },
    { id: "link", label: "Lien", icon: LinkIcon, description: "Partagez un lien" }
  ];

  const visibilityOptions = [
    { id: "public", label: "Public", icon: Globe, description: "Visible par tous" },
    { id: "network", label: "Réseau", icon: Users, description: "Visible par vos connexions" },
    { id: "private", label: "Privé", icon: EyeOff, description: "Visible par vous uniquement" }
  ];

  const handleAddAttachment = (type: string) => {
    // Simulation d'ajout d'attachement
    const newAttachment = {
      id: `attachment-${attachments.length + 1}`,
      type,
      url: `https://example.com/${type}-${attachments.length + 1}`
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulation de publication
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Post publié",
      description: "Votre post a été publié avec succès",
      variant: "default",
      duration: 3000,
    });
    setPostContent("");
    setAttachments([]);
    setIsPublishing(false);
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'link': return LinkIcon;
      default: return FileText;
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
                  Créer un Post
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Partagez avec votre réseau professionnel
                </Typography>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setPostContent("");
                  setAttachments([]);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={!postContent.trim() || isPublishing}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publication...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier
                  </>
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Type de post */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Type de contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {postTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPostType(type.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      postType === type.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border border-cyan-200 dark:border-cyan-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <type.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-slate-500">{type.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Visibilité */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Visibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {visibilityOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setVisibility(option.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      visibility === option.id
                        ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border border-cyan-200 dark:border-cyan-700"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-slate-500">{option.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Conseils</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Hash className="h-4 w-4 text-cyan-600 mt-0.5" />
                  <Typography variant="small" className="text-sm">
                    Utilisez des hashtags pertinents pour augmenter la visibilité
                  </Typography>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-cyan-600 mt-0.5" />
                  <Typography variant="small" className="text-sm">
                    Mentionnez des personnes avec @nom pour les impliquer
                  </Typography>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-cyan-600 mt-0.5" />
                  <Typography variant="small" className="text-sm">
                    Ajoutez votre localisation pour un contexte local
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone de création */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div>
                    <Typography variant="h4" className="font-semibold">
                      Jean Dupont
                    </Typography>
                    <Typography variant="muted" className="text-sm">
                      Développeur Frontend React
                    </Typography>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Zone de texte */}
                <div className="relative">
                  <textarea
                    placeholder="Quoi de neuf ? Partagez vos idées, expériences ou conseils professionnels..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full min-h-[200px] p-4 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-transparent"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                    {postContent.length}/2000
                  </div>
                </div>

                {/* Attachements */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <Typography variant="small" className="font-medium">
                      Attachements
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-2">
                          {React.createElement(getAttachmentIcon(attachment.type), {
                            className: "h-4 w-4 text-slate-600"
                          })}
                          <span className="text-sm">{attachment.type}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleAddAttachment('image')}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleAddAttachment('video')}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleAddAttachment('link')}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {visibilityOptions.find(opt => opt.id === visibility)?.label}
                    </Badge>
                    <Button 
                      onClick={handlePublish}
                      disabled={!postContent.trim() || isPublishing}
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                    >
                      {isPublishing ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Publication...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-2" />
                          Publier
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu */}
            {postContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Aperçu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">JD</span>
                      </div>
                      <div>
                        <Typography variant="h4" className="font-semibold">
                          Jean Dupont
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                          Développeur Frontend React • Maintenant
                        </Typography>
                      </div>
                    </div>
                    <Typography variant="small" className="whitespace-pre-wrap">
                      {postContent}
                    </Typography>
                    {attachments.length > 0 && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <Typography variant="small" className="text-slate-600 dark:text-slate-300">
                          {attachments.length} attachement(s) sera(ont) inclus
                        </Typography>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </Container>
      <Toaster />
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostContent />
    </ProtectedRoute>
  );
}
