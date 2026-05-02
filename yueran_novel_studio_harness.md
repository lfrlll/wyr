# Yueran Novel Studio Harness

> 用途：将本文档直接交给 Codex，让它根据此 harness 生成完整可运行的网站项目。  
> 项目定位：一个专属于“王悦然”的长篇耽美小说大模型辅助创作网站。

---

## 1. 角色设定

你是一个资深全栈工程师、LLM 应用架构师和大模型 harness 工程师。  
请根据以下 harness 生成一个完整可运行的网站项目。

---

## 2. 项目名称

**Yueran Novel Studio**

---

## 3. 项目目标

制作一个专属于 **王悦然** 的耽美小说辅助创作网站。

网站用于帮助她使用大模型创作长篇耽美小说，支持十几万字级别的小说生成，强调：

- 情感细腻
- 人物关系递进
- 长篇一致性
- 风格可控
- Skill 可组合
- 模型可切换
- Word 文档可输入
- 流式生成
- Word 格式导出

---

## 4. 核心使用流程

核心使用流程必须严格分为三步。

---

### Step 1：生成完整大纲

用户输入：

1. 手动输入的创意、设定、片段、人物关系、想法。
2. 上传 Word 文档 `.docx`，系统需要提取其中的文字内容。
3. 选择调用的大模型配置，支持中转 API。
4. 可选填写作品标题、主角姓名、题材偏好、禁忌内容、目标读者感受。

系统输出：

1. 完整长篇小说大纲。
2. 大纲需要包括：
   - 作品定位
   - 主线
   - 人物小传
   - 人物关系
   - 世界观
   - 情感线
   - 冲突线
   - 章节规划
   - 伏笔
   - 高潮
   - 结局
   - 长篇节奏规划
3. 大纲必须可以编辑。
4. 后续生成应以用户编辑后的大纲为准。

---

### Step 2：选择 Skill 和目标字数

用户输入：

1. 选择多个写作 Skill。
2. 至少从以下四个角度选择：
   - 内容题材 Skill
   - 文风 Skill
   - 情感关系 Skill
   - 亲密度 / 瑟瑟指数 Skill
3. 还需要支持更多扩展维度：
   - 叙事结构 Skill
   - 人设张力 Skill
   - 节奏控制 Skill
   - 长篇一致性 Skill
   - 章节钩子 Skill
   - 伏笔回收 Skill
4. 输入目标总字数，例如 `100000`、`120000`、`150000`、`180000`。
5. 输入每章大约字数，例如 `3000` 到 `6000`。
6. 用户可以查看每个 Skill 的说明，并知道它会如何影响生成。

---

### Step 3：根据前两步生成小说

系统行为：

1. 根据完整大纲、用户编辑内容、Skill 选择、目标字数，进行长篇小说生成。
2. 必须使用流式输出。
3. 不能一次性要求模型生成十几万字，而是必须分章节、分块生成。
4. 每生成一章后，系统需要维护“长篇记忆 / continuity bible”，包括：
   - 已发生事件
   - 人物状态
   - 情感进展
   - 伏笔状态
   - 未解决冲突
   - 语言风格约束
   - 下一章衔接点
5. 前端实时显示：
   - 生成进度
   - 当前章节
   - 当前字数
   - 目标完成百分比
6. 生成结果必须持久化，刷新页面后不能丢失。
7. 最终提供 Word 下载接口，导出 `.docx`。

---

## 5. 特殊需求：首次表白 Gate

在第一次生成完成后，用户第一次查看或下载生成的 Word 之前，必须先展示一个给 **王悦然** 的表白页面 / 表白弹窗。

这个表白需求只在第一次生成、第一次查看 Word 前出现一次。

---

### 5.1 第一次表白逻辑

1. 当第一个项目生成完成后，用户点击“查看 Word”或“下载 Word”时，不要立刻打开或下载。
2. 先展示一个精心设计的表白信界面。
3. 表白信内容由网站拥有者填写，因此代码里不要写死完整内容。
4. 需要提供一个默认模板，其中包含可替换占位符。
5. 表白信标题建议为：`给王悦然的一封信`。
6. 表白信要温柔、真诚、克制、不油腻。
7. 展示完后，王悦然点击 `我读完啦，继续看小说` 按钮，系统才允许查看或下载 Word。
8. 这个状态必须服务端持久化，不能只存在 `localStorage`。
9. 一旦第一次表白完成，之后所有生成项目不再出现表白信。

---

### 5.2 之后的查看 / 下载逻辑

1. 第一次表白完成后，后续查看或下载 Word 时，改为展示一句温柔鼓励或夸奖的话。
2. 鼓励内容要围绕她“善良、敏感、可爱、偶尔自卑但值得被坚定喜欢”。
3. 这些话可以随机展示，不阻断下载太久。
4. 可以展示 2 到 3 秒后自动继续，也可以点击“继续”。

---

## 6. 推荐技术栈

