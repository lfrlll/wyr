"use client";

import { SkillCard } from "@/components/SkillCard";
import { novelSkills, skillGroupLabels, type SkillGroup } from "@/lib/novel-skills";
import { buildSkillRecipe, getSkillWarnings } from "@/lib/skill-recipe";

type SkillSelectorProps = {
  selectedSkillIds: string[];
  onChange: (ids: string[]) => void;
};

const groupOrder: SkillGroup[] = ["content", "style", "emotion", "intimacy", "structure", "character", "pacing", "continuity"];

export function SkillSelector({ selectedSkillIds, onChange }: SkillSelectorProps) {
  const warnings = getSkillWarnings(selectedSkillIds);

  function toggle(id: string) {
    const skill = novelSkills.find((item) => item.id === id);
    if (!skill) return;
    if (selectedSkillIds.includes(id)) {
      onChange(selectedSkillIds.filter((item) => item !== id));
      return;
    }
    if (skill.group === "intimacy") {
      onChange([...selectedSkillIds.filter((item) => novelSkills.find((s) => s.id === item)?.group !== "intimacy"), id]);
      return;
    }
    onChange([...selectedSkillIds, id]);
  }

  return (
    <div className="space-y-7">
      {groupOrder.map((group) => (
        <section key={group}>
          <h3 className="mb-3 text-base font-semibold text-ink">{skillGroupLabels[group]}</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {novelSkills
              .filter((skill) => skill.group === group)
              .map((skill) => (
                <SkillCard key={skill.id} skill={skill} selected={selectedSkillIds.includes(skill.id)} onToggle={toggle} />
              ))}
          </div>
        </section>
      ))}
      {warnings.length > 0 && (
        <div className="rounded-xl border border-rose/20 bg-rose/10 p-4 text-sm text-rose">
          {warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
      <div className="rounded-xl border border-ink/10 bg-mist/70 p-4">
        <h3 className="mb-2 font-semibold text-ink">当前写作配方摘要</h3>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-sm leading-6 text-ink/70">
          {buildSkillRecipe(selectedSkillIds)}
        </pre>
      </div>
    </div>
  );
}
