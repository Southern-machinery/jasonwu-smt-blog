import type { Asset, Comment, Post, Series, SiteSettings, Tag } from "./types";

export const siteSettings: SiteSettings = {
  name: "Jason Wu · Southern Machinery",
  description:
    "Jason Wu helps EMS factories take through-hole off the bottleneck list: SMT/THT PCB assembly automation, auto insertion machines, wave soldering, custom feeders, and hands-on field support from Shenzhen.",
  url: "https://jasonwu.smthelp.eu",
  authorName: "Jason Wu",
  authorBio:
    "Founder & CEO of Southern Machinery (Shenzhen, since 2011). 30+ years in SMT/THT equipment — on the line, on the phone, and on video with EMS teams across 4 continents.",
  avatarUrl: "/images/jason-wu-avatar.svg",
  defaultOgImage: "/og-default.svg",
  socialLinks: [
    { label: "LinkedIn Company", href: "https://www.linkedin.com/company/smtmachine" },
    { label: "LinkedIn Profile", href: "https://cn.linkedin.com/in/smtsupplier" },
    { label: "Twitter", href: "https://twitter.com/smtspecialist" },
    { label: "Facebook", href: "https://www.facebook.com/autoinsertion" },
    { label: "YouTube Channel", href: "https://www.youtube.com/c/Smthelping" },
    { label: "Catalog", href: "https://file.autoinsertion.com" },
    { label: "Machine Photos", href: "https://ph.smthelp.com" },
    { label: "Email", href: "mailto:info@smthelp.com" },
    { label: "WhatsApp", href: "https://wa.me/8613602562576" },
    { label: "RSS", href: "/rss.xml" },
  ],
  navigation: [
    { label: "Blog", href: "/blog", i18n: { label: { zh: "博客" } } },
    { label: "About", href: "/about", i18n: { label: { zh: "关于" } } },
    { label: "Contact", href: "/#contact", i18n: { label: { zh: "联系" } } },
    { label: "YouTube", href: "https://www.youtube.com/c/Smthelping" },
  ],
  rssEnabled: true,
  commentsEnabled: true,
  commentsRequireApproval: true,
  commentAutoBlockEnabled: true,
  commentBlockedKeywords: ["博彩", "赌博", "色情", "诈骗", "辱骂", "violence", "scam", "spam"],
  aiCommentModerationEnabled: false,
  aiCommentModerationRules:
    "判断这条博客评论是否适合公开展示。拦截广告、诈骗、钓鱼、辱骂、仇恨、色情、暴力威胁、隐私泄露、无意义灌水和明显 SEO 外链。普通反对意见、批评、提问、纠错、补充信息应该允许。",
  emailVerificationEnabled: false,
  emailNotificationsEnabled: false,
  manualEmailBroadcastsEnabled: false,
  indexingEnabled: true,
  themePreset: "maker",
  layoutPreset: "shelf",
  locales: ["en", "zh"],
  primaryLanguage: "en",
  i18n: {
    name: { zh: "Jason Wu · 南部机械" },
    description: {
      zh: "Jason Wu 帮助 EMS 工厂把通孔插装从瓶颈变成优势：SMT/THT PCB 组装自动化、自动插件机、波峰焊、定制飞达，以及来自深圳的现场与远程技术支持。",
    },
    authorBio: {
      zh: "南部机械创始人兼 CEO（深圳，2011 年至今），深耕 SMT/THT 设备 30 余年——产线现场、电话会议、视频连线，服务四大洲的 EMS 团队。",
    },
  },
};

