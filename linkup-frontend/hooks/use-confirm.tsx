/**
 * Hook personnalisé pour les confirmations
 * Remplace window.confirm() par une alerte personnalisée centrée
 */

"use client";

import { useState } from "react";
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
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  };

  const ConfirmDialog = () => (
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
  );

  return { confirm, ConfirmDialog };
}