1. Next.js App Router
2. TypeScript
3. React
4. Tailwind CSS
5. shadcn/ui 或者自行实现简洁 UI 组件
6. Prisma + SQLite，便于本地运行和持久化
7. Node.js 后端 API Routes
8. `docx` npm 包用于导出 Word
9. `mammoth` npm 包用于解析上传的 `.docx`
10. fetch 原生流式读取大模型中转 API

要求：

- 不要把 API Key 暴露到前端。
- 所有模型调用必须走服务端 API。

---

## 7. 环境变量

创建 `.env.example`：

```env
LLM_BASE_URL=https://your-relay-api.example.com/v1
LLM_API_KEY=replace_me
DEFAULT_MODEL=gpt-4.1
AVAILABLE_MODELS=gpt-4.1,gpt-4.1-mini,claude-sonnet-4,deepseek-chat
APP_OWNER_NAME=你的名字
RECIPIENT_NAME=王悦然
```

---

## 8. 中转 API 适配要求

1. 默认按 OpenAI Chat Completions 兼容格式调用：

```http
POST {LLM_BASE_URL}/chat/completions
```

2. Header：

```http
Authorization: Bearer ${LLM_API_KEY}
Content-Type: application/json
```

3. 支持 `stream: true`。
4. 前端选择的 `modelId` 传给后端。
5. 如果用户没有选择模型，使用 `DEFAULT_MODEL`。
6. 后端提供 `/api/models` 接口：
   - 优先读取 `AVAILABLE_MODELS`。
   - 如果没有配置，可以尝试请求 `LLM_BASE_URL/models`。
   - 请求失败时返回 `DEFAULT_MODEL`。
7. 需要实现一个 LLM adapter，避免业务代码散落 fetch 调用。

---

## 9. 页面设计

---

### 9.1 首页 `/`

功能：

1. 展示产品名：`Yueran Novel Studio`
2. 一句温柔副标题，例如：

> 给王悦然的长篇耽美小说创作小屋。

3. 按钮：`开始写小说`
4. 展示三步流程。

---

### 9.2 创作页 `/studio`

使用三步 Wizard。

---

#### Step 1：完整大纲

UI 内容：

1. 标题输入。
2. 创意文本输入 textarea。
3. Word 上传。
4. 模型选择。
5. 生成完整大纲按钮。
6. 流式显示大纲生成过程。
7. 大纲编辑器 textarea 或 markdown editor。
8. 保存大纲按钮。

---

#### Step 2：选择 Skill

UI 内容：

1. 目标总字数输入。
2. 每章目标字数输入。
3. Skill 选择区。
4. Skill 必须分组显示。
5. 每个 Skill 用卡片展示：
   - 名称
   - 分类
   - 适合场景
   - 生成影响
6. 支持多选。
7. 用户选择后显示“当前写作配方摘要”。
8. 进入生成按钮。

---

#### Step 3：生成小说

UI 内容：

1. 当前项目标题。
2. 当前模型。
3. 当前 Skill 配方。
4. 总目标字数。
5. 已生成字数。
6. 当前章节。
7. 进度条。
8. 流式正文输出区域。
9. 暂停按钮可以先不做真正暂停，但 UI 可以保留 disabled。
10. 生成完成后显示：
    - 查看正文
    - 下载 Word
    - 重新导出 Word

---

### 9.3 阅读页 `/reader/[projectId]`

1. 显示小说正文。
2. 如果首次表白未完成，访问阅读页也要先弹出表白弹窗。
3. 表白完成后显示正文。
4. 后续访问显示一句鼓励话，然后进入正文。

---

### 9.4 设置页 `/settings`

用于配置表白信内容。

1. 收信人名称，默认 `王悦然`。
2. 表白信标题，默认 `给王悦然的一封信`。
3. 表白信正文 textarea。
4. 保存按钮。
5. 如果没有填写正文，使用默认占位模板。
6. 这个页面可以简单实现，不需要复杂认证。

---

## 10. 数据库模型

使用 Prisma。

---

### 10.1 Project

```ts
Project {
  id: string cuid
  title: string
  sourceText: string
  uploadedDocText: string optional
  outline: string optional
  editedOutline: string optional
  targetWordCount: int
  chapterWordCount: int
  modelId: string
  selectedSkillIds: string // JSON 字符串
  status: enum
  continuityBible: string optional
  totalGeneratedChars: int default 0
  createdAt: DateTime
  updatedAt: DateTime
}
```

Project status enum：

```ts
DRAFT
OUTLINE_READY
SKILLS_READY
GENERATING
GENERATED
FAILED
```

---

### 10.2 Chapter

```ts
Chapter {
  id: string cuid
  projectId: string
  index: int
  title: string
  targetChars: int
  content: string
  summary: string optional
  status: enum
  createdAt: DateTime
  updatedAt: DateTime
}
```

Chapter status enum：

```ts
PENDING
GENERATING
DONE
FAILED
```

---

### 10.3 AppSetting