export const tags: Tag[] = [
  {
    id: "tag-auto-insertion",
    name: "Auto Insertion",
    slug: "auto-insertion",
    description: "Radial, axial, pin/eyelet and terminal insertion machines for THT lines.",
    i18n: {
      name: { zh: "自动插件" },
      description: { zh: "立式、卧式、PIN 眼与端子自动插装设备。" },
    },
  },
  {
    id: "tag-odd-form",
    name: "Odd-Form Components",
    slug: "odd-form-components",
    description: "Feeding and inserting connectors, transformers, relays and other odd-form parts.",
    i18n: {
      name: { zh: "异形元件" },
      description: { zh: "连接器、变压器、继电器等异形元件的供料与插装。" },
    },
  },
  {
    id: "tag-wave-soldering",
    name: "Wave Soldering",
    slug: "wave-soldering",
    description: "Wave solder machines, titanium fingers, flux nozzles, conveyors and pallets.",
    i18n: {
      name: { zh: "波峰焊" },
      description: { zh: "波峰焊设备、钛爪、喷雾 nozzle、接驳台与治具。" },
    },
  },
  {
    id: "tag-spare-parts",
    name: "Spare Parts & Feeders",
    slug: "spare-parts-feeders",
    description: "Custom feeders, nozzles and consumables integrated with major machine brands.",
    i18n: {
      name: { zh: "备件与飞达" },
      description: { zh: "兼容主流设备品牌的定制飞达、吸嘴与耗材。" },
    },
  },
  {
    id: "tag-material-handling",
    name: "Material Handling",
    slug: "material-handling",
    description: "AGV trolleys, magazine loaders/unloaders and ESD handling for PCB lines.",
    i18n: {
      name: { zh: "物料转运" },
      description: { zh: "AGV 小车、PCB 起盘/上板机与防静电转运方案。" },
    },
  },
  {
    id: "tag-field-service",
    name: "Field Service",
    slug: "field-service",
    description: "Install, commission, train, troubleshoot — lessons from the factory floor.",
    i18n: {
      name: { zh: "现场服务" },
      description: { zh: "安装、调试、培训与排障——来自产线一线的经验。" },
    },
  },
];

export const series: Series[] = [
  {
    id: "series-manual-to-automated",
    name: "Manual to Automated",
    slug: "manual-to-automated",
    description: "A practical roadmap for moving through-hole insertion from hands to machines.",
    sortOrder: 10,
    i18n: {
      name: { zh: "从手工到自动" },
      description: { zh: "把通孔插装从人手迁移到机器的务实路线图。" },
    },
  },
  {
    id: "series-line-notes",
    name: "Notes From the Line",
    slug: "notes-from-the-line",
    description: "Field stories, safety retrofits and spare-part fixes from real EMS factories.",
    sortOrder: 20,
    i18n: {
      name: { zh: "产线笔记" },
      description: { zh: "来自真实 EMS 工厂的现场故事、安全改造与备件修复。" },
    },
  },
];

const insertion = tags[0];
const oddForm = tags[1];
const wave = tags[2];
const spares = tags[3];
const handling = tags[4];
const field = tags[5];
const manualToAuto = series[0];
const lineNotes = series[1];

