#!/usr/bin/env node
// Seed the Jason Wu blog posts from content/posts/*.md into the CMS database.
//
// Usage:
//   node scripts/seed-jasonwu-blog.mjs                 # generate output/jasonwu-blog/posts.sql
//   node scripts/seed-jasonwu-blog.mjs --apply-local   # also apply to local D1 via wrangler
//   node scripts/seed-jasonwu-blog.mjs --apply-remote  # also apply to remote D1 (production!)
//
// Source of truth: content/posts/*.md with YAML-ish front matter.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const postsDir = join(root, "content", "posts");
const outDir = join(root, "output", "jasonwu-blog");

const SERIES = {
  "manual-to-automated": {
    id: "series-manual-to-automated",
    name: "Manual to Automated",
    description: "A practical roadmap for moving through-hole insertion from hands to machines.",
    sortOrder: 10,
    nameZh: "从手工到自动",
  },
  "notes-from-the-line": {
    id: "series-line-notes",
    name: "Notes From the Line",
    description: "Field stories, safety retrofits and spare-part fixes from real EMS factories.",
    sortOrder: 20,
    nameZh: "产线笔记",
  },
};

const TAGS = {
  "auto-insertion": {
    id: "tag-auto-insertion",
    name: "Auto Insertion",
    description: "Radial, axial, pin/eyelet and terminal insertion machines for THT lines.",
    nameZh: "自动插件",
  },
  "odd-form-components": {
    id: "tag-odd-form",
    name: "Odd-Form Components",
    description: "Feeding and inserting connectors, transformers, relays and other odd-form parts.",
    nameZh: "异形元件",
  },
  "wave-soldering": {
    id: "tag-wave-soldering",
    name: "Wave Soldering",
    description: "Wave solder machines, titanium fingers, flux nozzles, conveyors and pallets.",
    nameZh: "波峰焊",
  },
  "spare-parts-feeders": {
    id: "tag-spare-parts",
    name: "Spare Parts & Feeders",
    description: "Custom feeders, nozzles and consumables integrated with major machine brands.",
    nameZh: "备件与飞达",
  },
  "material-handling": {
    id: "tag-material-handling",
    name: "Material Handling",
    description: "AGV trolleys, magazine loaders/unloaders and ESD handling for PCB lines.",
    nameZh: "物料转运",
  },
  "field-service": {
    id: "tag-field-service",
    name: "Field Service",
    description: "Install, commission, train, troubleshoot — lessons from the factory floor.",
    nameZh: "现场服务",
  },
};

const TAG_ALIASES = {
  "Auto Insertion": "auto-insertion",
  "Odd-Form Components": "odd-form-components",
  "Wave Soldering": "wave-soldering",
  "Spare Parts & Feeders": "spare-parts-feeders",
  "Material Handling": "material-handling",
  "Field Service": "field-service",
};

function parseFrontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) {
    throw new Error("missing front matter");
  }
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z][\w]*):\s*(.*)$/.exec(line.trim());
    if (!kv) {
      continue;
    }
    let value = kv[2].trim();
    if (value.startsWith("[")) {
      meta[kv[1]] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      meta[kv[1]] = value === "true";
    } else {
      meta[kv[1]] = value.replace(/^"|"$/g, "");
    }
  }
  return { meta, body: raw.slice(match[0].length).trim() };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderInline(value) {
  let out = escapeHtml(value);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_m, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy" />`,
  );
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, text, href) =>
      `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`,
  );
  return out;
}

function renderMarkdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      const tag = list.ordered ? "ol" : "ul";
      html.push(
        `<${tag}>${list.items.map((i) => `<li>${renderInline(i)}</li>`).join("")}</${tag}>`,
      );
      list = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line.trim());
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      html.push("<hr />");
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line.trim());
    if (bullet) {
      flushParagraph();
      list = list && !list.ordered ? list : { ordered: false, items: [] };
      list.items.push(bullet[1]);
      continue;
    }
    const ordered = /^\d+\.\s+(.*)$/.exec(line.trim());
    if (ordered) {
      flushParagraph();
      list = list && list.ordered ? list : { ordered: true, items: [] };
      list.items.push(ordered[1]);
      continue;
    }
    const quote = /^>\s?(.*)$/.exec(line.trim());
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote><p>${renderInline(quote[1])}</p></blockquote>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return html.join("\n");
}

