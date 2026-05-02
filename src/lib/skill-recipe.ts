import { getSelectedSkills, type NovelSkill, skillGroupLabels, type SkillGroup } from "@/lib/novel-skills";

const groupOrder: SkillGroup[] = ["content", "style", "emotion", "intimacy", "structure", "character", "pacing", "continuity"];

export function buildSkillRecipe(selectedSkillIds: string[]): string {
  const selected = getSelectedSkills(selectedSkillIds);
  const grouped = selected.reduce<Record<string, NovelSkill[]>>((acc, skill) => {
    acc[skill.group] = [...(acc[skill.group] ?? []), skill];
    return acc;
  }, {});

  return groupOrder
    .filter((group) => grouped[group]?.length)
    .map((group) => {
      const entries = grouped[group]
        .map((skill) => {
          const directives = skill.promptDirectives.map((item, index) => `${index + 1}. ${item}`).join("\n");
          const negatives = skill.negativeDirectives?.length
            ? `\n写作边界：\n${skill.negativeDirectives.map((item, index) => `${index + 1}. ${item}`).join("\n")}`
            : "\n写作边界：\n1. 避免与作品既定人设、情感阶段和安全边界冲突。";
          return `- ${skill.name}：${skill.shortDescription}\n适合场景：${skill.bestFor}\n写作指令：\n${directives}${negatives}`;
        })
        .join("\n\n");
      return `【${skillGroupLabels[group]}】\n${entries}`;
    })
    .join("\n\n");
}

export function getSkillWarnings(selectedSkillIds: string[]) {
  const selected = getSelectedSkills(selectedSkillIds);
  const intimacyCount = selected.filter((skill) => skill.group === "intimacy").length;
  const warnings: string[] = [];
  if (intimacyCount > 1) {
    warnings.push("亲密度 Skill 同一时间只能选择一个。");
  }
  if (selected.some((skill) => skill.id === "content-campus-slowburn") && selected.some((skill) => skill.id === "intimacy-4-high-tension")) {
    warnings.push("校园慢热与高张力亲密容易冲突；若角色未成年，系统会强制保持清水和适龄表达。");
  }
  return warnings;
}