```ts
AppSetting {
  id: string // 固定为 "singleton"
  recipientName: string default "王悦然"
  confessionTitle: string default "给王悦然的一封信"
  confessionBody: string optional
  confessionCompletedAt: DateTime optional
  firstProjectId: string optional
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

### 10.4 ExportLog

```ts
ExportLog {
  id: string cuid
  projectId: string
  type: string // 例如 "docx"
  createdAt: DateTime
}
```

---

## 11. API 路由

---

### 11.1 `GET /api/models`

返回：

```json
{
  "models": ["gpt-4.1", "gpt-4.1-mini"]
}
```

---

### 11.2 `POST /api/projects`

创建项目。

body：

```json
{
  "title": "string",
  "sourceText": "string",
  "modelId": "string"
}
```

---

### 11.3 `GET /api/projects/[id]`

返回项目详情、章节列表。

---

### 11.4 `POST /api/projects/[id]/upload-docx`

`multipart/form-data`

字段：

```text
file
```

行为：

- 使用 `mammoth` 提取文本。
- 保存到 `uploadedDocText`。

---

### 11.5 `POST /api/projects/[id]/outline/stream`

流式生成大纲。

要求：

- 返回 Server-Sent Events 或 ReadableStream 文本。
- 生成完成后保存 `outline` 和 `editedOutline`。

---

### 11.6 `PATCH /api/projects/[id]/outline`

保存用户编辑后的大纲。

---

### 11.7 `PATCH /api/projects/[id]/skills`

保存 Skill 选择和目标字数。

body：

```json
{
  "selectedSkillIds": ["string"],
  "targetWordCount": 120000,
  "chapterWordCount": 4000
}
```

---

### 11.8 `POST /api/projects/[id]/generate/stream`

流式生成小说。

必须：

1. 读取项目 `editedOutline`。
2. 读取 `selectedSkillIds`。
3. 根据 `targetWordCount` 和 `chapterWordCount` 计算章节数量。
4. 先规划章节列表。
5. 分章生成。
6. 每章生成时继续向前端 stream delta。
7. 每章完成后保存 Chapter。
8. 每章完成后调用一次 summarizer 更新 `continuityBible`。
9. 全部完成后 `Project.status = GENERATED`。

---

### 11.9 `GET /api/projects/[id]/export.docx`

导出 Word。

行为：

1. 检查项目是否 `GENERATED`。
2. 检查 `AppSetting.confessionCompletedAt`。
3. 如果未完成，返回 `423 Locked`：

```json
{
  "locked": true,
  "reason": "CONFESSION_REQUIRED"
}
```

4. 如果已完成，生成 docx 并返回下载。
5. Word 文件名使用英文安全文件名：

```text
yueran-novel-projectId.docx
```

---

### 11.10 `GET /api/projects/[id]/gate-status`

返回：

```json
{
  "confessionRequired": true,
  "encouragementRequired": false,
  "recipientName": "王悦然",
  "title": "给王悦然的一封信",
  "body": "..."
}
```

---

### 11.11 `POST /api/gate/complete-confession`

设置 `confessionCompletedAt`。

body：

```json
{
  "projectId": "string"
}
```

---

### 11.12 `GET /api/gate/encouragement`

随机返回一句夸奖。

---

### 11.13 `GET /api/settings`

获取 `AppSetting`。

---

### 11.14 `PATCH /api/settings`

保存表白配置。

---

## 12. Skill 体系

请不要做成简单写死 prompt。  
要实现一个可维护的 Skill registry。

建议文件：

```text
src/lib/novel-skills.ts
```

每个 Skill 结构：

```ts
type NovelSkill = {
  id: string;
  group:
    | "content"
    | "style"
    | "emotion"
    | "intimacy"
    | "structure"
    | "character"
    | "pacing"
    | "continuity";
  name: string;
  shortDescription: string;
  bestFor: string;
  promptDirectives: string[];
  negativeDirectives?: string[];
};
```

---

## 13. 内置 Skill

---

### 13.1 内容题材 Skill

#### 1. `content-urban-healing`

名称：都市治愈

说明：适合现实都市、工作生活、互相陪伴、慢慢变好。

promptDirectives：

- 作品背景偏现实都市，日常细节要有温度。
- 冲突不依赖夸张误会，更多来自性格、现实压力和自我成长。
- 关系推进要通过陪伴、理解、细微行动体现。
- 场景多使用生活化细节，例如夜路、便利店、雨天、厨房、消息提示音。

---

#### 2. `content-xianxia-fate`

名称：仙侠宿命

说明：适合师门、前世今生、宿命感、牺牲与重逢。

promptDirectives：

- 世界观要有宗门、灵力、禁术、誓约、因果等元素。
- 情感线要带宿命感，但不能只靠设定推动。
- 每个宏大事件都要落到人物选择和情感代价上。
- 语言可更有古意，但不能堆砌辞藻。

---

#### 3. `content-power-struggle`

名称：古风权谋

说明：适合朝堂、将军、谋士、身份差、互相试探。

promptDirectives：

- 冲突来自权力结构、阵营选择、身份秘密与利益交换。
- 主角之间要有智性张力，互相试探但逐渐信任。
- 谋略要服务人物关系，不要变成流水账。
- 每章至少保留一个未完全揭开的信息点。

---

#### 4. `content-infinite-suspense`

名称：无限流悬疑

说明：适合副本、规则怪谈、强强合作、危险中的信任。

promptDirectives：

- 每个副本需要清晰规则、危险、误导线索和解法。
- 情感推进通过危机协作、互相救援、默契建立体现。
- 悬疑线索必须公平埋设，后文回收。
- 不要让副本规则前后矛盾。

---

#### 5. `content-campus-slowburn`

名称：校园慢热

说明：适合青春、暗恋、竹马、社团、考试、毕业季。

promptDirectives：

- 所有亲密内容必须保持适龄与克制。
- 重点写少年时期的情绪、笨拙、试探、陪伴和成长。
- 冲突来自误解、自卑、升学、家庭压力、未来选择。
- 如果角色未成年，禁止任何成人亲密描写。

---

### 13.2 文风 Skill

#### 6. `style-delicate-emotional`

名称：细腻情感流

说明：强调心理描写、微表情、克制表达、情绪余韵。

promptDirectives：

- 每个关键场景都要写出角色没有说出口的情绪。
- 多使用动作、停顿、视线、物品细节表达关系变化。
- 避免直接喊口号式表白，优先写“想靠近但克制”的细节。
- 情绪要层层推进，不要突然转折。

---

#### 7. `style-cinematic`

名称：电影感叙事

说明：强调镜头感、场景调度、光影、动作和节奏。

promptDirectives：

- 场景开头要有明确画面。
- 用动作和环境推动情绪。
- 重要段落具有镜头切换感。
- 避免大段解释性旁白。

---

#### 8. `style-light-humor`

名称：轻喜剧

说明：适合暧昧拉扯、拌嘴、可爱反差。

promptDirectives：

- 对话要有节奏和反差。
- 幽默来自人物性格，不要靠低俗梗。
- 轻松段落后仍要保留情感落点。
- 不要破坏主线情绪的真诚感。

---

#### 9. `style-literary-realism`

名称：现实文学感

说明：适合现实压力、自我和解、成年人关系。

promptDirectives：

- 语言克制，避免过度网文化。
- 关注现实困境、心理防御和长期关系中的真实问题。
- 不要把人物写成完美工具人。
- 结尾允许温柔但不虚假。

---

### 13.3 情感关系 Skill

#### 10. `emotion-slow-burn`

名称：慢热暗涌

说明：适合长篇拉扯，关系从陌生到信任再到相爱。

promptDirectives：

- 感情推进必须有阶段，不可过早确认关系。
- 每一阶段都要有明确的心理门槛。
- 通过重复出现的小动作建立亲密感。
- 每次靠近后都要留下新的不确定性。

---

#### 11. `emotion-redemption`

名称：互相救赎

说明：适合创伤、低谷、自卑、被坚定选择。

promptDirectives：

- 救赎不是单方面拯救，而是互相看见、互相托住。
- 角色的痛苦不能被爱情瞬间治好。
- 要写出恢复、反复、犹豫和再次相信的过程。
- 鼓励用温柔但不说教的语言。

---

#### 12. `emotion-rivals-to-lovers`

名称：宿敌变爱人

说明：适合强强、对抗、试探、并肩。

promptDirectives：

- 初期冲突要具体，不要只是嘴硬。
- 欣赏必须藏在对抗里。
- 信任建立要通过共同承担后果。
- 爱意确认前要保留张力。

---

#### 13. `emotion-broken-mirror`

名称：破镜重圆

说明：适合旧情、误会、遗憾、成熟后的重新选择。

promptDirectives：

- 过去分开的原因必须足够具体。
- 重逢后不能立刻和好，需要重新理解彼此。
- 回忆要穿插在当前行动里。
- 最终复合要建立在改变和坦诚上。

---

### 13.4 亲密度 / 瑟瑟指数 Skill

通用边界：

- 角色为成年人，或如角色未成年则只能清水、暗恋、牵手等适龄内容。
- 必须自愿、平等、尊重边界。
- 禁止未成年人成人化描写。
- 禁止非自愿、胁迫、美化伤害。
- 默认采用文学化、氛围化、留白式表达，不输出露骨细节。

---

#### 14. `intimacy-0-pure`

名称：0 清水

说明：无成人亲密描写，重点写陪伴、心动、信任。

promptDirectives：

- 不写成人亲密场景。
- 通过对话、陪伴、细节表达感情。
- 可以写牵手、拥抱、心跳、暗恋。

---

#### 15. `intimacy-1-ambiguous`

名称：1 暧昧

说明：轻微暧昧、靠近、心动、克制。

promptDirectives：

- 使用视线、距离、停顿、语气变化制造暧昧。
- 不写露骨身体描写。
- 重点写克制和心跳感。

---

#### 16. `intimacy-2-romantic`

名称：2 浪漫亲密

说明：亲吻、拥抱、确定关系后的温柔亲密，但保持含蓄。

promptDirectives：

- 可以写亲吻、拥抱、靠近，但保持文学化。
- 重点写情绪、信任和被珍惜感。
- 避免露骨细节。

---

#### 17. `intimacy-3-fade-to-black`

名称：3 成人氛围留白

说明：成人角色之间可以有更强张力，但关键处留白。

promptDirectives：

- 确保角色均为成年人且完全自愿。
- 可以营造成人氛围和情感张力。
- 关键亲密行为使用留白、转场、次日情绪描写处理。
- 不输出露骨细节。

---

#### 18. `intimacy-4-high-tension`

名称：4 高张力克制

说明：适合强烈吸引、拉扯、欲言又止，但仍保持克制和合规。

promptDirectives：

- 强化吸引力、占有欲的心理层面，但不能美化控制或伤害。
- 保持双方尊重、清醒、自愿。
- 用环境、呼吸、沉默、动作停顿写张力。
- 亲密行为仍采用文学化和留白式表达。

---

### 13.5 叙事结构 Skill

#### 19. `structure-three-act`

名称：三幕剧长篇

说明：适合稳定推进的长篇主线。

promptDirectives：

- 第一幕建立人物、关系缺口和主冲突。
- 第二幕升级冲突、制造选择代价。
- 第三幕回收伏笔、完成关系和主题闭环。
- 每章结尾要推动人物选择或关系变化。

---

#### 20. `structure-hook-each-chapter`

名称：章节钩子

说明：每章末尾都留下情绪或剧情钩子。

promptDirectives：

- 每章结尾必须有一个钩子。
- 钩子可以是新信息、未说出口的话、危险逼近、关系误判或选择难题。
- 钩子不能靠廉价断章，必须与主线有关。

---

#### 21. `structure-multi-pov`

名称：双视角

说明：适合双男主心理拉扯。

promptDirectives：

- 可以交替使用两位主角视角。
- 每次视角切换都要提供新信息。
- 不要重复同一事件。
- 用视角差制造误解和心动。

---

### 13.6 人设 Skill

#### 22. `character-strong-strong`

名称：强强

说明：两位主角都有能力、锋芒和软肋。

promptDirectives：

- 两位主角都必须有主动性。
- 不要把一方写成纯工具人。
- 情感关系建立在互相尊重和互相承认之上。
- 每个人都要有自己的目标和成长线。

---

#### 23. `character-sensitive-soft`

名称：敏感温柔

说明：适合内心细腻、自卑、慢慢被坚定选择的人物。

promptDirectives：

- 敏感不是矫情，而是更容易捕捉细节和情绪。
- 自卑不能被嘲笑，要写出形成原因。
- 被爱不是因为完美，而是因为真实。
- 关系推进要体现“被看见”和“被坚定选择”。

---

#### 24. `character-cold-outside-soft-inside`

名称：外冷内软

说明：适合嘴硬、克制、行动派。

promptDirectives：

- 不要只写冷脸，要写他为什么克制。
- 关心优先通过行动体现。
- 偶尔的失控要成为情感节点。
- 反差萌要自然。

---

### 13.7 节奏 Skill

#### 25. `pacing-long-novel`

名称：十几万字长篇节奏

说明：控制长篇节奏，避免前紧后崩。

promptDirectives：

- 不要过早解决核心冲突。
- 每 3 到 5 章完成一个小阶段。
- 每 8 到 12 章推进一次大转折。
- 感情线、事业线、悬念线交替推进。
- 每章必须有明确功能。

---

#### 26. `continuity-foreshadowing`

名称：伏笔回收

说明：适合悬疑、权谋、宿命、破镜重圆。

promptDirectives：

- 记录每个伏笔的出现章节、表层含义和真实含义。
- 后文必须回收重要伏笔。
- 回收时要让读者觉得“意料之外，情理之中”。
- 不要新增无法回收的大坑。

---

## 14. Prompt Harness

---

### 14.1 大纲生成 Prompt

system：

```text
你是专业长篇耽美小说策划师，擅长把零散设定扩展成十几万字级别的完整长篇小说大纲。你重视人物弧光、情感递进、冲突升级、伏笔回收和章节节奏。你必须输出结构化、可执行、适合后续分章生成的完整大纲。所有成人亲密内容必须只发生在成年人、自愿、平等、尊重边界的前提下；如角色未成年，只能写适龄的清水情感。
```

user：

```text
请根据以下输入生成完整长篇小说大纲。

