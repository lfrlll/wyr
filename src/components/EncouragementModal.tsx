"use client";

import { Sparkles } from "lucide-react";

type EncouragementModalProps = {
  message: string;
  onContinue: () => void;
};

export function EncouragementModal({ message, onContinue }: EncouragementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/70 bg-paper p-6 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-sage">
          <Sparkles size={22} />
        </div>
        <p className="prose-text text-ink/80">{message}</p>
        <button className="btn btn-primary mt-5" onClick={onContinue}>
          继续
        </button>
      </div>
    </div>
  );
}
