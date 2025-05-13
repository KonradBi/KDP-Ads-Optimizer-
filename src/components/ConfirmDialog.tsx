'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Globaler Dialog-Manager
let showConfirmDialog: (props: ConfirmDialogProps) => void = () => {};
let hideConfirmDialog: () => void = () => {};

export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    showConfirmDialog({
      message,
      onConfirm: () => {
        hideConfirmDialog();
        resolve(true);
      },
      onCancel: () => {
        hideConfirmDialog();
        resolve(false);
      }
    });
  });
}

const ConfirmDialog: React.FC = () => {
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    showConfirmDialog = (props: ConfirmDialogProps) => {
      setDialogProps(props);
      setIsOpen(true);
    };

    hideConfirmDialog = () => {
      setIsOpen(false);
    };
  }, []);

  if (!dialogProps || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={dialogProps.onCancel}
      />
      
      {/* Dialog */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden w-full max-w-md z-10 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Confirmation</h3>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300">{dialogProps.message}</p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 bg-slate-900/50 border-t border-slate-700">
          <button
            onClick={dialogProps.onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={dialogProps.onConfirm}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
