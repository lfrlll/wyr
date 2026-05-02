export type SkillGroup =
  | "content"
  | "style"
  | "emotion"
  | "intimacy"
  | "structure"
  | "character"
  | "pacing"
  | "continuity";

export type NovelSkill = {
  id: string;
  group: SkillGroup;
  name: string;
  shortDescription: string;
  bestFor: string;
  promptDirectives: string[];
  negativeDirectives?: string[];
};

export const skillGroupLabels: Record<SkillGroup, string> = {
  content: "内容题材",
  style: "文风",
  emotion: "情感关系",
  intimacy: "亲密度",
  structure: "叙事结构",
  character: "人设张力",
  pacing: "节奏控制",
  continuity: "长篇一致性"
};

export const defaultSkillIds = [
  "style-delicate-emotional",
  "emotion-slow-burn",
  "pacing-long-novel",
  "intimacy-1-ambiguous"
];

export const novelSkills: NovelSkill[] = [
  {
    id: "content-urban-healing",
    group: "content",
    name: "都市治愈",
    shortDescription: "现实都市、工作生活、互相陪伴、慢慢变好。",
    bestFor: "日常向、成年人关系、自我修复和温柔陪伴。",
    promptDirectives: [
      "作品背景偏现实都市，日常细节要有温度。",
      "冲突不依赖夸张误会，更多来自性格、现实压力和自我成长。",
      "关系推进要通过陪伴、理解、细微行动体现。",
      "场景多使用生活化细节，例如夜路、便利店、雨天、厨房、消息提示音。"
    ]
  },
  {
    id: "content-xianxia-fate",
    group: "content",
    name: "仙侠宿命",
    shortDescription: "师门、前世今生、宿命感、牺牲与重逢。",
    bestFor: "有宏大世界观、誓约、因果与情感代价的故事。",
    promptDirectives: [
      "世界观要有宗门、灵力、禁术、誓约、因果等元素。",
      "情感线要带宿命感，但不能只靠设定推动。",
      "每个宏大事件都要落到人物选择和情感代价上。",
      "语言可更有古意，但不能堆砌辞藻。"
    ]
  },
  {
    id: "content-power-struggle",
    group: "content",
    name: "古风权谋",
    shortDescription: "朝堂、将军、谋士、身份差、互相试探。",
    bestFor: "阵营、秘密、利益交换与强张力关系。",
    promptDirectives: [
      "冲突来自权力结构、阵营选择、身份秘密与利益交换。",
      "主角之间要有智性张力，互相试探但逐渐信任。",
      "谋略要服务人物关系，不要变成流水账。",
      "每章至少保留一个未完全揭开的信息点。"
    ]
  },
  {
    id: "content-infinite-suspense",
    group: "content",
    name: "无限流悬疑",
    shortDescription: "副本、规则怪谈、强强合作、危险中的信任。",
    bestFor: "悬疑副本、线索回收、危机协作。",
    promptDirectives: [
      "每个副本需要清晰规则、危险、误导线索和解法。",
      "情感推进通过危机协作、互相救援、默契建立体现。",
      "悬疑线索必须公平埋设，后文回收。",
      "不要让副本规则前后矛盾。"
    ]
  },
  {
    id: "content-campus-slowburn",
    group: "content",
    name: "校园慢热",
    shortDescription: "青春、暗恋、竹马、社团、考试、毕业季。",
    bestFor: "清水青春、成长、未来选择和克制心动。",
    promptDirectives: [
      "所有亲密内容必须保持适龄与克制。",
      "重点写少年时期的情绪、笨拙、试探、陪伴和成长。",
      "冲突来自误解、自卑、升学、家庭压力、未来选择。",
      "如果角色未成年，禁止任何成人亲密描写。"
    ],
    negativeDirectives: ["不要对未成年角色进行成人化描写。"]
  },
  {
    id: "style-delicate-emotional",
    group: "style",
    name: "细腻情感流",
    shortDescription: "心理描写、微表情、克制表达、情绪余韵。",
    bestFor: "慢热、互相试探、关系递进的长篇。",
    promptDirectives: [
      "每个关键场景都要写出角色没有说出口的情绪。",
      "多使用动作、停顿、视线、物品细节表达关系变化。",
      "避免直接喊口号式表白，优先写“想靠近但克制”的细节。",
      "情绪要层层推进，不要突然转折。"
    ]
  },
  {
    id: "style-cinematic",
    group: "style",
    name: "电影感叙事",
    shortDescription: "镜头感、场景调度、光影、动作和节奏。",
    bestFor: "强场景、悬疑、权谋、动作和关键情绪戏。",
    promptDirectives: [
      "场景开头要有明确画面。",
      "用动作和环境推动情绪。",
      "重要段落具有镜头切换感。",
      "避免大段解释性旁白。"
    ]
  },
  {
    id: "style-light-humor",
    group: "style",
    name: "轻喜剧",
    shortDescription: "暧昧拉扯、拌嘴、可爱反差。",
    bestFor: "关系升温、日常互动、轻松但真诚的桥段。",
    promptDirectives: [
      "对话要有节奏和反差。",
      "幽默来自人物性格，不要靠低俗梗。",
      "轻松段落后仍要保留情感落点。",
      "不要破坏主线情绪的真诚感。"
    ]
  },
  {
    id: "style-literary-realism",
    group: "style",
    name: "现实文学感",
    shortDescription: "现实压力、自我和解、成年人关系。",
    bestFor: "真实困境、克制语言和长期关系的复杂感。",
    promptDirectives: [
      "语言克制，避免过度网文化。",
      "关注现实困境、心理防御和长期关系中的真实问题。",
      "不要把人物写成完美工具人。",
      "结尾允许温柔但不虚假。"
    ]
  },
  {
    id: "emotion-slow-burn",
    group: "emotion",
    name: "慢热暗涌",
    shortDescription: "陌生到信任再到相爱，长篇拉扯。",
    bestFor: "情感层层推进、慢慢确认关系。",
    promptDirectives: [
      "感情推进必须有阶段，不可过早确认关系。",
      "每一阶段都要有明确的心理门槛。",
      "通过重复出现的小动作建立亲密感。",
      "每次靠近后都要留下新的不确定性。"
    ]
  },
  {
    id: "emotion-redemption",
    group: "emotion",
    name: "互相救赎",
    shortDescription: "创伤、低谷、自卑、被坚定选择。",
    bestFor: "敏感人物、低谷陪伴、重新相信自己。",
    promptDirectives: [
      "救赎不是单方面拯救，而是互相看见、互相托住。",
      "角色的痛苦不能被爱情瞬间治好。",
      "要写出恢复、反复、犹豫和再次相信的过程。",
      "鼓励用温柔但不说教的语言。"
    ]
  },
  {
    id: "emotion-rivals-to-lovers",
    group: "emotion",
    name: "宿敌变爱人",
    shortDescription: "强强、对抗、试探、并肩。",
    bestFor: "竞争关系、阵营冲突、智性吸引。",
    promptDirectives: [
      "初期冲突要具体，不要只是嘴硬。",
      "欣赏必须藏在对抗里。",
      "信任建立要通过共同承担后果。",
      "爱意确认前要保留张力。"
    ]
  },
  {
    id: "emotion-broken-mirror",
    group: "emotion",
    name: "破镜重圆",
    shortDescription: "旧情、误会、遗憾、成熟后的重新选择。",
    bestFor: "久别重逢、遗憾修复和重新理解。",
    promptDirectives: [
      "过去分开的原因必须足够具体。",
      "重逢后不能立刻和好，需要重新理解彼此。",
      "回忆要穿插在当前行动里。",
      "最终复合要建立在改变和坦诚上。"
    ]
  },
  {
    id: "intimacy-0-pure",
    group: "intimacy",
    name: "0 清水",
    shortDescription: "无成人亲密描写，重点写陪伴、心动、信任。",
    bestFor: "校园、清水、暗恋和纯情向故事。",
    promptDirectives: ["不写成人亲密场景。", "通过对话、陪伴、细节表达感情。", "可以写牵手、拥抱、心跳、暗恋。"],
    negativeDirectives: ["禁止露骨描写。", "禁止未成年人成人化描写。"]
  },
  {
    id: "intimacy-1-ambiguous",
    group: "intimacy",
    name: "1 暧昧",
    shortDescription: "轻微暧昧、靠近、心动、克制。",
    bestFor: "关系未确认前的心动和拉扯。",
    promptDirectives: ["使用视线、距离、停顿、语气变化制造暧昧。", "不写露骨身体描写。", "重点写克制和心跳感。"],
    negativeDirectives: ["禁止露骨细节。", "禁止非自愿或胁迫内容。"]
  },
  {
    id: "intimacy-2-romantic",
    group: "intimacy",
    name: "2 浪漫亲密",
    shortDescription: "亲吻、拥抱、确定关系后的温柔亲密，但保持含蓄。",
    bestFor: "成年人、关系确认后的温柔亲密。",
    promptDirectives: ["可以写亲吻、拥抱、靠近，但保持文学化。", "重点写情绪、信任和被珍惜感。", "避免露骨细节。"],
    negativeDirectives: ["禁止未成年成人化。", "禁止非自愿内容。", "禁止露骨器官或行为细节。"]
  },
  {
    id: "intimacy-3-fade-to-black",
    group: "intimacy",
    name: "3 成人氛围留白",
    shortDescription: "成人角色之间可以有更强张力，关键处留白。",
    bestFor: "成年人关系、强吸引但克制的长篇。",
    promptDirectives: [
      "确保角色均为成年人且完全自愿。",
      "可以营造成人氛围和情感张力。",
      "关键亲密行为使用留白、转场、次日情绪描写处理。",
      "不输出露骨细节。"
    ],
    negativeDirectives: ["禁止露骨细节。", "禁止控制、美化伤害或非自愿。"]
  },
  {
    id: "intimacy-4-high-tension",
    group: "intimacy",
    name: "4 高张力克制",
    shortDescription: "强烈吸引、拉扯、欲言又止，但仍保持克制合规。",
    bestFor: "成年人、强张力、互相试探的情感线。",
    promptDirectives: [
      "强化吸引力、占有欲的心理层面，但不能美化控制或伤害。",
      "保持双方尊重、清醒、自愿。",
      "用环境、呼吸、沉默、动作停顿写张力。",
      "亲密行为仍采用文学化和留白式表达。"
    ],
    negativeDirectives: ["禁止露骨性描写。", "禁止非自愿、胁迫或美化伤害。"]
  },
  {
    id: "structure-three-act",
    group: "structure",
    name: "三幕剧长篇",
    shortDescription: "稳定推进主线，建立、升级、回收。",
    bestFor: "主线清晰、情感和剧情共同闭环。",
    promptDirectives: [
      "第一幕建立人物、关系缺口和主冲突。",
      "第二幕升级冲突、制造选择代价。",
      "第三幕回收伏笔、完成关系和主题闭环。",
      "每章结尾要推动人物选择或关系变化。"
    ]
  },
  {
    id: "structure-hook-each-chapter",
    group: "structure",
    name: "章节钩子",
    shortDescription: "每章末尾留下情绪或剧情钩子。",
    bestFor: "连载感、悬念感和章节推进。",
    promptDirectives: [
      "每章结尾必须有一个钩子。",
      "钩子可以是新信息、未说出口的话、危险逼近、关系误判或选择难题。",
      "钩子不能靠廉价断章，必须与主线有关。"
    ]
  },
  {
    id: "structure-multi-pov",
    group: "structure",
    name: "双视角",
    shortDescription: "适合双男主心理拉扯。",
    bestFor: "视角差、误解、暗涌和双主角成长。",
    promptDirectives: ["可以交替使用两位主角视角。", "每次视角切换都要提供新信息。", "不要重复同一事件。", "用视角差制造误解和心动。"]
  },
  {
    id: "character-strong-strong",
    group: "character",
    name: "强强",
    shortDescription: "两位主角都有能力、锋芒和软肋。",
    bestFor: "势均力敌、互相承认、共同承担。",
    promptDirectives: [
      "两位主角都必须有主动性。",
      "不要把一方写成纯工具人。",
      "情感关系建立在互相尊重和互相承认之上。",
      "每个人都要有自己的目标和成长线。"
    ]
  },
  {
    id: "character-sensitive-soft",
    group: "character",
    name: "敏感温柔",
    shortDescription: "内心细腻、自卑、慢慢被坚定选择。",
    bestFor: "低自尊、互相看见、治愈向关系。",
    promptDirectives: [
      "敏感不是矫情，而是更容易捕捉细节和情绪。",
      "自卑不能被嘲笑，要写出形成原因。",
      "被爱不是因为完美，而是因为真实。",
      "关系推进要体现“被看见”和“被坚定选择”。"
    ]
  },
  {
    id: "character-cold-outside-soft-inside",
    group: "character",
    name: "外冷内软",
    shortDescription: "嘴硬、克制、行动派。",
    bestFor: "冷感角色、行动表达关心、反差升温。",
    promptDirectives: ["不要只写冷脸，要写他为什么克制。", "关心优先通过行动体现。", "偶尔的失控要成为情感节点。", "反差萌要自然。"]
  },
  {
    id: "pacing-long-novel",
    group: "pacing",
    name: "十几万字长篇节奏",
    shortDescription: "控制长篇节奏，避免前紧后崩。",
    bestFor: "十万字以上分阶段推进。",
    promptDirectives: [
      "不要过早解决核心冲突。",
      "每 3 到 5 章完成一个小阶段。",
      "每 8 到 12 章推进一次大转折。",
      "感情线、事业线、悬念线交替推进。",
      "每章必须有明确功能。"
    ]
  },
  {
    id: "continuity-foreshadowing",
    group: "continuity",
    name: "伏笔回收",
    shortDescription: "悬疑、权谋、宿命、破镜重圆中的伏笔管理。",
    bestFor: "需要公平埋线和后文回收的长篇。",
    promptDirectives: [
      "记录每个伏笔的出现章节、表层含义和真实含义。",
      "后文必须回收重要伏笔。",
      "回收时要让读者觉得“意料之外，情理之中”。",
      "不要新增无法回收的大坑。"
    ],
    negativeDirectives: ["不要新增无法回收的重要伏笔。"]
  }
];

export function getSkillById(id: string) {
  return novelSkills.find((skill) => skill.id === id);
}

export function normalizeSkillIds(ids: string[]) {
  return ids.length ? ids : defaultSkillIds;
}

export function getSelectedSkills(ids: string[]) {
  return normalizeSkillIds(ids)
    .map(getSkillById)
    .filter((skill): skill is NovelSkill => Boolean(skill));
}
