"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Loader2, Save, Wand2 } from "lucide-react";
import { ConfessionGateModal } from "@/components/ConfessionGateModal";
import { DocxUploader } from "@/components/DocxUploader";
import { EncouragementModal } from "@/components/EncouragementModal";
import { ModelSelector } from "@/components/ModelSelector";
import { OutlineEditor } from "@/components/OutlineEditor";
import { ProgressPanel } from "@/components/ProgressPanel";
import { SkillSelector } from "@/components/SkillSelector";
import { StreamOutput } from "@/components/StreamOutput";
import { readJson } from "@/lib/http-client";
import { defaultSkillIds } from "@/lib/novel-skills";

type StreamEvent = {
  event: string;
  data: Record<string, unknown>;
};

type GateInfo = {
  title: string;
  body: string;
  recipientName: string;
};

async function readSse(response: Response, onEvent: (event: StreamEvent) => void) {
  if (!response.body) throw new Error("浏览器没有收到流式响应");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const packets = buffer.split("\n\n");
    buffer = packets.pop() || "";

    for (const packet of packets) {
      const eventLine = packet.split("\n").find((line) => line.startsWith("event:"));
      const dataLine = packet.split("\n").find((line) => line.startsWith("data:"));
      if (!eventLine || !dataLine) continue;
      onEvent({
        event: eventLine.replace("event:", "").trim(),
        data: JSON.parse(dataLine.replace("data:", "").trim())
      });
    }
  }
}

