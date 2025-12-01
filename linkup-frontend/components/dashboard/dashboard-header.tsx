/**
 * Composant Header du Dashboard
 * Affiche la section de bienvenue avec avatar et informations utilisateur
 */

"use client";

import { UserAvatar } from "@/components/ui/user-avatar";
import { Typography } from "@/components/ui/typography";

interface DashboardHeaderProps {
  userName: string | null;
  userTitle: string | null;
  userLocation: string | null;
  userAvatar: string | null;
  onAvatarClick: () => void;
}

export function DashboardHeader({
  userName,
  userTitle,
  userLocation,
  userAvatar,
  onAvatarClick,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <UserAvatar
          src={userAvatar}
          name={userName || "Utilisateur"}
          size="xl"
          onClick={onAvatarClick}
          className="cursor-pointer"
        />
        <div>
          <Typography variant="h2" className="text-2xl font-bold">
            Bonjour, {userName?.split(" ")[0] || "Utilisateur"} ! 👋
          </Typography>
          <Typography variant="muted" className="text-lg">
            {userTitle || "Titre"} • {userLocation || "Localisation"}
          </Typography>
        </div>
      </div>
    </div>
  );
}


