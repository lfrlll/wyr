"use client";

type StreamOutputProps = {
  title: string;
  content: string;
  placeholder?: string;
};

export function StreamOutput({ title, content, placeholder = "等待生成内容..." }: StreamOutputProps) {
  return (
    <section className="rounded-xl border border-ink/10 bg-white/70">
      <div className="border-b border-ink/10 px-4 py-3">
        <h3 className="font-semibold text-ink">{title}</h3>
      </div>
      <div className="prose-text min-h-64 max-h-[34rem] overflow-auto p-4 text-sm text-ink/80">{content || placeholder}</div>
    </section>
  );
}