作品标题：
{{title}}

用户创意：
{{sourceText}}

Word 文档提取内容：
{{uploadedDocText}}

要求：
1. 输出中文。
2. 适合十几万字长篇。
3. 情感细腻。
4. 需要包含：
   - 一句话卖点
   - 作品基调
   - 题材类型
   - 主角设定
   - 配角设定
   - 人物关系图文字版
   - 世界观 / 背景设定
   - 主线剧情
   - 情感线阶段
   - 主要冲突
   - 伏笔列表
   - 章节规划
   - 高潮设计
   - 结局设计
   - 长篇节奏建议
5. 章节规划请至少给出 20 章，如果目标明显更长，可以规划 30 到 50 章。
6. 每章要有章节标题、主要事件、情感推进、悬念 / 钩子。
7. 不要直接开始写正文。
```

---

### 14.2 章节规划 Prompt

system：

```text
你是长篇小说总编剧。你要根据用户确认的大纲、目标总字数、每章目标字数和 Skill 配方，生成可执行章节列表。章节数量要与目标字数匹配。每章必须有明确功能，不能水文。
```

user：

```text
根据以下信息生成章节计划。

已确认大纲：
{{editedOutline}}

目标总字数：
{{targetWordCount}}

每章目标字数：
{{chapterWordCount}}

