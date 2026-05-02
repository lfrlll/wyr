"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfessionGateModal } from "@/components/ConfessionGateModal";
import { EncouragementModal } from "@/components/EncouragementModal";
import { readJson } from "@/lib/http-client";

type Chapter = {
  id: string;
  index: number;
  title: string;
  content: string;
};

type Project = {
  id: string;
  title: string;
  status: string;
  chapters: Chapter[];
};

type GateInfo = {
  title: string;
  body: string;
  recipientName: string;
};

export default function ReaderPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [project, setProject] = useState<Project | null>(null);
  const [gateInfo, setGateInfo] = useState<GateInfo | null>(null);
  const [encouragement, setEncouragement] = useState("");
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((response) => readJson<{ project?: Project }>(response))
      .then((data) => {
        if (data.project) setProject(data.project);
      })
      .catch(() => undefined);

    fetch(`/api/projects/${projectId}/gate-status`)
      .then((response) => readJson<{ confessionRequired?: boolean; title: string; body: string; recipientName: string }>(response))
      .then(async (status) => {
        if (status.confessionRequired) {
          setGateInfo({ title: status.title, body: status.body, recipientName: status.recipientName });
          return;
        }
        const message = await fetch(`/api/gate/encouragement?projectId=${encodeURIComponent(projectId)}`).then((response) => readJson<{ message?: string }>(response));
        setEncouragement(message.message || "");
      })
      .catch(() => setAllowed(true));
  }, [projectId]);

  async function completeConfession() {
    await fetch("/api/gate/complete-confession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId })
    });
    setGateInfo(null);
    setAllowed(true);
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      <article className="rounded-2xl border border-ink/10 bg-white/75 p-5 shadow-soft md:p-8">
        <p className="text-sm text-ink/60">阅读页</p>
        <h1 className="mt-1 text-3xl font-semibold text-ink">{project?.title || "加载中..."}</h1>
        {allowed && project && (
          <div className="mt-8 space-y-9">
            {project.chapters.map((chapter) => (
              <section key={chapter.id}>
                <h2 className="mb-4 text-xl font-semibold text-ink">
                  第 {chapter.index} 章 {chapter.title}
                </h2>
                <div className="prose-text text-[15px] text-ink/80">{chapter.content}</div>
              </section>
            ))}
          </div>
        )}
        {!allowed && !gateInfo && !encouragement && <p className="mt-6 text-ink/60">正在准备正文...</p>}
      </article>

      <ConfessionGateModal open={Boolean(gateInfo)} title={gateInfo?.title || ""} body={gateInfo?.body || ""} recipientName={gateInfo?.recipientName || "王悦然"} onComplete={completeConfession} />
      {encouragement && (
        <EncouragementModal
          message={encouragement}
          onContinue={() => {
            setEncouragement("");
            setAllowed(true);
          }}
        />
      )}
    </main>
  );
}