export default function StudioPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("未命名作品");
  const [sourceText, setSourceText] = useState("");
  const [uploadedDocText, setUploadedDocText] = useState("");
  const [modelId, setModelId] = useState("");
  const [outline, setOutline] = useState("");
  const [outlineStream, setOutlineStream] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(120000);
  const [chapterWordCount, setChapterWordCount] = useState(4000);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(defaultSkillIds);
  const [novelOutput, setNovelOutput] = useState("");
  const [currentChapter, setCurrentChapter] = useState("");
  const [generatedChars, setGeneratedChars] = useState(0);
  const [percent, setPercent] = useState(0);
  const [generatedDone, setGeneratedDone] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [gateInfo, setGateInfo] = useState<GateInfo | null>(null);
  const [pendingAction, setPendingAction] = useState<"view" | "download" | null>(null);
  const [encouragement, setEncouragement] = useState("");

  const steps = useMemo(() => ["完整大纲", "Skill 与字数", "生成小说"], []);

  const ensureProject = useCallback(async () => {
    const payload = { title, sourceText, modelId };
    if (projectId) {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return projectId;
    }

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await readJson<{ error?: string; project?: { id: string } }>(response);
    if (!response.ok) throw new Error(data.error || "创建项目失败");
    if (!data.project?.id) throw new Error("创建项目失败：没有收到项目 ID");
    setProjectId(data.project.id);
    return data.project.id;
  }, [modelId, projectId, sourceText, title]);

  async function generateOutline() {
    setError("");
    setBusy("outline");
    setOutlineStream("");
    setOutline("");
    try {
      const id = await ensureProject();
      const response = await fetch(`/api/projects/${id}/outline/stream`, { method: "POST" });
      await readSse(response, ({ event, data }) => {
        if (event === "delta") {
          setOutlineStream((prev) => prev + String(data.text || ""));
          setOutline((prev) => prev + String(data.text || ""));
        }
        if (event === "error") setError(String(data.message || "大纲生成失败"));
        if (event === "done") setStep(2);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "大纲生成失败");
    } finally {
      setBusy("");
    }
  }

  async function saveOutline() {
    if (!projectId || !outline.trim()) return;
    setBusy("save-outline");
    setError("");
    try {
      const response = await fetch(`/api/projects/${projectId}/outline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editedOutline: outline })
      });
      const data = await readJson<{ error?: string }>(response);
      if (!response.ok) throw new Error(data.error || "保存失败");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setBusy("");
    }
  }

  async function saveSkills() {
    const id = await ensureProject();
    const response = await fetch(`/api/projects/${id}/skills`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedSkillIds, targetWordCount, chapterWordCount })
    });
    const data = await readJson<{ error?: string }>(response);
    if (!response.ok) throw new Error(data.error || "保存 Skill 失败");
    setStep(3);
    return id;
  }

  async function generateNovel() {
    if ((novelOutput || generatedDone) && !window.confirm("重新生成会覆盖当前项目已经保存的章节，确定继续吗？")) {
      return;
    }
    setBusy("novel");
    setError("");
    setNovelOutput("");
    setGeneratedChars(0);
    setPercent(0);
    setGeneratedDone(false);
    try {
      const id = await saveSkills();
      const response = await fetch(`/api/projects/${id}/generate/stream`, { method: "POST" });
      await readSse(response, ({ event, data }) => {
        if (event === "chapter_start") setCurrentChapter(`第 ${data.index} 章 ${data.title}`);
        if (event === "delta") setNovelOutput((prev) => prev + String(data.text || ""));
        if (event === "progress") {
          setGeneratedChars(Number(data.generatedChars || 0));
          setPercent(Number(data.percent || 0));
        }
        if (event === "error") setError(String(data.message || "小说生成失败"));
        if (event === "done") {
          setPercent(100);
          setGeneratedDone(true);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "小说生成失败");
    } finally {
      setBusy("");
    }
  }

  async function performDownload() {
    if (!projectId) return;
    const response = await fetch(`/api/projects/${projectId}/export.docx`);
    if (response.status === 423) {
      await requestGate("download");
      return;
    }
    if (!response.ok) {
      const data = await readJson<{ error?: string }>(response);
      setError(data.error || "导出失败");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yueran-novel-${projectId}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function performView() {
    if (projectId) router.push(`/reader/${projectId}`);
  }

  async function requestGate(action: "view" | "download") {
    if (!projectId) return;
    setPendingAction(action);
    const status = await fetch(`/api/projects/${projectId}/gate-status`).then((response) =>
      readJson<{ confessionRequired?: boolean; title: string; body: string; recipientName: string }>(response)
    );
    if (status.confessionRequired) {
      setGateInfo({ title: status.title, body: status.body, recipientName: status.recipientName });
      return;
    }
    const message = await fetch(`/api/gate/encouragement?projectId=${encodeURIComponent(projectId)}`).then((response) => readJson<{ message?: string }>(response));
    setEncouragement(message.message || "");
  }

  async function completeConfession() {
    if (!projectId || !pendingAction) return;
    await fetch("/api/gate/complete-confession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId })
    });
    const action = pendingAction;
    setGateInfo(null);
    setPendingAction(null);
    if (action === "download") await performDownload();
    if (action === "view") performView();
  }

  async function continueAfterEncouragement() {
    const action = pendingAction;
    setPendingAction(null);
    setEncouragement("");
    if (action === "download") await performDownload();
    if (action === "view") performView();
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60">三步创作 Wizard</p>
          <h1 className="text-3xl font-semibold text-ink">创作工作台</h1>
        </div>
        <div className="flex gap-2">
          {steps.map((label, index) => (
            <button key={label} className={`btn ${step === index + 1 ? "btn-primary" : "btn-secondary"}`} onClick={() => setStep(index + 1)}>
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-5 rounded-xl border border-rose/20 bg-rose/10 p-4 text-sm text-rose">{error}</div>}

      {step === 1 && (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface rounded-2xl p-5">
            <div className="grid gap-4">
              <label>
                <span className="mb-2 block text-sm font-semibold text-ink">作品标题</span>
                <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-ink">创意、设定、片段、人物关系</span>
                <textarea className="field min-h-56 leading-7" value={sourceText} onChange={(event) => setSourceText(event.target.value)} />
              </label>
              <DocxUploader projectId={projectId} ensureProject={ensureProject} onUploaded={setUploadedDocText} />
              {uploadedDocText && <p className="rounded-xl bg-mist/70 p-3 text-sm text-sage">Word 已解析：{uploadedDocText.length} 字符</p>}
              <ModelSelector value={modelId} onChange={setModelId} />
              <button className="btn btn-primary" disabled={busy === "outline"} onClick={generateOutline}>
                {busy === "outline" ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                生成完整大纲
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <StreamOutput title="大纲流式输出" content={outlineStream} />
            <OutlineEditor value={outline} onChange={setOutline} />
            <button className="btn btn-secondary" disabled={!outline.trim() || busy === "save-outline"} onClick={saveOutline}>
              <Save size={18} />
              保存大纲并进入下一步
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="surface rounded-2xl p-5">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-ink">目标总字数</span>
              <input className="field" type="number" value={targetWordCount} onChange={(event) => setTargetWordCount(Number(event.target.value))} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-ink">每章约字数</span>
              <input className="field" type="number" value={chapterWordCount} onChange={(event) => setChapterWordCount(Number(event.target.value))} />
            </label>
          </div>
          <SkillSelector selectedSkillIds={selectedSkillIds} onChange={setSelectedSkillIds} />
          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary" onClick={async () => saveSkills().catch((err) => setError(err.message))}>
              进入生成
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <ProgressPanel title={title} modelId={modelId || "gpt-4.1"} currentChapter={currentChapter} generatedChars={generatedChars} targetWordCount={targetWordCount} percent={percent} />
          <div className="space-y-4">
            <div className="surface rounded-2xl p-5">
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary" disabled={busy === "novel"} onClick={generateNovel}>
                  {busy === "novel" ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  开始分章生成
                </button>
                <button className="btn btn-secondary" disabled>
                  暂停
                </button>
                <button className="btn btn-secondary" disabled={busy === "novel" || !projectId || !generatedDone} onClick={() => requestGate("view")}>
                  <Eye size={18} />
                  查看正文
                </button>
                <button className="btn btn-soft" disabled={busy === "novel" || !projectId || !generatedDone} onClick={() => requestGate("download")}>
                  <Download size={18} />
                  下载 Word
                </button>
              </div>
            </div>
            <StreamOutput title="正文流式输出" content={novelOutput} placeholder="点击开始分章生成后，正文会实时出现在这里。" />
          </div>
        </section>
      )}

      <ConfessionGateModal open={Boolean(gateInfo)} title={gateInfo?.title || ""} body={gateInfo?.body || ""} recipientName={gateInfo?.recipientName || "王悦然"} onComplete={completeConfession} />
      {encouragement && <EncouragementModal message={encouragement} onContinue={continueAfterEncouragement} />}
    </main>
  );
}
