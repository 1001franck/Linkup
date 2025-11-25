/**
 * Composant ConfirmationModal - Molecule
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des confirmations d'actions
 * - Open/Closed : Extensible via props
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger" | "success" | "info";
  isLoading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: "text-cyan-500",
    confirmButton: "bg-cyan-600 hover:bg-cyan-700 text-white",
    borderColor: "border-cyan-200",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
    borderColor: "border-yellow-200",
  },
  danger: {
    icon: AlertCircle,
    iconColor: "text-red-500",
    confirmButton: "bg-red-600 hover:bg-red-700 text-white",
    borderColor: "border-red-200",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    confirmButton: "bg-green-600 hover:bg-green-700 text-white",
    borderColor: "border-green-200",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
    borderColor: "border-blue-200",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default",
  isLoading = false,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <Card className={cn(
              "backdrop-blur-sm border-0 shadow-2xl",
              config.borderColor
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-muted/50",
                      config.iconColor
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Typography variant="muted" className="text-sm leading-relaxed mb-6">
                  {description}
                </Typography>
                
                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="min-w-[100px]"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={cn(
                      "min-w-[100px]",
                      config.confirmButton
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Chargement...</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
