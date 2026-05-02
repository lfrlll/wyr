"use client";

import { FileUp } from "lucide-react";
import { useState } from "react";

type DocxUploaderProps = {
  projectId: string | null;
  ensureProject: () => Promise<string>;
  onUploaded: (text: string) => void;
};

export function DocxUploader({ projectId, ensureProject, onUploaded }: DocxUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setFileName(file.name);
    try {
      const id = projectId || (await ensureProject());
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/projects/${id}/upload-docx`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "上传失败");
      onUploaded(data.text || "");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-ink/20 bg-white/60 px-4 py-3 hover:bg-white/80">
      <span className="flex min-w-0 items-center gap-3 text-sm text-ink/70">
        <FileUp size={18} />
        <span className="truncate">{fileName || "上传 Word 文档（.docx）"}</span>
      </span>
      <span className="badge">{uploading ? "解析中" : "选择文件"}</span>
      <input
        className="hidden"
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </label>
  );
}
