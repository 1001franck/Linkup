/**
 * Composant Sidebar du Dashboard
 * Affiche le profil rapide et les actions rapides
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Camera,
  Edit3,
  Share2,
  FileText,
  Search,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardSidebarProps {
  userName: string | null;
  userTitle: string | null;
  userAvatar: string | null;
  profileCompletion: number;
  userId: number | null;
  onAvatarClick: () => void;
}

export function DashboardSidebar({
  userName,
  userTitle,
  userAvatar,
  profileCompletion,
  userId,
  onAvatarClick,
}: DashboardSidebarProps) {
  const { toast } = useToast();

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    const shareText = `Découvrez le profil de ${userName} sur LinkUp - ${userTitle}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Profil LinkUp",
          text: shareText,
          url: profileUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(profileUrl);
          toast({
            title: "Lien copié",
            description: "Le lien de votre profil a été copié dans le presse-papiers",
            variant: "default",
            duration: 3000,
          });
        });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de votre profil a été copié dans le presse-papiers",
        variant: "default",
        duration: 3000,
      });
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Profil rapide */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <UserAvatar
                src={userAvatar}
                name={userName || "Utilisateur"}
                size="xl"
                onClick={onAvatarClick}
                className="mx-auto cursor-pointer"
              />
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-cyan-500 hover:bg-cyan-600"
                onClick={onAvatarClick}
                title="Modifier la photo de profil"
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
            <Typography variant="h4" className="font-semibold mb-1">
              {userName || "Nom"}
            </Typography>
            <Typography variant="muted" className="text-sm mb-3">
              {userTitle || "Titre"}
            </Typography>

            {/* Barre de progression du profil */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profil complet</span>
                <span className="text-sm text-cyan-600 font-semibold">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <Link href="/profile/complete">
              <Button
                className="w-full mb-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                size="sm"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier le profil
              </Button>
            </Link>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 transition-colors"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
              <Link href="/cv">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  CV
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="space-y-2 pt-6">
          <Link href="/jobs">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Rechercher des emplois
            </Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </Link>
          <Link href="/my-applications?filter=bookmarked">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Emplois sauvegardés
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}