export const posts: Post[] = [
  {
    id: "post-manual-insertion-tax",
    title: "The most expensive sound on your PCB line is the silence of manual insertion",
    slug: "manual-insertion-is-a-tax-you-forgot-you-were-paying",
    excerpt:
      "Ten stations of operators placing radial parts one by one is not labor — it is a recurring tax on quality, capacity, and planning. Here is how to size the escape.",
    coverImage: "/images/hero-insertion-line.jpg",
    contentMarkdown: `# The most expensive sound on your PCB line is the silence of manual insertion

If you walk a manual through-hole area, everything looks calm. That is the trap. Manual insertion hides three costs at once: defect escapes, capacity ceilings, and wage inflation.

## What to count before you count machines

- Parts per board x boards per shift = insertion moves per shift.
- Escape rate: one reversed polarity capacitor that survives to ICT costs 10x an insertion station's daily wage.
- Changeover pain: every new product re-trains hands; a feeder re-loads in minutes.

## The four-step migration

1. Pick the single highest-volume radial or terminal step.
2. Send us the component tape/reel samples and the PCB file.
3. Watch a live demo run of your own parts on camera.
4. Start with one inserter (S3000A/S3010A class), then extend to a multi-station line.

No wrong parts, no wrong polarity, no hero operators required.
`,
    contentHtml:
      "<p>Manual insertion hides three costs at once: defect escapes, capacity ceilings, and wage inflation.</p><p>Count the moves, count the escapes, then migrate one station at a time with live demos of your own components.</p>",
    contentText:
      "Manual through-hole insertion is a recurring tax on quality and capacity. Count insertion moves, escape cost, and changeover pain, then migrate step by step with demo runs of your own components.",
    status: "published",
    source: "editor",
    featured: true,
    pinned: true,
    commentsEnabled: true,
    publishedAt: "2026-08-24T09:00:00.000Z",
    updatedAt: "2026-08-24T09:00:00.000Z",
    authorName: "Jason Wu",
    series: manualToAuto,
    tags: [insertion, oddForm],
    seoTitle: "Manual to Auto Insertion: a 4-step migration plan for EMS lines",
    seoDescription:
      "How EMS factories calculate the true cost of manual through-hole insertion and migrate to auto insertion machines one station at a time.",
    i18n: {
      title: { zh: "PCB 产线上最贵的声音，是手工插件时的沉默" },
      excerpt: {
        zh: "十个工位的人一颗一颗插立式元件不是人工，而是对品质、产能和排班的重复征税。这篇文章给出脱身的计算方法。",
      },
    },
  },
  {
    id: "post-odd-form-four-steps",
    title: "Odd-form components: the four-level upgrade path from bowl to inline",
    slug: "odd-form-components-four-level-upgrade-path",
    excerpt:
      "Connectors, transformers and relays do not have to mean hand insertion. Bowl, belt, tube, tray, reel — each feeder level buys you speed and polarity control.",
    coverImage: "/images/s7900-odd-form.jpg",
    contentMarkdown: `# Odd-form components: the four-level upgrade path from bowl to inline

Odd-form parts kill automation projects because every engineer starts with the same question: "but my component is special." It is not that special. There is a feeding method for it.

## Level 1 — Bulk + vision orientation

Loose parts in a bowl or vibratory feeder, camera checks polarity before insertion. Fast to start, best for simple geometries.

## Level 2 — Taped and reel-packaged

Re-taping odd-form parts (terminals, tact switches, big caps) unlocks the same pick-and-place-grade feeding speed. We build the taping tooling and the reel feeders.

## Level 3 — Tray and tube feeders

For transformers, sockets and pinned parts: stick/tube feeders (STF1003 class) and tray feeders keep damage rates near zero.

## Level 4 — Dedicated inline inserter

S7900-class machines combine several feeding levels in one inline cell with clinching and polarity verification.

Send the drawing or a sample. We tell you which level your part lives at.
`,
    contentHtml:
      "<p>Odd-form parts are less special than they look: bowl, belt, tube, tray, reel — each feeding level buys speed and polarity control, and a dedicated inserter combines them inline.</p>",
    contentText:
      "A four-level roadmap for automating odd-form through-hole components, from vibratory bowls to taped reels, tube and tray feeders, and dedicated inline insertion cells.",
    status: "published",
    source: "editor",
    featured: true,
    pinned: false,
    commentsEnabled: true,
    publishedAt: "2026-08-20T09:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z",
    authorName: "Jason Wu",
    series: manualToAuto,
    tags: [oddForm, spares, insertion],
    seoTitle: "Odd-form component insertion: bowl, reel, tube, tray, inline",
    seoDescription:
      "The four-level feeding upgrade path for odd-form THT components — connectors, transformers, relays — with auto insertion machines.",
    i18n: {
      title: { zh: "异形元件：从振动盘到在线插装的四级升级路线" },
      excerpt: {
        zh: "连接器、变压器、继电器不等于手工插件。振动盘、编带、管装、托盘——每一级供料方式都在为你买来速度与极性控制。",
      },
    },
  },
  {
    id: "post-nr12-trolley",
    title: "Brazil NR12 made us rebuild a JUKI RS-1 feeder trolley — twice",
    slug: "brazil-nr12-juki-rs1-feeder-trolley-story",
    excerpt:
      "A safety standard written for machinery became the best product spec we ever received. Here is how the ESD feeder trolley with safety finger survived certification thinking.",
    coverImage: "/images/esd-magazine-rack.jpg",
    contentMarkdown: `# Brazil NR12 made us rebuild a JUKI RS-1 feeder trolley — twice

NR12 is Brazil's machinery safety regulation. When a Brazilian EMS plant asked whether our feeder trolleys for JUKI RS-1 machines could comply, we stopped selling carts and started engineering.

## What the regulation forced us to see

- Operator hands near moving feeders are the risk point — so the trolley geometry and safety finger had to keep the pinch zone covered during loading.
- ESD discipline and mechanical safety are the same conversation: grounding path, stable castors, no sharp edges.
- Documentation is part of the product: maintenance logs and safe work procedures ship with the trolley.

## The result

A trolley family that carries feeders, reels, and magazines safely, rolls on locked castors, and passes customer safety reviews in Brazil and beyond.

Safety questions are design questions in disguise.
`,
    contentHtml:
      "<p>Brazil's NR12 safety regulation turned a simple feeder trolley into an engineered product: pinch-zone protection, ESD grounding, and documentation that ships with the cart.</p>",
    contentText:
      "How NR12 machinery safety rules shaped the design of ESD feeder trolleys and magazine racks for JUKI RS-1 SMT lines in Brazilian EMS factories.",
    status: "published",
    source: "editor",
    featured: false,
    pinned: false,
    commentsEnabled: true,
    publishedAt: "2026-08-16T09:00:00.000Z",
    updatedAt: "2026-08-16T09:00:00.000Z",
    authorName: "Jason Wu",
    series: lineNotes,
    tags: [field, handling, spares],
    seoTitle: "Brazil NR12 compliant feeder trolleys for JUKI RS-1 lines",
    seoDescription:
      "A field story of engineering NR12-ready ESD feeder trolleys and safety fingers for JUKI RS-1 placement machines.",
    i18n: {
      title: { zh: "巴西 NR12 逼我们把 JUKI RS-1 飞达台车重做了两遍" },
      excerpt: {
        zh: "一份写给机械的安全法规，成了我们收到过的最好的产品需求说明书。看防静电飞达台车如何带着安全指手通过认证思维。",
      },
    },
  },
  {
    id: "post-wave-fingers",
    title: "The hidden margin in wave soldering is hiding inside your furnace",
    slug: "wave-soldering-titanium-fingers-hidden-margin",
    excerpt:
      "Finger marks, warped pallets, and chain jitter quietly eat wave soldering yield. A field guide to the consumables nobody budgets for.",
    coverImage: "/images/wave-soldering-line.jpg",
    contentMarkdown: `# The hidden margin in wave soldering is hiding inside your furnace

The cheapest component in the furnace — the titanium fingers holding your pallets — touches every board you sell. Worn plating leaves marks, uneven grip warps pallets, and chain jitter shows up as intermittent bridging.

Treat consumables as process control: log finger condition at every PM, rotate pallets on schedule, and match replacements to the original drawing, not to a part number guess.
`,
    contentHtml:
      "<p>The cheapest component in the furnace — the titanium fingers holding your pallets — touches every board you sell.</p><p>Treat consumables as process control.</p>",
    contentText:
      "Wave soldering fingers, pallet condition, and chain wear quietly drive defect rates; treat consumables as process control and match replacements to drawings.",
    status: "published",
    source: "editor",
    featured: false,
    pinned: false,
    commentsEnabled: true,
    publishedAt: "2026-08-12T09:00:00.000Z",
    updatedAt: "2026-08-12T09:00:00.000Z",
    authorName: "Jason Wu",
    series: lineNotes,
    tags: [wave, spares],
    seoTitle: "Wave soldering titanium fingers: a yield field guide",
    seoDescription:
      "How wave soldering fingers, pallets, and chain condition quietly drive defect rates in EMS lines.",
    i18n: {
      title: { zh: "波峰焊里藏着的利润，就藏在你炉子里面" },
      excerpt: {
        zh: "夹爪印、治具变形、链条抖动，正在悄悄吃掉你的波峰焊良率。",
      },
    },
  },
];

