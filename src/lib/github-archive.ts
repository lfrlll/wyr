import type { Chapter, Project } from "@prisma/client";
import { db } from "@/lib/db";
import { buildSkillRecipe } from "@/lib/skill-recipe";

type ArchiveProject = Project & { chapters: Chapter[] };

type GitHubContentResponse = {
  sha?: string;
};

function cleanEnv(value?: string | null) {
  return value?.trim().replace(/^["']|["']$/g, "") || "";
}

function slugify(input: string) {
  const slug = input
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "untitled";
}

function buildNovelMarkdown(project: ArchiveProject) {
  const skillIds = JSON.parse(project.selectedSkillIds || "[]") as string[];
  const generatedAt = new Date().toISOString();

  const parts = [
    `# ${project.title}`,
    "",
    `- Project ID: ${project.id}`,
    `- Generated At: ${generatedAt}`,
    `- Model: ${project.modelId}`,
    `- Target Word Count: ${project.targetWordCount}`,
    `- Generated Characters: ${project.totalGeneratedChars}`,
    "",
    "## Skill 配方",
    "",
    buildSkillRecipe(skillIds),
    "",
    "## 大纲",
    "",
    project.editedOutline || project.outline || "无",
    "",
    "## 长篇记忆",
    "",
    project.continuityBible || "无",
    "",
    "## 正文",
    ""
  ];

  for (const chapter of project.chapters) {
    parts.push(`### 第 ${chapter.index} 章 ${chapter.title}`, "", chapter.content, "");
  }

  return parts.join("\n");
}

async function fetchExistingFileSha(input: {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
}) {
  const response = await fetch(
    `https://api.github.com/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(input.branch)}`,
    {
      headers: {
        Authorization: `Bearer ${input.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "yueran-novel-studio"
      }
    }
  );
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`GitHub 查询文件失败：${response.status}`);
  const data = (await response.json()) as GitHubContentResponse;
  return data.sha;
}

async function putFileToGitHub(input: {
  owner: string;
  repo: string;
  path: string;
  branch: string;
  token: string;
  message: string;
  content: string;
}) {
  const sha = await fetchExistingFileSha(input);
  const response = await fetch(
    `https://api.github.com/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${input.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "yueran-novel-studio"
      },
      body: JSON.stringify({
        message: input.message,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        branch: input.branch,
        ...(sha ? { sha } : {})
      })
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `GitHub 写入文件失败：${response.status}`);
  }
}

export async function archiveProjectToGitHub(projectId: string) {
  const token = cleanEnv(process.env.GITHUB_NOVEL_TOKEN);
  const repoFullName = cleanEnv(process.env.GITHUB_NOVEL_REPO);
  const branch = cleanEnv(process.env.GITHUB_NOVEL_BRANCH) || "main";
  const prefix = cleanEnv(process.env.GITHUB_NOVEL_PATH_PREFIX) || "novels";

  if (!token || !repoFullName) return { skipped: true };

  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) throw new Error("GITHUB_NOVEL_REPO 必须是 owner/repo 格式");

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { chapters: { orderBy: { index: "asc" } } }
  });
  if (!project) throw new Error("项目不存在，无法归档到 GitHub");

  const date = new Date().toISOString().slice(0, 10);
  const path = `${prefix.replace(/^\/+|\/+$/g, "")}/${date}-${slugify(project.title)}-${project.id}.md`;

  await putFileToGitHub({
    owner,
    repo,
    branch,
    token,
    path,
    message: `Archive novel: ${project.title}`,
    content: buildNovelMarkdown(project)
  });

  return { skipped: false, path };
}