Skill 配方：
{{skillRecipe}}

请输出 JSON：
{
  "chapters": [
    {
      "index": 1,
      "title": "...",
      "targetChars": 4000,
      "function": "...",
      "mainEvents": ["..."],
      "emotionProgress": "...",
      "foreshadowing": ["..."],
      "endingHook": "..."
    }
  ]
}

要求：
1. 章节数量 = ceil(targetWordCount / chapterWordCount)。
2. targetChars 总和尽量接近 targetWordCount。
3. 每章都有剧情功能、情感功能和结尾钩子。
4. 只输出 JSON，不要输出解释。
```

---

### 14.3 正文生成 Prompt

system：

```text
你是专业长篇耽美小说作者，擅长细腻情感、长篇节奏、人物关系递进、伏笔回收和中文文学化表达。你正在创作一部长篇小说的一章。你必须严格遵守既定大纲、章节计划、已生成内容摘要和 Skill 配方。不要自相矛盾，不要跳过关键情感过程，不要用流水账凑字数。所有亲密内容必须建立在成年人、自愿、尊重边界的基础上；如角色未成年，只能清水、适龄、克制表达。
```

user：

```text
请生成当前章节正文。

作品标题：
{{title}}

完整大纲：
{{editedOutline}}

当前章节计划：
{{chapterPlan}}

