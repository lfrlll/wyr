"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import type { NovelSkill } from "@/lib/novel-skills";
import { skillGroupLabels } from "@/lib/novel-skills";

type SkillCardProps = {
  skill: NovelSkill;
  selected: boolean;
  onToggle: (id: string) => void;
};

export function SkillCard({ skill, selected, onToggle }: SkillCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(skill.id)}
      className={clsx(
        "group grid h-full grid-rows-[auto_1fr_auto] rounded-xl border p-4 text-left transition",
        selected ? "border-plum/50 bg-white shadow-soft" : "border-ink/10 bg-white/60 hover:border-plum/30 hover:bg-white/80"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="badge">{skillGroupLabels[skill.group]}</span>
          <h3 className="mt-2 font-semibold text-ink">{skill.name}</h3>
        </div>
        <span
          className={clsx(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-plum bg-plum text-white" : "border-ink/20 text-transparent"
          )}
        >
          <Check size={14} />
        </span>
      </div>
      <p className="text-sm leading-6 text-ink/70">{skill.shortDescription}</p>
      <p className="mt-3 border-t border-ink/10 pt-3 text-xs leading-5 text-ink/60">适合：{skill.bestFor}</p>
    </button>
  );
}
