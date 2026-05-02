# Yueran Novel Studio

一个专属于王悦然的长篇耽美小说大模型辅助创作网站。项目基于 Next.js App Router、TypeScript、Prisma + PostgreSQL、流式 LLM API、Word 解析与导出实现。

## 本地运行

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

```env
LLM_BASE_URL=https://yunwu.ai/v1
LLM_API_KEY=replace_me
DEFAULT_MODEL=gemini-3.1-pro-preview
AVAILABLE_MODELS=gemini-3.1-pro-preview,gemini-2.5-pro,gemini-2.5-flash,gpt-4.1,gpt-4.1-mini,claude-sonnet-4,deepseek-chat
APP_OWNER_NAME=你的名字
RECIPIENT_NAME=王悦然
GITHUB_NOVEL_TOKEN=replace_with_github_token
GITHUB_NOVEL_REPO=lfrlll/wyr
GITHUB_NOVEL_BRANCH=main
GITHUB_NOVEL_PATH_PREFIX=novels
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

所有模型调用都走服务端 API，不会把 API Key 暴露给前端。

## 核心页面

- `/`：首页
- `/studio`：三步创作工作台
- `/reader/[projectId]`：小说阅读页
- `/settings`：表白信设置

## Railway 部署

1. 把代码推到 GitHub。
2. Railway 新建 Project，选择 `Deploy from GitHub repo`。
3. 在 Railway 里添加 PostgreSQL 服务。
4. 在网站服务的 Variables 里配置：

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_PUBLIC_URL=${{Postgres.DATABASE_PUBLIC_URL}}
LLM_BASE_URL=https://yunwu.ai/v1
LLM_API_KEY=你的云雾 API Key
DEFAULT_MODEL=gemini-3.1-pro-preview
AVAILABLE_MODELS=gemini-3.1-pro-preview,gemini-2.5-pro,gemini-2.5-flash,gpt-4.1,gpt-4.1-mini,claude-sonnet-4,deepseek-chat
APP_OWNER_NAME=你的名字
RECIPIENT_NAME=王悦然
```

5. Railway 会读取 `railway.json`，构建时执行 `npm run build`，启动时同步 Prisma schema 并启动服务：

```bash
npx prisma db push && npm run start
```

注意：不要把真实 API Key 写进 Git 仓库，只放在 Railway Variables。

如果 Railway 无法解析 `DATABASE_URL=${{Postgres.DATABASE_URL}}`，可以只配置：

```env
DATABASE_PUBLIC_URL=${{Postgres.DATABASE_PUBLIC_URL}}
```

启动命令会在 `DATABASE_URL` 为空时自动使用 `DATABASE_PUBLIC_URL`。

## 生成小说归档到 GitHub

生成完成后，后端会自动把小说正文保存为 Markdown 文件到 GitHub。此功能不改变前端。

在 Railway 网站服务 Variables 里配置：

```env
GITHUB_NOVEL_TOKEN=你的 GitHub fine-grained token
GITHUB_NOVEL_REPO=lfrlll/wyr
GITHUB_NOVEL_BRANCH=main
GITHUB_NOVEL_PATH_PREFIX=novels
```

`GITHUB_NOVEL_TOKEN` 需要对目标仓库有 `Contents: Read and write` 权限。未配置 token 时，归档会跳过，不影响小说生成。