目标字数：
{{targetChars}}

已生成长篇记忆：
{{continuityBible}}

最近上一章摘要：
{{previousChapterSummary}}

Skill 配方：
{{skillRecipe}}

写作要求：
1. 只输出正文，不要输出分析。
2. 字数尽量接近 {{targetChars}} 中文字。
3. 保持人物性格一致。
4. 本章必须完成章节计划中的主要事件。
5. 本章必须推进情感关系。
6. 本章末尾必须有自然钩子。
7. 不要在一章内突然解决全部冲突。
8. 不要重复解释前文。
9. 不要使用“他很痛苦”“他很感动”这类空泛概括，要通过动作、语言、停顿、环境和细节表现。
10. 语言要自然、细腻、有画面感。
11. 禁止出现“作为一个AI”之类内容。
```

---

### 14.4 长篇记忆更新 Prompt

system：

```text
你是长篇小说 continuity editor。你的任务是根据最新章节更新长篇记忆，帮助后续章节保持人物、剧情、伏笔和情感线一致。
```

user：

```text
请根据以下内容更新长篇记忆。

旧长篇记忆：
{{oldContinuityBible}}

最新章节标题：
{{chapterTitle}}

最新章节正文：
{{chapterContent}}

请输出：
1. 已发生关键事件
2. 人物当前状态
3. 两位主角关系阶段
4. 情感变化
5. 伏笔新增
6. 伏笔回收
7. 未解决冲突
8. 下一章需要承接的点
9. 禁止遗忘的细节

要求：
1. 简洁但完整。
2. 不要超过 2000 中文字。
3. 只输出更新后的长篇记忆。
```

---

## 15. Skill 配方生成

实现函数：

```ts
buildSkillRecipe(selectedSkillIds: string[]): string
```

要求：

1. 从 `novel-skills.ts` 取出所有选中的 Skill。
2. 按 `group` 分组。
3. 输出给大模型的 Skill 配方文本。
4. 格式：

```text
【内容题材】
- 都市治愈：...
写作指令：
1. ...
2. ...

【文风】
- 细腻情感流：...
写作指令：
1. ...
2. ...

【亲密度】
- 2 浪漫亲密：...
写作边界：
1. ...
2. ...
```

5. 必须包含 `negativeDirectives`。
6. 如果选择了多个互相冲突的 Skill，需要在 UI 提醒，但允许继续。
7. 亲密度 Skill 同一时间只能选择一个。
8. 如果用户没有选择任何 Skill，自动使用：
   - `style-delicate-emotional`
   - `emotion-slow-burn`
   - `pacing-long-novel`
   - `intimacy-1-ambiguous`

---

## 16. 流式输出实现

后端使用 `ReadableStream`。

前端使用 `fetch` 读取 `reader`。

事件格式建议使用 SSE：

```text
event: meta
data: {"projectId":"..."}

event: chapter_start
data: {"index":1,"title":"..."}

event: delta
data: {"text":"..."}

event: progress
data: {"generatedChars":12345,"targetWordCount":120000,"percent":10}

event: chapter_done
data: {"index":1,"summary":"..."}

event: done
data: {"projectId":"..."}