function markdownToText(markdown) {
  return markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/[#>*_`]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlBool(value) {
  return value ? "1" : "0";
}

function loadPosts() {
  const files = readdirSync(postsDir)
    .filter((name) => name.endsWith(".md"))
    .sort();
  return files.map((name) => {
    const raw = readFileSync(join(postsDir, name), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    for (const key of [
      "id",
      "title",
      "slug",
      "excerpt",
      "seoTitle",
      "seoDescription",
      "publishedAt",
    ]) {
      if (!meta[key]) {
        throw new Error(`${name}: missing front matter key "${key}"`);
      }
    }
    const tagSlugs = (meta.tags ?? []).map((tag) => {
      const slug = TAG_ALIASES[tag];
      if (!slug) {
        throw new Error(`${name}: unknown tag "${tag}"`);
      }
      return slug;
    });
    if (meta.series && !SERIES[meta.series]) {
      throw new Error(`${name}: unknown series "${meta.series}"`);
    }
    return { file: name, meta, body, tagSlugs };
  });
}

function buildSql(posts) {
  const now = new Date().toISOString();
  const lines = [
    "-- Generated by scripts/seed-jasonwu-blog.mjs from content/posts/*.md",
    "-- Idempotent: safe to re-run. Review before running against production D1.",
    "",
  ];

  for (const [slug, s] of Object.entries(SERIES)) {
    lines.push(
      `INSERT INTO series (id, name, slug, description, sort_order, i18n, created_at, updated_at) VALUES (${sqlString(s.id)}, ${sqlString(s.name)}, ${sqlString(slug)}, ${sqlString(s.description)}, ${s.sortOrder}, ${sqlString(JSON.stringify({ name: { zh: s.nameZh } }))}, ${sqlString(now)}, ${sqlString(now)}) ON CONFLICT(slug) DO UPDATE SET name = excluded.name, description = excluded.description, sort_order = excluded.sort_order, i18n = excluded.i18n, updated_at = excluded.updated_at;`,
    );
  }
  lines.push("");

  for (const [slug, t] of Object.entries(TAGS)) {
    lines.push(
      `INSERT INTO tags (id, name, slug, description, i18n, created_at) VALUES (${sqlString(t.id)}, ${sqlString(t.name)}, ${sqlString(slug)}, ${sqlString(t.description)}, ${sqlString(JSON.stringify({ name: { zh: t.nameZh } }))}, ${sqlString(now)}) ON CONFLICT(slug) DO UPDATE SET name = excluded.name, description = excluded.description, i18n = excluded.i18n;`,
    );
  }
  lines.push("");

  for (const post of posts) {
    const { meta, body, tagSlugs } = post;
    const html = renderMarkdownToHtml(body);
    const text = markdownToText(body);
    const i18n = {
      title: { zh: meta.titleZh ?? meta.title },
      excerpt: { zh: meta.excerptZh ?? meta.excerpt },
    };

    lines.push(
      [
        `-- ${post.file}`,
        "INSERT INTO posts (id, title, slug, excerpt, cover_image, content_markdown, content_html, content_text, status, source, featured, pinned, comments_enabled, seo_title, seo_description, canonical_url, robots, structured_data, i18n, published_at, created_at, updated_at, author_id, series_id)",
        `VALUES (${sqlString(meta.id)}, ${sqlString(meta.title)}, ${sqlString(meta.slug)}, ${sqlString(meta.excerpt)}, ${sqlString(meta.coverImage ?? null)}, ${sqlString(body)}, ${sqlString(html)}, ${sqlString(text)}, 'published', 'markdown_upload', ${sqlBool(meta.featured === true)}, ${sqlBool(meta.pinned === true)}, 1, ${sqlString(meta.seoTitle)}, ${sqlString(meta.seoDescription)}, NULL, 'index,follow', NULL, ${sqlString(JSON.stringify(i18n))}, ${sqlString(meta.publishedAt)}, ${sqlString(meta.publishedAt)}, ${sqlString(now)}, NULL, ${meta.series ? `(SELECT id FROM series WHERE slug = ${sqlString(meta.series)})` : "NULL"})`,
        "ON CONFLICT(slug) DO UPDATE SET",
        "title = excluded.title,",
        "excerpt = excluded.excerpt,",
        "cover_image = excluded.cover_image,",
        "content_markdown = excluded.content_markdown,",
        "content_html = excluded.content_html,",
        "content_text = excluded.content_text,",
        "status = excluded.status,",
        "featured = excluded.featured,",
        "pinned = excluded.pinned,",
        "seo_title = excluded.seo_title,",
        "seo_description = excluded.seo_description,",
        "i18n = excluded.i18n,",
        "series_id = excluded.series_id,",
        "updated_at = excluded.updated_at;",
        "",
        `DELETE FROM post_tags WHERE post_id = ${sqlString(meta.id)};`,
        ...tagSlugs.map(
          (slug) =>
            `INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (${sqlString(meta.id)}, (SELECT id FROM tags WHERE slug = ${sqlString(slug)}));`,
        ),
        "",
      ].join("\n"),
    );
  }

  return `${lines.join("\n")}\n`;
}

function applySql(sqlFile, remote) {
  const args = [
    "--filter",
    "@repo/web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    "CMS_DB",
    "--config",
    "wrangler.jsonc",
    `--file=${sqlFile}`,
    "--yes",
  ];
  if (remote) {
    args.push("--remote");
  }
  console.log(`applying ${sqlFile} to ${remote ? "REMOTE" : "local"} D1 ...`);
  execFileSync("pnpm", args, { stdio: "inherit" });
}

const posts = loadPosts();
mkdirSync(outDir, { recursive: true });
const sqlFile = join(outDir, "posts.sql");
writeFileSync(sqlFile, buildSql(posts));
console.log(`wrote ${sqlFile} (${posts.length} posts from content/posts/)`);

if (process.argv.includes("--apply-local")) {
  applySql(sqlFile, false);
}
if (process.argv.includes("--apply-remote")) {
  applySql(sqlFile, true);
}
