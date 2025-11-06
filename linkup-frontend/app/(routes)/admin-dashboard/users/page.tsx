/**
 * Gestion des Utilisateurs - Admin Dashboard
 * Interface complète de gestion des utilisateurs
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des utilisateurs
 * - Open/Closed : Extensible via composition
 * - Interface Segregation : Props spécifiques et optionnelles
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { useUserType } from "@/hooks/use-user-type";
import { useAdminUsers, AdminUser } from "@/hooks/use-admin";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Key,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminUsersPage() {
  const { toast } = useToast();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Hook admin
  const { 
    users, 
    total, 
    isLoading, 
    error, 
    refetch, 
    createUser, 
    updateUser, 
    deleteUser, 
    changePassword 
  } = useAdminUsers({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined
  });


  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateUser = async (userData: Partial<AdminUser>) => {
    try {
      await createUser(userData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdateUser = async (userId: number, userData: Partial<AdminUser>) => {
    try {
      await updateUser(userId, userData);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleChangePassword = async (userId: number, newPassword: string) => {
    try {
      await changePassword(userId, newPassword);
      setIsPasswordDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", icon: Shield },
      user: { color: "bg-blue-100 text-blue-800", icon: UserCheck },
      company: { color: "bg-green-100 text-green-800", icon: Users }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className="py-8">
      {/* Header de la page */}
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <Typography variant="h1" className="font-bold">
                  Gestion des Utilisateurs
                </Typography>
                <Typography variant="muted">
                  {total} utilisateur{total > 1 ? 's' : ''} au total
                </Typography>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajouter un nouvel utilisateur à la plateforme
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm onSubmit={handleCreateUser} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Container>
        <Container>
          {/* Filtres et recherche */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs ({total})</CardTitle>
              <CardDescription>
                Gestion complète des utilisateurs de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <Typography variant="h3" className="font-semibold mb-2">
                    Erreur de chargement
                  </Typography>
                  <Typography variant="muted" className="mb-4">
                    {error}
                  </Typography>
                  <Button onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              ) : !users || !Array.isArray(users) || users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Typography variant="h3" className="font-semibold mb-2">
                    Aucun utilisateur trouvé
                  </Typography>
                  <Typography variant="muted" className="mb-4">
                    {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche.' : 'Commencez par créer votre premier utilisateur.'}
                  </Typography>
                  {!searchTerm && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un utilisateur
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {users && Array.isArray(users) && users.map((user, index) => (
                    <motion.div
                      key={user.id_user || user.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Typography variant="sm" className="font-medium truncate">
                            {user.firstname} {user.lastname}
                          </Typography>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Inscrit le {formatDate(user.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsPasswordDialogOpen(true);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
      </Container>

      {/* Dialogs */}
      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateUser}
      />
      
      <DeleteUserDialog
        user={selectedUser}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteUser}
      />
      
      <ChangePasswordDialog
        user={selectedUser}
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSubmit={handleChangePassword}
      />
      
      <Toaster />
    </div>
  );
}

// ========================================
// COMPOSANTS DE FORMULAIRES
// ========================================

function CreateUserForm({ onSubmit }: { onSubmit: (data: Partial<AdminUser>) => void }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'user',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstname">Prénom</Label>
          <Input
            id="firstname"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastname">Nom</Label>
          <Input
            id="lastname"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rôle</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="company">Entreprise</SelectItem>
            <SelectItem value="admin">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="phone">Téléphone (optionnel)</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">Créer</Button>
      </div>
    </form>
  );
}

function EditUserDialog({ 
  user, 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  user: AdminUser | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (id: number, data: Partial<AdminUser>) => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    role: 'user',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit(user.id_user || user.id, formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifier les informations de {user?.firstname} {user?.lastname}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-firstname">Prénom</Label>
              <Input
                id="edit-firstname"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-lastname">Nom</Label>
              <Input
                id="edit-lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="company">Entreprise</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="edit-phone">Téléphone</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({ 
  user, 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  user: AdminUser | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: (id: number) => void;
}) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user.id_user || user.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'utilisateur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {user?.firstname} {user?.lastname} ? 
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog({ 
  user, 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  user: AdminUser | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (id: number, password: string) => void;
}) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSubmit(user.id_user || user.id, password);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Définir un nouveau mot de passe pour {user?.firstname} {user?.lastname}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
