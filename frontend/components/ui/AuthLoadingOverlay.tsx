'use client';

import React from 'react';

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const AuthLoadingOverlay = ({ isVisible, message = "Authenticating secure session parameters..." }: AuthLoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="app-card flex flex-col items-center gap-4 p-8 max-w-xs w-full text-center bg-surface border border-surface-border shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* DaisyUI Spin Component Ring */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
        
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">Please Wait</h3>
          <p className="text-[11px] text-secondary leading-normal">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};