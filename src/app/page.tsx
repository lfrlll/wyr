import Link from "next/link";
import { ArrowRight, BookOpen, FileText, PenLine, Sparkles } from "lucide-react";

const steps = [
  { title: "生成完整大纲", text: "输入灵感或上传 Word，把零散设定整理成长篇可执行大纲。", icon: FileText },
  { title: "选择写作 Skill", text: "题材、文风、关系、亲密度、节奏和伏笔都能组合成配方。", icon: Sparkles },
  { title: "分章生成正文", text: "按章节流式写作，并持续维护长篇记忆和人物状态。", icon: PenLine }
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <span className="badge mb-5">长篇耽美小说 · LLM 创作工作台</span>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-7xl">Yueran Novel Studio</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">给王悦然的长篇耽美小说创作小屋。大纲、Skill、分章生成、长篇记忆和 Word 导出，都放在一个安静好用的写作流程里。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/studio">
              开始写小说 <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary" href="/settings">
              配置表白信
            </Link>
          </div>
        </div>

        <div className="surface relative overflow-hidden rounded-3xl p-5">
          <div className="rounded-2xl border border-ink/10 bg-white/70 p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage/10 text-sage">
                <BookOpen size={22} />
              </span>
              <div>
                <p className="text-sm text-ink/60">Writing Console</p>
                <h2 className="font-semibold text-ink">长篇创作流程</h2>
              </div>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-xl border border-ink/10 bg-paper/80 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{index + 1}</span>
                    <step.icon className="text-plum" size={19} />
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