event: error
data: {"message":"..."}
```

前端需要解析 SSE。  
如果更简单，也可以用 newline-delimited JSON，但必须稳定。

---

## 17. Word 导出要求

1. 使用 `docx` npm 包。
2. 导出的 Word 结构：
   - 标题页
   - 作品标题
   - 生成时间
   - Skill 配方摘要
   - 大纲，可选
   - 正文目录
   - 每章标题
   - 每章正文
3. 中文字体建议：
   - 宋体 / SimSun
   - 标题可以使用 黑体 / SimHei
4. 段落首行缩进 2 字符。
5. 正文行距舒适。
6. 文件名必须是英文安全名：

```text
yueran-novel-${projectId}.docx
```

7. 不要把表白信默认写进小说 Word，除非未来加设置项。

---

## 18. 表白信模块

---

### 18.1 默认表白信模板

标题：

```text
给王悦然的一封信
```

正文默认模板：

```text
悦然：

在你看到这份小说之前，我想先把这封信给你。

{{custom_confession_body}}

我一直觉得，你身上最珍贵的地方，不是你必须永远开心，也不是你必须永远自信，而是你明明很敏感，却依然愿意温柔地对待这个世界。

你可能偶尔会怀疑自己，觉得自己不够好、不够特别，或者不值得被坚定选择。可是我想很认真地告诉你：在我这里，你从来不是需要被比较的人。你就是你，是很善良、很可爱、也很值得被认真喜欢的王悦然。

所以这个网站、这篇小说、还有这封信，都是我想送给你的一点点心意。

如果你愿意，就点一下下面的按钮，继续看属于你的故事。
```

按钮文案：

```text
我读完啦，继续看小说
```

注意：

1. `{{custom_confession_body}}` 由网站拥有者在设置页填写。
2. 如果没有填写，则显示：

```text
这里留给我写下最想亲口告诉你的话。
```

3. 表白信样式要温柔、干净、有仪式感。
4. 背景可以是柔和渐变。
5. 可以有纸张卡片感。
6. 不要做浮夸土味动画。
7. 完成后调用 `POST /api/gate/complete-confession`。

---

### 18.2 后续鼓励语

实现：

```ts
getRandomEncouragement(): string
```

内置至少 15 条：

1. 王悦然，你的敏感不是缺点，那是你能感受到很多细小温柔的能力。
2. 你真的很善良，也值得被这个世界温柔对待。
3. 你不需要变成别人眼里的完美样子，你本来的样子就已经很可爱。
4. 偶尔不自信也没关系，我会记得你的好，也希望你慢慢记得。
5. 今天也想认真告诉你：你很值得被喜欢。
6. 你不用一直坚强，柔软也很珍贵。
7. 你的小情绪、小认真、小可爱，都有人放在心上。
8. 你的温柔不是理所当然，它很难得。
9. 希望这个故事能陪你开心一点，也陪你相信自己一点。
10. 你不是麻烦，你是值得被耐心对待的人。
11. 你已经很好了，不需要用别人的标准证明自己。
12. 你值得被坚定地选择，也值得被好好珍惜。
13. 你看见世界细节的样子，真的很可爱。
14. 慢慢来，你不用一下子变得很勇敢。
15. 王悦然，今天也请记得：你很重要。

---

## 19. 前端组件

必须实现：

1. `ConfessionGateModal`
2. `EncouragementModal`
3. `SkillCard`
4. `SkillSelector`
5. `StreamOutput`
6. `ProgressPanel`
7. `OutlineEditor`
8. `ModelSelector`
9. `DocxUploader`

---

### 19.1 ConfessionGateModal props

```ts
type ConfessionGateModalProps = {
  open: boolean;
  title: string;
  body: string;
  recipientName: string;
  onComplete: () => void;
};
```

---

### 19.2 EncouragementModal props

```ts
type EncouragementModalProps = {
  message: string;
  onContinue: () => void;
};
```

---

## 20. 状态机要求

Project 创建后：

```text
DRAFT
```

大纲生成完成：

```text
OUTLINE_READY
```

Skill 保存完成：

```text
SKILLS_READY
```

开始生成：

```text
GENERATING
```

全部章节完成：

```text
GENERATED
```

失败：

```text
FAILED
```

导出锁：

- 不是 `Project.status`。
- 是 gate 状态。
- 如果 `AppSetting.confessionCompletedAt` 为 `null`，则第一次查看 / 下载需要表白 gate。

---

## 21. 长篇生成细节

1. 不要让浏览器单次请求超时太容易。
2. 生成时每章都保存。
3. 如果中途失败，保留已生成章节。
4. 用户重新点击生成时：
   - 如果已有章节，可以提示继续生成剩余章节。
   - 简化实现可以从头生成，但必须先提示会覆盖。
5. 第一版可以不实现复杂队列，但代码结构要能扩展。
6. 不要把全部十几万字只放在 React state，必须写入数据库。

---

## 22. 字数统计

实现：

```ts
countChineseChars(text: string): number
```

要求：

1. 统计中文字符、英文单词、数字。
2. 对中文小说主要以字符数作为近似。
3. 进度用：

```ts
totalGeneratedChars / targetWordCount
```

---

## 23. 安全与边界

1. 亲密度 Skill 必须有成人和自愿边界。
2. 如果用户输入明确要求未成年人成人化内容、非自愿内容、美化伤害等，系统应拒绝生成对应内容，并建议改为合规的情感表达。
3. 校园题材默认清水或暧昧，不允许成人化描写。
4. 不要在项目里加入外部追踪分析。
5. 上传文档内容只保存在本地 SQLite。
6. API Key 只在服务端使用。

---

## 24. UI 风格

1. 温柔、干净、适合写作。
2. 主色可使用浅紫、米白、淡粉、深灰文字。
3. 页面不要花哨。
4. 长文本区域要舒适。
5. 按钮文案中文化。
6. 错误提示要友好。
7. 移动端可用，但优先桌面写作体验。

---

## 25. 建议目录结构

```text
src/
  app/
    page.tsx
    studio/
      page.tsx
    reader/
      [projectId]/
        page.tsx
    settings/
      page.tsx
    api/
      models/
        route.ts
      projects/
        route.ts
        [id]/
          route.ts
          upload-docx/
            route.ts
          outline/
            stream/
              route.ts
          skills/
            route.ts
          generate/
            stream/
              route.ts
          export.docx/
            route.ts
          gate-status/
            route.ts
      gate/
        complete-confession/
          route.ts
        encouragement/
          route.ts
      settings/
        route.ts
  components/
    ConfessionGateModal.tsx
    EncouragementModal.tsx
    SkillCard.tsx
    SkillSelector.tsx
    StreamOutput.tsx
    ProgressPanel.tsx
    OutlineEditor.tsx
    ModelSelector.tsx
    DocxUploader.tsx
  lib/
    db.ts
    llm/
      adapter.ts
      prompts.ts
      stream.ts
    novel-skills.ts
    skill-recipe.ts
    docx-export.ts
    docx-parse.ts
    gate.ts
    encouragement.ts
    text-count.ts
    sse.ts
  prisma/
    schema.prisma
