"use client";

import { useEffect, useState } from "react";
import { readJson } from "@/lib/http-client";

type ModelSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/models")
      .then((response) => readJson<{ models?: string[] }>(response))
      .then((data) => {
        const nextModels = Array.isArray(data.models) ? data.models : [];
        setModels(nextModels);
        if (!value && nextModels[0]) onChange(nextModels[0]);
      })
      .catch(() => setModels(value ? [value] : ["gpt-4.1"]));
  }, [onChange, value]);

  return (
    <div className="grid gap-3">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-ink">模型配置</span>
        <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
          {(models.length ? models : [value || "gpt-4.1"]).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-ink">手动模型 ID</span>
        <input
          className="field"
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder="粘贴云雾后台可用的模型 ID"
        />
      </label>
    </div>
  );
}
