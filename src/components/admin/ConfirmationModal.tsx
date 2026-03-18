'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/utils/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const variants = {
  danger: {
    icon: XCircle,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    confirmBg: 'bg-destructive hover:bg-destructive/90',
    focusRing: 'focus-visible:ring-destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    confirmBg: 'bg-amber-500 hover:bg-amber-600',
    focusRing: 'focus-visible:ring-amber-500',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    confirmBg: 'bg-primary hover:bg-primary/90',
    focusRing: 'focus-visible:ring-primary',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    confirmBg: 'bg-emerald-500 hover:bg-emerald-600',
    focusRing: 'focus-visible:ring-emerald-500',
  },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}) => {
  const { icon: Icon, iconColor, iconBg, confirmBg, focusRing } = variants[variant];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl animate-in zoom-in-95 duration-200 bg-card">
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className={cn("p-4 rounded-3xl", iconBg)}>
              <Icon className={cn("h-10 w-10", iconColor)} />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-foreground tracking-tight leading-none">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[15px] font-medium text-muted-foreground leading-relaxed px-2">
                {description}
              </DialogDescription>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 backdrop-blur-sm border-t border-border flex-row gap-3 sm:justify-center sm:space-x-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-12 text-[15px] font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-2xl transition-all duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 h-12 text-[15px] font-bold text-primary-foreground rounded-2xl shadow-lg transition-all duration-300 active:scale-95",
              confirmBg,
              focusRing
            )}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
