"use client";

type ProgressPanelProps = {
  title: string;
  modelId: string;
  currentChapter?: string;
  generatedChars: number;
  targetWordCount: number;
  percent: number;
};

export function ProgressPanel({ title, modelId, currentChapter, generatedChars, targetWordCount, percent }: ProgressPanelProps) {
  return (
    <aside className="surface rounded-2xl p-5">
      <p className="text-sm text-ink/60">当前项目</p>
      <h2 className="mt-1 text-xl font-semibold text-ink">{title || "未命名作品"}</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">模型</dt>
          <dd className="text-right font-medium text-ink">{modelId}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">当前章节</dt>
          <dd className="text-right font-medium text-ink">{currentChapter || "尚未开始"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink/60">已生成</dt>
          <dd className="text-right font-medium text-ink">
            {generatedChars} / {targetWordCount}
          </dd>
        </div>
      </dl>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/10">
        <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
      <p className="mt-2 text-right text-sm font-semibold text-sage">{percent}%</p>
    </aside>
  );
}