export const comments: Comment[] = [
  {
    id: "comment-demo-1",
    postId: "post-manual-insertion-tax",
    parentId: null,
    authorName: "Marta R.",
    authorEmailHash: "pending-email-hash",
    authorWebsite: null,
    body: "We counted 14 insertion moves per board on our power module. The escape-rate math convinced my plant manager.",
    status: "approved",
    createdAt: "2026-08-25T02:10:00.000Z",
    i18n: {
      body: {
        zh: "我们电源板每块要插 14 个元件。逃逸成本的算法说服了我的厂长。",
      },
    },
  },
];

export const assets: Asset[] = [
  {
    id: "asset-og",
    key: "site/og-default.svg",
    url: "/og-default.svg",
    filename: "og-default.svg",
    contentType: "image/svg+xml",
    sizeBytes: 4096,
    createdAt: "2026-08-24T08:00:00.000Z",
    attachedPostId: null,
  },
  {
    id: "asset-cover",
    key: "posts/hero-insertion-line.jpg",
    url: posts[0].coverImage,
    filename: "hero-insertion-line.jpg",
    contentType: "image/jpeg",
    sizeBytes: 65536,
    createdAt: "2026-08-24T09:10:00.000Z",
    attachedPostId: "post-manual-insertion-tax",
  },
];