```

---

## 26. 关键实现要求

---

### 26.1 LLM Adapter

实现：

```ts
createChatCompletionStream({
  model,
  messages,
  temperature,
  maxTokens
})
```

返回 async iterable text chunks。

注意不同中转 API 对 stream 格式可能略有差异。  
至少兼容 OpenAI 风格：

```text
data: {"choices":[{"delta":{"content":"..."}}]}
data: [DONE]
```

---

### 26.2 SSE Helper

实现：

```ts
sendSse(controller, event, data)
```

---

### 26.3 小说生成流程

生成小说时：

1. 后端先生成 `chapterPlan`。
2. `chapterPlan` 如果模型输出 JSON 不合法，要尝试 `repairJson`。
3. 每章生成时将 delta 同步推给前端。
4. 同时在服务端累积本章 `content`。
5. 章节结束后保存。
6. 再更新 `continuityBible`。
7. 再进入下一章。
8. 不要在同一个 prompt 里塞入所有已生成正文，只塞 `continuityBible` 和上一章摘要。

---

### 26.4 JSON Repair

实现简单函数：

1. 去掉 markdown code fence。
2. 找第一个 `{` 和最后一个 `}`。
3. `JSON.parse`。
4. 失败则抛友好错误。

---

## 27. 错误处理

1. `LLM_API_KEY` 缺失时，前端显示：

```text
请先配置中转 API Key
```

2. 大纲为空不能进入第二步。
3. 未选择 Skill 可以继续，但提示会使用默认：

```text
细腻情感流 + 十几万字长篇节奏
```

4. 亲密度 Skill 多选时阻止保存。
5. 项目未生成完成不能导出 Word。
6. 表白 gate 未完成时导出接口返回 `423`，不直接下载。

---

## 28. 默认 Skill

如果用户没有选择任何 Skill，自动使用：

- `style-delicate-emotional`
- `emotion-slow-burn`
- `pacing-long-novel`
- `intimacy-1-ambiguous`

---

## 29. 验收标准

1. `npm install` 后可以运行。
2. `npx prisma migrate dev` 可以创建数据库。
3. `npm run dev` 后能访问首页。
4. 可以创建项目。
5. 可以上传 `.docx` 并提取文本。
6. 可以选择模型。
7. 可以流式生成大纲。
8. 可以编辑并保存大纲。
9. 可以选择 Skill 和目标字数。
10. 可以流式生成多章节小说。
11. 生成中刷新后已保存的章节不丢失。
12. 生成完成后点击下载 Word，如果第一次未表白，则出现表白界面。
13. 点击 `我读完啦，继续看小说` 后，才允许下载 Word。
14. 后续再下载不出现表白信，只出现鼓励语。
15. 导出的 `.docx` 能正常打开，包含标题、章节和正文。
16. API Key 不出现在浏览器代码里。
17. 亲密度 Skill 有明确成年、自愿、克制边界。
18. UI 使用中文。
19. 文件名、代码变量名、路由名使用英文。
20. 整体项目没有 TypeScript 类型错误。

---

## 30. Codex 执行要求

请直接生成完整项目代码。

优先保证核心流程完整可运行，不要只写伪代码。

如果某些高级功能无法完整实现，必须保留清晰 TODO，但核心三步、大模型流式生成、Skill 选择、Word 导出、首次表白 gate 必须实现。
