/**
 * Hook personnalisé pour les confirmations
 * Remplace window.confirm() par une alerte personnalisée centrée
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning" | "danger" | "success" | "info";
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    description: "",
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const isProcessingRef = useRef(false);
  const isOpenRef = useRef(false);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    // Éviter les doubles appels
    if (isProcessingRef.current || isOpenRef.current) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      // Si un modal est déjà ouvert, fermer l'ancien d'abord
      if (resolveRef.current) {
        resolveRef.current(false);
        resolveRef.current = null;
      }
      
      isProcessingRef.current = true;
      isOpenRef.current = true;
      resolveRef.current = resolve;
      setOptions(opts);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
    isProcessingRef.current = false;
    isOpenRef.current = false;
    setIsOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    isProcessingRef.current = false;
    isOpenRef.current = false;
    setIsOpen(false);
  }, []);

  const ConfirmDialog = useCallback(() => (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={options.title || "Confirmation"}
      description={options.description}
      confirmText={options.confirmText || "Confirmer"}
      cancelText={options.cancelText || "Annuler"}
      variant={options.variant || "warning"}
    />
  ), [isOpen, options, handleCancel, handleConfirm]);

  return { confirm, ConfirmDialog };
}

