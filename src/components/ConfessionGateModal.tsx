"use client";

import { Heart } from "lucide-react";

type ConfessionGateModalProps = {
  open: boolean;
  title: string;
  body: string;
  recipientName: string;
  onComplete: () => void;
};

export function ConfessionGateModal({ open, title, body, recipientName, onComplete }: ConfessionGateModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/70 bg-paper p-6 shadow-soft md:p-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose/10 text-rose">
            <Heart size={21} />
          </span>
          <div>
            <p className="text-sm text-ink/60">只给 {recipientName} 的小小仪式</p>
            <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          </div>
        </div>
        <div className="prose-text rounded-xl border border-ink/10 bg-white/70 p-5 text-[15px] text-ink/80">{body}</div>
        <div className="mt-6 flex justify-end">
          <button className="btn btn-primary" onClick={onComplete}>
            我读完啦，继续看小说
          </button>
        </div>
      </div>
    </div>
  );
}
