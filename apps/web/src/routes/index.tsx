import {
  formatDate,
  localizePost,
  localizeSiteSettings,
  type Post,
  type SupportedLocale,
} from "@repo/core";
import { Button } from "@repo/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  CogIcon,
  PackageIcon,
  ExternalLinkIcon,
  FileTextIcon,
  FlameIcon,
  GlobeIcon,
  LayersIcon,
  MailIcon,
  MessageCircleIcon,
  PlayIcon,
  SprayCanIcon,
  TruckIcon,
  VideoIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import { SiteShell } from "#/components/site-shell";
import { $getHomePageData, type HomePageData } from "#/lib/cms-server";
import { getCurrentLocale } from "#/lib/i18n";
import { m } from "#/paraglide/messages.js";

export const Route = createFileRoute("/")({
  loader: (): Promise<HomePageData> => $getHomePageData(),
  component: HomePage,
});

type HomeViewProps = {
  readonly posts: Post[];
  readonly locale: SupportedLocale;
};

type FeatureItem = {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

type FreeHighlight = {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly body: string;
};

type SetupPath = {
  readonly title: string;
  readonly description: string;
  readonly cta: string;
  readonly href: string;
  readonly icon: LucideIcon;
};

type ProductBadge = {
  readonly name: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

type HomeRevealStyle = CSSProperties & {
  readonly "--home-reveal-delay": string;
};

const WHATSAPP_URL = "https://wa.me/8613602562576";
const EMAIL_URL = "mailto:info@smthelp.com";
const YOUTUBE_URL = "https://www.youtube.com/c/Smthelping";

const demoVideos: readonly {
  readonly id: string;
  readonly title: { readonly en: string; readonly zh: string };
  readonly note: { readonly en: string; readonly zh: string };
}[] = [
  {
    id: "0k4U5NLKq4k",
    title: {
      en: "How China made the auto insertion machine",
      zh: "中国是如何制造自动插件机的",
    },
    note: {
      en: "The build story behind the THT inserters I put on EMS floors every week.",
      zh: "每周被我送上 EMS 产线的插件机，背后是这样造出来的。",
    },
  },
  {
    id: "KTTUTJRVT4M",
    title: {
      en: "THT line: eyelet + jumper wire + axial + radial",
      zh: "THT 产线：鸡眼 + 跨线 + 卧式 + 立式一次过",
    },
    note: {
      en: "One inline line running four insertion technologies end to end.",
      zh: "一条在线产线跑通四种插装工艺。",
    },
  },
  {
    id: "0ivNvJMlJrQ",
    title: {
      en: "S7020T: reel terminal & radial taped odd-form insertion",
      zh: "S7020T：卷装端子与立式编带异形件插装",
    },
    note: {
      en: "Terminals and radial parts feeding from reels — no bulk bowls, no polarity surprises.",
      zh: "端子与立式元件用编带供料——不用振动盘，极性不翻车。",
    },
  },
  {
    id: "hFUWp8dT0t0",
    title: {
      en: "AGV pallet transport at the wave soldering machine",
      zh: "AGV 在波峰焊机旁转运治具托盘",
    },
    note: {
      en: "SAGV/SFY-class trolleys moving pallets so operators stop walking.",
      zh: "自动小车搬运治具托盘，让操作工不再来回走动。",
    },
  },
  {
    id: "iQx-MsR829c",
    title: {
      en: "10x cost saving: radial feeder auto odd-form insertion",
      zh: "10 倍成本优势：立式飞达异形件自动插装",
    },
    note: {
      en: "Why taped odd-form feeding beats hand insertion on high-mix boards.",
      zh: "为什么编带异形件供料在高混产线上跑赢手工插件。",
    },
  },
  {
    id: "3NqHcrmLeKM",
    title: {
      en: "Installing the ESD PCB magazine rack, step by step",
      zh: "防静电 PCB 起盘架安装步骤",
    },
    note: {
      en: "The same rack family we safety-adapted for Brazil NR12 feeder trolleys.",
      zh: "就是这个架子家族——我们曾为巴西 NR12 改造过飞达台车。",
    },
  },
];

const resourceDocs: readonly {
  readonly title: { readonly en: string; readonly zh: string };
  readonly desc: { readonly en: string; readonly zh: string };
  readonly href: string;
  readonly kind: string;
}[] = [
  {
    title: { en: "Auto-insertion readiness checklist", zh: "自动插件可行性检查表" },
    desc: {
      en: "The exact questions I answer before quoting an insertion line.",
      zh: "报价插件线之前必须回答清楚的那份问题清单。",
    },
    href: "https://file.autoinsertion.com/public/Blog%20file/auto-insertion-readiness-checklist.pdf",
    kind: "PDF",
  },
  {
    title: { en: "ROI calculator template", zh: "ROI 测算模板" },
    desc: {
      en: "Fill in boards, moves, and wages — get a payback window.",
      zh: "填入板数、插点数与工资——得到回本周期。",
    },
    href: "https://file.autoinsertion.com/public/Blog%20file/roi-calculator-template.pdf",
    kind: "PDF",
  },
  {
    title: { en: "S3010A radial inserter catalog", zh: "S3010A 立式插件机图册" },
    desc: {
      en: "High-speed radial insertion with visual verification.",
      zh: "高速立式插装，带视觉检测。",
    },
    href: "https://file.autoinsertion.com/public/Southern%20Machinery%20Product/S3010A%20Radial%20Inserter.pdf",
    kind: "PDF",
  },
  {
    title: { en: "S7900 odd-form inserter catalog", zh: "S7900 异形件插件机图册" },
    desc: {
      en: "Connectors, transformers, relays — fed, placed, clinched.",
      zh: "连接器、变压器、继电器：供料、插装、打弯一次完成。",
    },
    href: "https://file.autoinsertion.com/public/SMThelp%20Machine%20Presentation/Precision_S7900%20odd%20form%20insertion%20machine.pdf",
    kind: "PDF",
  },
  {
    title: { en: "SFY03 AGV for EMS lines", zh: "SFY03 AGV：EMS 产线自动转运" },
    desc: {
      en: "Wireless, rechargeable pallet and magazine transport.",
      zh: "无线、可充电的托盘与 pcb 起盘转运。",
    },
    href: "https://file.autoinsertion.com/public/SMThelp%20Machine%20Presentation/SFY03%20AGV%20Effortless%20Flexibility%20for%20EMS%20SMT%20Lines.pdf",
    kind: "PDF",
  },
  {
    title: { en: "S-WS350 wave soldering machine", zh: "S-WS350 波峰焊机" },
    desc: {
      en: "Lead-free wave soldering plus fingers, nozzles, and spare parts.",
      zh: "无铅波峰焊，兼供钛爪、喷嘴与备件。",
    },
    href: "https://file.autoinsertion.com/public/Southern%20Machinery%20Product/S-WS350%20%20wave%20soldering%20machine.pdf",
    kind: "PDF",
  },
  {
    title: { en: "Customized feeder & nozzle catalog V03", zh: "定制飞达与吸嘴目录 V03" },
    desc: {
      en: "Axial/radial tape, tube, tray, belt and vibe feeders for major brands.",
      zh: "卧式/立式编带、管式、托盘、皮带与振动飞达，兼容主流品牌。",
    },
    href: "https://file.autoinsertion.com/public/Southern%20Machinery%20Product/SAF1001%20Axial%20Tape%20Feeder%20%20Southern%20Machinery%20Customized%20Feeder%20Nozzle%20Catalog%20V03.pdf",
    kind: "PDF",
  },
  {
    title: { en: "SMT production line solution 2023", zh: "SMT 整线方案 2023" },
    desc: {
      en: "Full-line references from printing to inspection and THT.",
      zh: "从印刷、检测直到 THT 的整线参考方案。",
    },
    href: "https://file.autoinsertion.com/public/Southern%20Machinery%20Product/SMT%20production%20line%20solution%202023.pdf",
    kind: "PDF",
  },
  {
    title: { en: "All machine photos", zh: "全部设备实拍" },
    desc: {
      en: "Search the Southern Machinery image bed at ph.smthelp.com.",
      zh: "在 ph.smthelp.com 图床按型号搜索实拍图。",
    },
    href: "https://ph.smthelp.com",
    kind: "Photos",
  },
  {
    title: { en: "Full catalog & manuals library", zh: "完整目录与手册库" },
    desc: {
      en: "Every catalog and manual at file.autoinsertion.com.",
      zh: "所有目录与手册都在 file.autoinsertion.com。",
    },
    href: "https://file.autoinsertion.com",
    kind: "Library",
  },
];

function HomePage() {
  const data: HomePageData = Route.useLoaderData();
  const locale = getCurrentLocale();
  const posts = data.posts.map((post) => localizePost(post, locale)).filter(isReaderFacingPost);
  const siteSettings = localizeSiteSettings(data.siteSettings, locale);
  const homeProps = { posts, locale };

  return (
    <SiteShell siteSettings={siteSettings}>
      <ShelfHome {...homeProps} />
    </SiteShell>
  );
}

function ShelfHome({ posts, locale }: HomeViewProps) {
  const copy = getHomeCopy(locale);
  const latestPosts = posts.slice(0, 3);

  return (
    <div data-home-surface className="bg-background">
      <HomeMotionController />
      {/* ── Hook ── */}
      <section
        data-home-hero
        className="relative isolate overflow-hidden border-b-2 border-foreground"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14 lg:px-8 lg:pt-24 lg:pb-20 xl:px-12">
          <p
            data-home-reveal
            style={getRevealStyle(0)}
            className="text-sm font-semibold tracking-wide text-muted-foreground uppercase"
          >
            {copy.eyebrow}
          </p>
          <h1
            data-home-reveal
            style={getRevealStyle(90)}
            className="mt-6 max-w-5xl text-4xl leading-[0.98] font-semibold text-balance sm:text-6xl lg:text-7xl"
          >
            {copy.heroTitle}
          </h1>
          <p
            data-home-reveal
            style={getRevealStyle(180)}
            className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            {copy.heroBody}
          </p>
          <div data-home-reveal style={getRevealStyle(270)} className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<a href={WHATSAPP_URL} aria-label={copy.primaryCta} />}
              nativeButton={false}
              size="lg"
              className="hover:-translate-y-0.5"
            >
              <MessageCircleIcon />
              {copy.primaryCta}
              <ArrowRightIcon />
            </Button>
            <Button
              render={<Link to="/blog" search={{ q: "", tag: "", series: "", page: 1 }} />}
              variant="outline"
              nativeButton={false}
              size="lg"
              className="hover:-translate-y-0.5"
            >
              <FileTextIcon />
              {copy.secondaryCta}
            </Button>
          </div>
          <p
            data-home-reveal
            style={getRevealStyle(330)}
            className="mt-6 text-xs leading-5 text-muted-foreground"
          >
            {copy.trustLine}
          </p>
        </div>
        <div
          data-home-reveal
          style={getRevealStyle(380)}
          className="relative z-10 border-t-2 border-foreground"
        >
          <img
            src="/images/hero-insertion-line.jpg"
            alt={copy.heroImageAlt}
            width={1600}
            height={552}
            className="mx-auto block w-full max-w-6xl object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      <LatestPostsSection copy={copy} latestPosts={latestPosts} locale={locale} />

      {/* ── Diagnosis ── */}
      <section className="border-b border-border bg-muted/35">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <div data-home-reveal className="grid gap-9 lg:grid-cols-[0.44fr_0.56fr]">
            <div>
              <p className="text-sm font-semibold text-link uppercase">{copy.diagnosisEyebrow}</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
                {copy.diagnosisTitle}
              </h2>
            </div>
            <p className="self-end text-sm leading-7 text-muted-foreground">{copy.diagnosisBody}</p>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {copy.diagnosisPoints.map((point, index) => (
              <OwnershipRow key={point.title} point={point} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars (the three tags) ── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-9 px-4 py-12 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8 lg:py-16 xl:px-12">
          <div data-home-reveal className="max-w-md">
            <p className="text-sm font-semibold text-link uppercase">{copy.pillarsEyebrow}</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
              {copy.pillarsTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.pillarsBody}</p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {copy.pillars.map((feature, index) => (
              <FeatureRow key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Scenes ── */}
      <section className="border-b border-border bg-muted/35">
        <div className="mx-auto grid max-w-6xl gap-9 px-4 py-12 sm:px-6 lg:grid-cols-[0.44fr_0.56fr] lg:px-8 lg:py-16 xl:px-12">
          <div data-home-reveal className="max-w-md">
            <p className="text-sm font-semibold text-link uppercase">{copy.scenesEyebrow}</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
              {copy.scenesTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{copy.scenesBody}</p>
            <div className="mt-6">
              <Button
                render={<a href={YOUTUBE_URL} aria-label={copy.scenesCta} />}
                variant="outline"
                nativeButton={false}
                className="hover:-translate-y-0.5"
              >
                <VideoIcon />
                {copy.scenesCta}
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {copy.scenesPoints.map((feature, index) => (
              <FeatureRow key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Framework ── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <div data-home-reveal className="grid gap-9 lg:grid-cols-[0.44fr_0.56fr]">
            <div>
              <p className="text-sm font-semibold text-link uppercase">{copy.frameworkEyebrow}</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
                {copy.frameworkTitle}
              </h2>
            </div>
            <p className="self-end text-sm leading-7 text-muted-foreground">{copy.frameworkBody}</p>
          </div>
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
            {copy.setupPaths.map((path, index) => (
              <SetupPathCard key={path.title} href={path.href} path={path} index={index} />
            ))}
          </div>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {copy.frameworkSteps.map((step, index) => (
              <li
                key={step.number}
                data-home-reveal
                data-home-row
                style={getRevealStyle(index * 55)}
                className="grid gap-3 py-5 sm:grid-cols-[92px_minmax(0,1fr)]"
              >
                <span className="text-sm font-semibold text-muted-foreground">{step.number}</span>
                <span>
                  <span className="block text-lg font-semibold">{step.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Vehicle: free demo + commitments ── */}
      <section className="border-b border-border bg-muted/35">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <p data-home-reveal className="text-sm font-semibold text-link uppercase">
            {copy.freeEyebrow}
          </p>
          <h2
            data-home-reveal
            style={getRevealStyle(75)}
            className="mt-3 max-w-2xl text-3xl leading-tight font-semibold text-balance"
          >
            {copy.freeTitle}
          </h2>
          <p
            data-home-reveal
            style={getRevealStyle(150)}
            className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground"
          >
            {copy.freeBody}
          </p>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
            {copy.freeHighlights.map((h, index) => (
              <FreeHighlightCard key={h.label} item={h} index={index} />
            ))}
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {copy.commitments.map((item, index) => (
              <QuotaRow key={item.service} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Product lines ── */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <p data-home-reveal className="text-sm font-semibold text-link uppercase">
            {copy.productsEyebrow}
          </p>
          <h2
            data-home-reveal
            style={getRevealStyle(75)}
            className="mt-3 max-w-2xl text-3xl leading-tight font-semibold text-balance"
          >
            {copy.productsTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {copy.productBadges.map((item, index) => (
              <ProductBadgeCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <VideosSection locale={locale} />
      <ResourcesSection locale={locale} />
      <ContactSection copy={copy} locale={locale} />
    </div>
  );
}

function VideosSection({ locale }: { readonly locale: SupportedLocale }) {
  const title = locale === "zh" ? "Watch the machines work" : "Watch the machines work";
  const eyebrow = locale === "zh" ? "YouTube · Smthelping" : "YouTube · Smthelping";
  const body =
    locale === "zh"
      ? "这些视频都来自我们自己的频道 youtube.com/c/Smthelping——你的元件上机演示也可以现场直播给你看。"
      : "Every clip is from our own channel, youtube.com/c/Smthelping — and we can run your components live, on camera.";

  return (
    <section id="videos" className="border-b border-border bg-muted/35">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
        <div data-home-reveal className="grid gap-9 lg:grid-cols-[0.44fr_0.56fr]">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-link uppercase">{eyebrow}</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">{title}</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
            <div className="mt-6">
              <Button
                render={<a href={YOUTUBE_URL} aria-label={title} />}
                nativeButton={false}
                className="hover:-translate-y-0.5"
              >
                <PlayIcon />
                {locale === "zh" ? "订阅频道" : "Subscribe on YouTube"}
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {demoVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} locale={locale} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  index,
  locale,
  video,
}: {
  readonly index: number;
  readonly locale: SupportedLocale;
  readonly video: (typeof demoVideos)[number];
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 60)}
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&autoplay=1`}
          title={video.title[locale]}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block aspect-video w-full"
          aria-label={video.title[locale]}
        >
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            className="size-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/25 transition group-hover:bg-foreground/15">
            <span className="flex size-12 items-center justify-center rounded-full bg-background/90 text-foreground">
              <PlayIcon className="size-5 translate-x-0.5" />
            </span>
          </span>
        </button>
      )}
      <div className="p-4">
        <p className="text-sm leading-tight font-semibold">{video.title[locale]}</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{video.note[locale]}</p>
      </div>
    </article>
  );
}

function ResourcesSection({ locale }: { readonly locale: SupportedLocale }) {
  const eyebrow = locale === "zh" ? "目录与手册" : "Catalogs & manuals";
  const title = locale === "zh" ? "先拿资料，再谈设备" : "Take the paperwork before the machine";
  const body =
    locale === "zh"
      ? "检查表、ROI 模板和各产品目录都来自 file.autoinsertion.com——下载后带着你的板子来聊，效率翻倍。"
      : "Checklists, an ROI template, and product catalogs from file.autoinsertion.com. Download first, then bring your boards to the conversation.";

  return (
    <section id="resources" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
        <div data-home-reveal className="max-w-2xl">
          <p className="text-sm font-semibold text-link uppercase">{eyebrow}</p>
          <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          {resourceDocs.map((doc, index) => (
            <a
              key={doc.href + doc.title.en}
              href={doc.href}
              data-home-reveal
              data-home-card
              style={getRevealStyle(index * 40)}
              target={doc.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-start gap-4 bg-background p-5 transition hover:bg-muted/35"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                {doc.kind === "PDF" ? (
                  <FileTextIcon className="size-5" />
                ) : (
                  <LayersIcon className="size-5" />
                )}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-base font-semibold group-hover:text-link">
                    {doc.title[locale]}
                  </span>
                  <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {doc.kind}
                  </span>
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                  {doc.desc[locale]}
                </span>
              </span>
              <ExternalLinkIcon className="mt-1 ml-auto size-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  copy,
  locale,
}: {
  readonly copy: ReturnType<typeof getHomeCopy>;
  readonly locale: SupportedLocale;
}) {
  return (
    <section id="contact" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
        <div className="grid gap-9 lg:grid-cols-[0.4fr_0.6fr]">
          <div data-home-reveal className="max-w-md">
            <p className="text-sm font-semibold text-link uppercase">{copy.contactEyebrow}</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance">
              {copy.contactTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{copy.contactBody}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                render={<a href={WHATSAPP_URL} aria-label={copy.contactPrimaryCta} />}
                nativeButton={false}
                className="hover:-translate-y-0.5"
              >
                <MessageCircleIcon />
                {copy.contactPrimaryCta}
              </Button>
              <Button
                render={<a href={EMAIL_URL} aria-label={copy.contactSecondaryCta} />}
                variant="outline"
                nativeButton={false}
                className="hover:-translate-y-0.5"
              >
                <MailIcon />
                {copy.contactSecondaryCta}
              </Button>
            </div>
          </div>

          <div className="grid gap-px border border-border bg-border md:grid-cols-3">
            {copy.contactSpotlights.map((item, index) => (
              <ContactSpotlightCard key={item.href} item={item} index={index} />
            ))}
          </div>
        </div>

        <div
          data-home-reveal
          style={getRevealStyle(210)}
          className="mt-10 flex flex-col gap-3 border-y border-foreground py-5 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-semibold">
            {locale === "zh" ? "签名服务承诺：" : "Service signature:"}{" "}
            <span className="font-normal text-muted-foreground">
              {locale === "zh"
                ? "2 小时回复 · 当天出初步方案 · 3 天给问题解决预案"
                : "reply in 2 hours · first proposal the same day · resolution plan in 3 days"}
            </span>
          </p>
          <p className="text-muted-foreground">
            {locale === "zh"
              ? "Jason Wu · 深圳南部机械"
              : "Jason Wu · Southern Machinery, Shenzhen"}
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactSpotlightCard({
  index,
  item,
}: {
  readonly index: number;
  readonly item: ContactSpotlight;
}) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 70)}
      className="group bg-background p-5 transition hover:bg-muted/35"
    >
      <span
        data-home-icon
        className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span className="mt-5 block text-lg leading-tight font-semibold group-hover:text-link">
        {item.title}
      </span>
      <span className="mt-3 block text-sm leading-6 text-muted-foreground">{item.description}</span>
      <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-link">
        {item.cta}
        <ExternalLinkIcon className="size-4" />
      </span>
    </a>
  );
}

function LatestPostsSection({
  copy,
  latestPosts,
  locale,
}: {
  readonly copy: ReturnType<typeof getHomeCopy>;
  readonly latestPosts: Post[];
  readonly locale: SupportedLocale;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
        <div data-home-reveal className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-link uppercase">{copy.contentEyebrow}</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold">{copy.contentTitle}</h2>
          </div>
        </div>

        {latestPosts.length ? (
          <div
            className={`mt-7 grid gap-px border border-border bg-border ${getLatestPostsGridClassName(
              latestPosts.length,
            )}`}
          >
            {latestPosts.map((post, index) => (
              <LatestPostCard key={post.id} post={post} locale={locale} index={index} />
            ))}
          </div>
        ) : null}

        <div data-home-reveal className="mt-7">
          <Button
            render={<Link to="/blog" search={{ q: "", tag: "", series: "", page: 1 }} />}
            variant="outline"
            nativeButton={false}
            className="hover:-translate-y-0.5"
          >
            {m.view_all_posts()}
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}

function getLatestPostsGridClassName(count: number) {
  if (count <= 1) {
    return "md:grid-cols-1";
  }

  if (count === 2) {
    return "md:grid-cols-2";
  }

  return "md:grid-cols-3";
}

function LatestPostCard({
  index,
  locale,
  post,
}: {
  readonly index: number;
  readonly locale: SupportedLocale;
  readonly post: Post;
}) {
  return (
    <article
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 70)}
      className="flex min-h-44 flex-col bg-background p-4 transition hover:bg-muted/35"
    >
      <div className="flex items-start justify-between gap-3">
        <time dateTime={post.publishedAt} className="text-xs font-medium text-muted-foreground">
          {formatDate(post.publishedAt, locale)}
        </time>
        <PostBadges post={post} />
      </div>
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="group mt-5 block">
        <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-balance group-hover:text-link">
          {post.title}
        </h3>
      </Link>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
    </article>
  );
}

function HomeMotionController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-home-surface]");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-home-reveal]"));

    const reveal = (element: HTMLElement) => {
      element.dataset.homeReveal = "visible";
    };

    const isInView = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();

      return rect.top < window.innerHeight * 0.96 && rect.bottom > 0;
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(reveal);
      return;
    }

    elements.filter(isInView).forEach(reveal);
    root?.setAttribute("data-home-motion-ready", "true");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    elements
      .filter((element) => element.dataset.homeReveal !== "visible")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}

function getRevealStyle(delayMs: number): HomeRevealStyle {
  return {
    "--home-reveal-delay": `${delayMs}ms`,
  };
}

function FreeHighlightCard({
  index,
  item,
}: {
  readonly index: number;
  readonly item: FreeHighlight;
}) {
  const Icon = item.icon;
  return (
    <div
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 70)}
      className="bg-background px-6 py-7"
    >
      <span
        data-home-icon
        className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground"
      >
        <Icon className="size-5" />
      </span>
      <p className="mt-5 text-lg font-semibold">{item.label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
    </div>
  );
}

function SetupPathCard({
  href,
  index,
  path,
}: {
  readonly href: string;
  readonly index: number;
  readonly path: SetupPath;
}) {
  const Icon = path.icon;

  return (
    <a
      href={href}
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 70)}
      className="group bg-background p-5 transition hover:bg-muted/35"
    >
      <span
        data-home-icon
        className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span className="mt-5 block text-lg font-semibold group-hover:text-link">{path.title}</span>
      <span className="mt-2 block text-sm leading-6 text-muted-foreground">{path.description}</span>
      <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-link">
        {path.cta}
        <ArrowRightIcon className="size-4" />
      </span>
    </a>
  );
}

function OwnershipRow({
  index,
  point,
}: {
  readonly index: number;
  readonly point: { title: string; description: string; icon: LucideIcon };
}) {
  const Icon = point.icon;
  return (
    <article
      data-home-reveal
      data-home-row
      style={getRevealStyle(index * 55)}
      className="grid gap-4 py-5 sm:grid-cols-[48px_minmax(0,1fr)]"
    >
      <span
        data-home-icon
        className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-lg font-semibold">{point.title}</span>
        <span className="mt-2 block text-sm leading-6 text-muted-foreground">
          {point.description}
        </span>
      </span>
    </article>
  );
}

function FeatureRow({ feature, index }: { readonly feature: FeatureItem; readonly index: number }) {
  const Icon = feature.icon;

  return (
    <article
      data-home-reveal
      data-home-row
      style={getRevealStyle(index * 45)}
      className="grid gap-4 py-5 sm:grid-cols-[48px_minmax(0,1fr)]"
    >
      <span
        data-home-icon
        className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground"
      >
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-lg font-semibold">{feature.title}</span>
        <span className="mt-2 block text-sm leading-6 text-muted-foreground">
          {feature.description}
        </span>
      </span>
    </article>
  );
}

function QuotaRow({
  index,
  item,
}: {
  readonly index: number;
  readonly item: { service: string; quota: string; note: string };
}) {
  return (
    <div
      data-home-reveal
      data-home-row
      style={getRevealStyle(index * 45)}
      className="grid gap-2 py-4 sm:grid-cols-[160px_minmax(0,1fr)]"
    >
      <span className="text-sm font-semibold">{item.service}</span>
      <span>
        <span className="block text-sm font-semibold text-link">{item.quota}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.note}</span>
      </span>
    </div>
  );
}

function ProductBadgeCard({
  index,
  item,
}: {
  readonly index: number;
  readonly item: ProductBadge;
}) {
  const Icon = item.icon;
  return (
    <div
      data-home-reveal
      data-home-card
      style={getRevealStyle(index * 45)}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background px-3 py-5 text-center"
    >
      <Icon className="size-7 shrink-0" />
      <span className="text-xs leading-tight font-semibold">{item.name}</span>
      <span className="text-xs text-muted-foreground">{item.label}</span>
    </div>
  );
}

function PostBadges({ post }: { readonly post: Post }) {
  if (!post.pinned && !post.featured) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {post.pinned ? (
        <span className="rounded-sm bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {m.pinned()}
        </span>
      ) : null}
      {post.featured ? (
        <span className="rounded-sm bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          {m.featured()}
        </span>
      ) : null}
    </div>
  );
}

function isReaderFacingPost(post: { title: string; slug: string }) {
  const normalized = `${post.title} ${post.slug}`.toLowerCase();

  return !["e2e comment flow", "smoke post", "e2e edit smoke"].some((marker) =>
    normalized.includes(marker),
  );
}

type ContactSpotlight = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly cta: string;
  readonly icon: LucideIcon;
};

function getHomeCopy(locale: SupportedLocale) {
  const productBadges: ProductBadge[] = [
    {
      name: "S3000A / S3010A",
      label: locale === "zh" ? "立式插件机" : "Radial insertion",
      icon: CogIcon,
    },
    {
      name: "S7020 / S7020T",
      label: locale === "zh" ? "PIN眼/端子插装" : "Pin, eyelet & terminal",
      icon: LayersIcon,
    },
    {
      name: "S7900",
      label: locale === "zh" ? "异形件插装" : "Odd-form inserter",
      icon: PackageIcon,
    },
    {
      name: "STF1003",
      label: locale === "zh" ? "管式飞达" : "Tube feeder",
      icon: CheckIcon,
    },
    {
      name: "SUL460",
      label: locale === "zh" ? "起盘机" : "Magazine unloader",
      icon: TruckIcon,
    },
    {
      name: "SAGV / SFY03",
      label: locale === "zh" ? "AGV 自动转运" : "AGV transport",
      icon: PlayIcon,
    },
    {
      name: "S-WS series",
      label: locale === "zh" ? "波峰焊与钛爪" : "Wave solder & fingers",
      icon: FlameIcon,
    },
    {
      name: "S-1688 / SME",
      label: locale === "zh" ? "钢网与治具清洗" : "Stencil & pallet cleaning",
      icon: SprayCanIcon,
    },
  ];

  if (locale === "zh") {
    return {
      eyebrow: "Jason Wu · 南部机械（深圳，2011 年至今）",
      heroTitle: "贴片机早已自动化，你的通孔线为什么还在靠人手？",
      heroBody:
        "我在 SMT/THT 设备行业做了 30 多年。这个站点的任务只有一个：把立式、异形件、PIN 眼端子的自动插装，从「以后再说」变成你下个月的排产计划。看视频、读现场笔记，或者直接把你的 PCB 文件发给我。",
      primaryCta: "WhatsApp 约 15 分钟产线评估",
      secondaryCta: "读产线笔记",
      trustLine:
        "设备与服务已交付给为 Signify、Flex、Schneider Electric、Kimball International、Fideltronik 等品牌生产的 EMS 工厂。",
      heroImageAlt: "S3020A/S7020/S7040 轴立式端子异形件混合插装在线产线（带 loader）",

      contentEyebrow: "博客",
      contentTitle: "最新文章",

      // ── Diagnosis ──
      diagnosisEyebrow: "诊断",
      diagnosisTitle: "通孔产线在悄悄烧钱的五个信号。",
      diagnosisBody:
        "手工插件区看上去安静有序，恰恰是最贵的那种安静——错件、产能天花板和工资上涨同时发生，只是没人给你发账单。",
      diagnosisPoints: [
        {
          icon: LayersIcon,
          title: "一块板 10 个以上插装点",
          description: "每个工位每天重复上千次同样的捏取动作——这正是机器最擅长的那部分。",
        },
        {
          icon: CheckIcon,
          title: "极性靠老师傅的记性",
          description: "反插的电容逃过目检、死在 ICT 或客户端，单颗返工成本是插件工位日薪的十倍。",
        },
        {
          icon: TruckIcon,
          title: "旺季只能加人，加人却不增产",
          description: "手工工位的产能天花板由手速决定；自动插装的天花板由飞达速度决定。",
        },
        {
          icon: CogIcon,
          title: "每款新品都要重新培训",
          description: "换型靠人带人；编带与飞达换型只要几分钟，而且不会忘记。",
        },
        {
          icon: WrenchIcon,
          title: "备件被供应商牵着走",
          description: "飞达、吸嘴、钛爪等易损件没有兼容替代与本地响应，停机就是纯损失。",
        },
      ],

      // ── Pillars ──
      pillarsEyebrow: "为什么记住我",
      pillarsTitle: "三个标签，一个 Jason Wu。",
      pillarsBody: "算法和工程师需要同时记住我，所以我不做面面俱的人设，只做三件可验证的事。",
      pillars: [
        {
          title: "专业能力：SMT/THT 组装自动化",
          description:
            "专注 PCB 组装自动化设备方案——立式、异形件、PIN 眼端子插装，波峰焊与周边转运，从单机到整线。",
          icon: CogIcon,
        },
        {
          title: "通用品质：勤奋、热爱、真诚、技术底子",
          description:
            "30 多年从产线装机调试做起，参数只报真实值；写下来的每一篇笔记都来自真实项目。",
          icon: CheckIcon,
        },
        {
          title: "全球 EMS 的实战语境",
          description:
            "客户横跨北美、欧洲、拉美与东南亚，不同安全法规、不同用工成本，同一套工程方法。",
          icon: GlobeIcon,
        },
      ],

      // ── Scenes ──
      scenesEyebrow: "工作场景",
      scenesTitle: "你在什么场合见到我？",
      scenesBody: "四个固定场景，覆盖从选型到量产的整个生命周期。",
      scenesCta: "订阅 YouTube 直播",
      scenesPoints: [
        {
          title: "现场售后服务",
          description: "装机、调试、培训、排障——我本人常年在客户产线上，不只是工程师去。",
          icon: WrenchIcon,
        },
        {
          title: "远程技术指导",
          description: "WhatsApp/TeamViewer 在线支持，备件与参数问题当天给结论。",
          icon: MessageCircleIcon,
        },
        {
          title: "视频会议",
          description: "15 分钟产线评估电话开始，PCB 文件与元件清单投屏过一遍。",
          icon: VideoIcon,
        },
        {
          title: "售前方案评估",
          description: "用你的元件在我们的机器上跑演示直播，附 ROI 评估报告。",
          icon: PlayIcon,
        },
      ],

      // ── Framework ─
      frameworkEyebrow: "方法论",
      frameworkTitle: "从手工到自动，五步走，不跳步。",
      frameworkBody:
        "这套流程我在几十个 EMS 项目里反复用过：先算账，再看料，后看机。任何一步答不上来，就说明还不到买设备的阶段。",
      setupPaths: [
        {
          title: "看你的元件跑直播演示",
          description: "把 PCB 文件和元件样品寄给我们，YouTube 直播上机跑给你看，附评估报告。",
          cta: "WhatsApp 预约",
          href: WHATSAPP_URL,
          icon: PlayIcon,
        },
        {
          title: "下载可行性检查表",
          description: "先自查插装点、极性与换型数据，10 分钟知道该不该自动化。",
          cta: "获取检查表",
          href: "https://file.autoinsertion.com/public/Blog%20file/auto-insertion-readiness-checklist.pdf",
          icon: FileTextIcon,
        },
      ],
      frameworkSteps: [
        {
          number: "01",
          title: "盘点插装工序",
          description: "列出每块板的插装点、元件形态（编带/散装/管装）与现有节拍。",
        },
        {
          number: "02",
          title: "算清人工与逃逸成本",
          description: "插点数 × 板数 × 工资，加上错件返工成本——这是自动化的分母。",
        },
        {
          number: "03",
          title: "用你的元件做样机演示",
          description: "寄样上机，直播验证速度、极性与打弯质量，不拿别人的板子糊弄你。",
        },
        {
          number: "04",
          title: "出评估报告与 ROI",
          description: "CPH、精度、占地、回本周期写成一页纸，你拿去说服厂长和财务。",
        },
        {
          number: "05",
          title: "单台试点，再扩到整线",
          description: "先上一台插件机验证 90 天，跑通后再串起多工位与波峰焊联动。",
        },
      ],

      // ── Free / Vehicle ──
      freeEyebrow: "免费动作",
      freeTitle: "先免费看演示，再谈买设备。",
      freeBody:
        "我把售前动作标准化成了免费产品：直播演示 + 评估报告。你付出的只有寄样品的运费，得到的是一份可以自己复用的判断依据。",
      freeHighlights: [
        {
          icon: PlayIcon,
          label: "Demo 直播",
          body: "你的元件在我们的插件机上跑，YouTube 直播或闭门会议任选，全程录像。",
        },
        {
          icon: FileTextIcon,
          label: "评估报告",
          body: "速度、精度、极性验证、换型时间与 ROI 测算，一页纸交付。",
        },
        {
          icon: CheckIcon,
          label: "选型建议",
          body: "即使最后你决定不买自动插件机，报告也会写明为什么——这条规则从没破过。",
        },
      ],
      commitments: [
        {
          service: "询盘响应",
          quota: "2 小时内",
          note: "工作时间内邮件与 WhatsApp 同标准。",
        },
        {
          service: "初步方案与报价",
          quota: "当天给出",
          note: "基于你提供的 PCB 与元件清单。",
        },
        {
          service: "问题解决方案",
          quota: "3 天内",
          note: "现场或远程排障后跟踪到关闭。",
        },
        {
          service: "备件与技术支持",
          quota: "全球发货",
          note: "飞达、吸嘴、钛爪等易损件常备库存。",
        },
      ],

      // ── Products ──
      productsEyebrow: "产品线",
      productsTitle: "记住这些型号，就像记住同事的名字。",
      productBadges,

      // ── Contact ──
      contactEyebrow: "下一步",
      contactTitle: "把你的 PCB 文件发过来。",
      contactBody:
        "15 分钟视频评估，或者直接寄样品。回复邮件时请附上板子尺寸、插装点数量与元件形态，方案会更有把握。",
      contactPrimaryCta: "WhatsApp 联系",
      contactSecondaryCta: "info@smthelp.com",
      contactSpotlights: [
        {
          title: "LinkedIn",
          description: "每天一条产线现场与行业思考，欢迎工程师互关。",
          href: "https://cn.linkedin.com/in/smtsupplier",
          cta: "加好友",
          icon: FileTextIcon,
        },
        {
          title: "YouTube · Smthelping",
          description: "设备演示、直播答疑与安装教程都在这条频道。",
          href: "https://www.youtube.com/c/Smthelping",
          cta: "订阅",
          icon: PlayIcon,
        },
        {
          title: "目录与手册库",
          description: "file.autoinsertion.com 全站目录、手册与实拍图。",
          href: "https://file.autoinsertion.com",
          cta: "浏览",
          icon: LayersIcon,
        },
      ] satisfies ContactSpotlight[],
    };
  }

  // ── English ─
  return {
    eyebrow: "Jason Wu · Southern Machinery, Shenzhen — since 2011",
    heroTitle: "Your SMT line is automated. Your through-hole line still runs on hands.",
    heroBody:
      'I have spent 30+ years on SMT/THT equipment. This site has one job: turn radial, odd-form, and pin/eyelet auto insertion from "someday" into next month\'s production plan. Watch the machines, read the field notes, or send me your PCB file.',
    primaryCta: "Book a 15-min line review",
    secondaryCta: "Read the field notes",
    trustLine:
      "Equipment and support delivered to EMS plants producing for Signify, Flex, Schneider Electric, Kimball International, and Fideltronik.",
    heroImageAlt:
      "S4040A/S3020A/S7020/S7040 axial, radial, terminal and odd-form insertion inline line with loader",

    contentEyebrow: "Blog",
    contentTitle: "Latest posts",

    // ── Diagnosis ──
    diagnosisEyebrow: "Diagnosis",
    diagnosisTitle: "Five signs your through-hole line is quietly burning money.",
    diagnosisBody:
      "A manual insertion area looks calm. That is the expensive kind of calm — escapes, capacity ceilings, and wage inflation happening at the same time, with nobody sending you the invoice.",
    diagnosisPoints: [
      {
        icon: LayersIcon,
        title: "10+ insertion points per board",
        description:
          "Each station repeats the same pinch-and-place thousands of times a shift — exactly the motion a machine was built for.",
      },
      {
        icon: CheckIcon,
        title: "Polarity lives in veterans' memory",
        description:
          "One reversed capacitor that survives visual inspection and dies at ICT or at the customer costs far more than an inserter's daily wage.",
      },
      {
        icon: TruckIcon,
        title: "Peak season means hiring, not throughput",
        description:
          "Manual capacity is capped by hands. Automated capacity is capped by feeder speed — a much higher ceiling.",
      },
      {
        icon: CogIcon,
        title: "Every new product retrains every hand",
        description:
          "Changeover by memory is fragile. Taped components and feeders change over in minutes and never forget.",
      },
      {
        icon: WrenchIcon,
        title: "Spare parts held hostage",
        description:
          "Feeders, nozzles, and wave-soldering fingers without compatible alternatives and fast support turn downtime into pure loss.",
      },
    ],

    // ── Pillars ──
    pillarsEyebrow: "Why remember me",
    pillarsTitle: "Three tags, one Jason Wu.",
    pillarsBody:
      "Algorithms and engineers both need a reason to remember you. So no all-purpose persona — just three verifiable things.",
    pillars: [
      {
        title: "Expertise: SMT & THT assembly automation",
        description:
          "PCB assembly automation solutions — radial, odd-form, pin/eyelet/terminal insertion, wave soldering and board handling, from single machines to full lines.",
        icon: CogIcon,
      },
      {
        title: "Character: diligent, passionate, sincere, deeply technical",
        description:
          "Thirty years starting from machine installation and commissioning on real floors. Specs are reported as measured, and every note here comes from a real project.",
        icon: CheckIcon,
      },
      {
        title: "Context: global EMS reality",
        description:
          "Customers across North America, Europe, Latin America, and Southeast Asia — different safety regulations, different labor costs, one engineering method.",
        icon: GlobeIcon,
      },
    ],

    // ── Scenes ──
    scenesEyebrow: "Where you meet me",
    scenesTitle: "Four scenes, from selection to production.",
    scenesBody:
      "The same person who quotes your machine also stands on your floor when it arrives.",
    scenesCta: "Subscribe on YouTube",
    scenesPoints: [
      {
        title: "On-site after-sales service",
        description:
          "Installation, commissioning, training, troubleshooting — I am on customer lines myself, not just sending an engineer.",
        icon: WrenchIcon,
      },
      {
        title: "Remote technical guidance",
        description:
          "WhatsApp and remote-desktop support; spare-part and parameter questions get an answer the same day.",
        icon: MessageCircleIcon,
      },
      {
        title: "Video conferences",
        description:
          "Start with a 15-minute line review — your PCB file and component list on screen, my notes beside it.",
        icon: VideoIcon,
      },
      {
        title: "Pre-sales solution evaluation",
        description:
          "Your components, our machines, live on camera — plus a written evaluation report with ROI.",
        icon: PlayIcon,
      },
    ],

    // ── Framework ─
    frameworkEyebrow: "The method",
    frameworkTitle: "Manual to automated in five steps. No skipping.",
    frameworkBody:
      "I have run this loop on dozens of EMS projects: count first, then inspect parts, then look at machines. If any step cannot be answered, you are not ready to buy equipment yet — and I will say so.",
    setupPaths: [
      {
        title: "Watch your components run live",
        description:
          "Send the PCB file and component samples. We run them on camera on YouTube or in a private session, with an evaluation report.",
        cta: "Book on WhatsApp",
        href: WHATSAPP_URL,
        icon: PlayIcon,
      },
      {
        title: "Download the readiness checklist",
        description:
          "Self-check insertion points, polarity, and changeover data — know in 10 minutes whether automation makes sense.",
        cta: "Get the checklist",
        href: "https://file.autoinsertion.com/public/Blog%20file/auto-insertion-readiness-checklist.pdf",
        icon: FileTextIcon,
      },
    ],
    frameworkSteps: [
      {
        number: "01",
        title: "Map the insertion steps",
        description:
          "List insertion points per board, component formats (taped, bulk, tube), and current takt time.",
      },
      {
        number: "02",
        title: "Count labor and escape cost",
        description:
          "Insertion moves x boards x wages, plus rework from wrong parts — that is the denominator of automation.",
      },
      {
        number: "03",
        title: "Demo with YOUR components",
        description:
          "Samples on our machines, verified on camera for speed, polarity, and clinch quality. No stock videos of other people's boards.",
      },
      {
        number: "04",
        title: "Evaluation report and ROI",
        description:
          "CPH, accuracy, footprint, and payback window on one page — the page you take to your plant manager and finance.",
      },
      {
        number: "05",
        title: "Pilot one machine, then scale",
        description:
          "Run one inserter for 90 days, prove it, then extend into multi-station lines with wave soldering handoff.",
      },
    ],

    // ── Free / Vehicle ──
    freeEyebrow: "Free by design",
    freeTitle: "See the demo first. Buy the machine later.",
    freeBody:
      "I turned my pre-sales motion into a free product: live demo plus evaluation report. You pay only the shipping of your samples; you keep a judgment you can reuse — with or without buying from me.",
    freeHighlights: [
      {
        icon: PlayIcon,
        label: "Live demo",
        body: "Your components run on our insertion machines, streamed on YouTube or in a closed session, fully recorded.",
      },
      {
        icon: FileTextIcon,
        label: "Evaluation report",
        body: "Speed, accuracy, polarity verification, changeover time, and ROI math — delivered on one page.",
      },
      {
        icon: CheckIcon,
        label: "Honest selection advice",
        body: 'Even when the answer is "stay manual for now", the report says so. That rule has never been broken.',
      },
    ],
    commitments: [
      {
        service: "Inquiry reply",
        quota: "Within 2 hours",
        note: "Same standard for email and WhatsApp during working hours.",
      },
      {
        service: "First proposal & quote",
        quota: "Same day",
        note: "Based on the PCB and component list you provide.",
      },
      {
        service: "Problem resolution plan",
        quota: "Within 3 days",
        note: "On-site or remote, tracked until closed.",
      },
      {
        service: "Spare parts & support",
        quota: "Ships worldwide",
        note: "Feeders, nozzles, wave soldering fingers and other consumables in stock.",
      },
    ],

    // ── Products ──
    productsEyebrow: "Product lines",
    productsTitle: "Know the model numbers like colleagues' names.",
    productBadges,

    // ── Contact ──
    contactEyebrow: "Next step",
    contactTitle: "Send me your PCB file.",
    contactBody:
      "A 15-minute video review, or ship the samples. When you write, include board size, insertion points per board, and component formats — the proposal gets sharper with every number.",
    contactPrimaryCta: "Chat on WhatsApp",
    contactSecondaryCta: "info@smthelp.com",
    contactSpotlights: [
      {
        title: "LinkedIn",
        description: "A daily note from the line — engineers welcome to connect.",
        href: "https://cn.linkedin.com/in/smtsupplier",
        cta: "Connect",
        icon: FileTextIcon,
      },
      {
        title: "YouTube · Smthelping",
        description: "Machine demos, live Q&A, and installation guides.",
        href: "https://www.youtube.com/c/Smthelping",
        cta: "Subscribe",
        icon: PlayIcon,
      },
      {
        title: "Catalog & manuals library",
        description: "Every catalog, manual, and real machine photo at file.autoinsertion.com.",
        href: "https://file.autoinsertion.com",
        cta: "Browse",
        icon: LayersIcon,
      },
    ] satisfies ContactSpotlight[],
  };
}
