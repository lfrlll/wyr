"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { readJson } from "@/lib/http-client";

export default function SettingsPage() {
  const [locked, setLocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [recipientName, setRecipientName] = useState("王悦然");
  const [confessionTitle, setConfessionTitle] = useState("给王悦然的一封信");
  const [confessionBody, setConfessionBody] = useState("");
  const [renderedBody, setRenderedBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [resetSaved, setResetSaved] = useState(false);

  async function loadSettings(code = accessCode) {
    const response = await fetch("/api/settings", {
      headers: code ? { "x-owner-access-code": code } : {}
    });
    if (response.status === 401) {
      setLocked(true);
      return;
    }
    const data = await readJson<{
      setting?: { recipientName: string; confessionTitle: string; confessionBody?: string | null };
      editableBody?: string;
      renderedBody?: string;
    }>(response);
    if (!data.setting) {
      setLocked(true);
      return;
    }
    setRecipientName(data.setting.recipientName);
    setConfessionTitle(data.setting.confessionTitle);
    setConfessionBody(data.editableBody || data.setting.confessionBody || "");
    setRenderedBody(data.renderedBody || "");
    setLocked(false);
  }

  useEffect(() => {
    loadSettings().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(accessCode ? { "x-owner-access-code": accessCode } : {})
      },
      body: JSON.stringify({ recipientName, confessionTitle, confessionBody })
    });
    if (response.status === 401) {
      setLocked(true);
      return;
    }
    const data = await readJson<{ editableBody?: string; renderedBody?: string }>(response);
    setConfessionBody(data.editableBody || confessionBody);
    setRenderedBody(data.renderedBody || "");
    setSaved(response.ok);
    window.setTimeout(() => setSaved(false), 1800);
  }

  async function resetGate() {
    if (!window.confirm("确定要让表白信下一次查看/下载时重新出现吗？")) return;
    const response = await fetch("/api/settings/reset-gate", {
      method: "POST",
      headers: accessCode ? { "x-owner-access-code": accessCode } : {}
    });
    if (response.status === 401) {
      setLocked(true);
      return;
    }
    setResetSaved(response.ok);
    window.setTimeout(() => setResetSaved(false), 2200);
  }

  if (locked) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-5 py-8">
        <section className="surface w-full rounded-2xl p-6">
          <p className="text-sm text-ink/60">隐藏入口</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink">主人访问口令</h1>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              loadSettings(accessCode).catch(() => undefined);
            }}
          >
            <input
              className="field"
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="输入 Railway 里配置的 OWNER_ACCESS_CODE"
            />
            <button className="btn btn-primary w-full" type="submit">
              进入
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="surface rounded-2xl p-5">
        <p className="text-sm text-ink/60">隐藏入口</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">主人设置</h1>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-semibold text-ink">收信人名称</span>
            <input className="field" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-ink">信件标题</span>
            <input className="field" value={confessionTitle} onChange={(event) => setConfessionTitle(event.target.value)} />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-ink">完整信件正文</span>
            <textarea className="field min-h-96 leading-7" value={confessionBody} onChange={(event) => setConfessionBody(event.target.value)} placeholder="这里编辑整封信，保存后会覆盖旧版本。" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={save}>
              <Save size={18} />
              保存并覆盖旧信
            </button>
            <button className="btn btn-secondary" onClick={() => loadSettings().catch(() => undefined)}>
              <RotateCcw size={18} />
              重新载入已保存内容
            </button>
          </div>
          {saved && <p className="text-sm text-sage">已保存。</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white/70 p-5">
        <p className="text-sm text-ink/60">预览</p>
        <h2 className="mt-1 text-2xl font-semibold text-ink">{confessionTitle}</h2>
        <div className="prose-text mt-5 rounded-xl border border-ink/10 bg-paper/70 p-5 text-sm text-ink/80">{renderedBody}</div>
        <div className="mt-5 border-t border-ink/10 pt-5">
          <h3 className="font-semibold text-ink">惊喜出现次数</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">重置后，下一次查看正文或下载 Word 时会重新出现这封信。</p>
          <button className="btn btn-secondary mt-4" onClick={resetGate}>
            <RotateCcw size={18} />
            重置表白信出现状态
          </button>
          {resetSaved && <p className="mt-3 text-sm text-sage">已重置，下次会重新出现。</p>}
        </div>
      </section>
    </main>
  );
}
