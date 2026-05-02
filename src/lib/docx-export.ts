import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { Chapter, Project } from "@prisma/client";
import { buildSkillRecipe } from "@/lib/skill-recipe";

type ExportProject = Project & { chapters: Chapter[] };

function textParagraph(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        font: "SimSun",
        size: 24
      })
    ],
    indent: { firstLine: 480 },
    spacing: { after: 180, line: 360 },
    alignment: AlignmentType.LEFT
  });
}

function splitParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function exportProjectDocx(project: ExportProject) {
  const skillIds = JSON.parse(project.selectedSkillIds || "[]") as string[];
  const children: Paragraph[] = [
    new Paragraph({
      text: project.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 }
    }),
    new Paragraph({
      children: [new TextRun({ text: `生成时间：${new Date().toLocaleString("zh-CN")}`, font: "SimSun", size: 22 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 520 }
    }),
    new Paragraph({ text: "Skill 配方摘要", heading: HeadingLevel.HEADING_1 }),
    ...splitParagraphs(buildSkillRecipe(skillIds)).map(textParagraph)
  ];

  if (project.editedOutline) {
    children.push(new Paragraph({ text: "大纲", heading: HeadingLevel.HEADING_1 }));
    children.push(...splitParagraphs(project.editedOutline).map(textParagraph));
  }

  children.push(new Paragraph({ text: "正文目录", heading: HeadingLevel.HEADING_1 }));
  for (const chapter of project.chapters) {
    children.push(textParagraph(`第 ${chapter.index} 章 ${chapter.title}`));
  }

  for (const chapter of project.chapters) {
    children.push(new Paragraph({ text: `第 ${chapter.index} 章 ${chapter.title}`, heading: HeadingLevel.HEADING_1 }));
    children.push(...splitParagraphs(chapter.content).map(textParagraph));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "SimSun",
            size: 24
          }
        }
      }
    },
    sections: [{ properties: {}, children }]
  });

  return Packer.toBuffer(doc);
}

export function safeDocxFilename(projectId: string) {
  return `yueran-novel-${projectId}.docx`;
}
