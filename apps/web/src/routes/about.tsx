import { localizeSiteSettings } from "@repo/core";
import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  ExternalLinkIcon,
  MailIcon,
  MessageCircleIcon,
  WrenchIcon,
} from "lucide-react";

import { ProjectCaseCard } from "#/components/project-case-card";
import { SiteShell } from "#/components/site-shell";
import { $getAboutPageData } from "#/lib/cms-server";
import { getCurrentLocale } from "#/lib/i18n";
import { PROJECT_CASES } from "#/lib/project-cases";

export const Route = createFileRoute("/about")({
  loader: () => $getAboutPageData(),
  head: () => {
    const locale = getCurrentLocale();

    return {
      meta: [
        {
          title:
            locale === "zh" ? "关于 Jason Wu · 南部机械" : "About Jason Wu · Southern Machinery",
        },
        {
          name: "description",
          content:
            locale === "zh"
              ? "Jason Wu，南部机械创始人兼 CEO，30 余年 SMT/THT 组装自动化经验，帮助全球 EMS 工厂把通孔插装变成机器活。"
              : "Jason Wu is founder & CEO of Southern Machinery, with 30+ years in SMT/THT assembly automation, helping EMS factories worldwide move through-hole insertion from hands to machines.",
        },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const data = Route.useLoaderData();
  const locale = getCurrentLocale();
  const siteSettings = localizeSiteSettings(data.siteSettings, locale);
  const copy = getAboutCopy(locale);

  return (
    <SiteShell siteSettings={siteSettings}>
      <div className="bg-background">
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-semibold tracking-wide text-link uppercase">
                {copy.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-semibold text-balance sm:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {copy.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  render={<a href="https://wa.me/8613602562576" aria-label={copy.primaryAction} />}
                  nativeButton={false}
                >
                  <MessageCircleIcon />
                  {copy.primaryAction}
                  <ArrowRightIcon />
                </Button>
                <Button
                  render={<a href="mailto:info@smthelp.com" aria-label={copy.secondaryAction} />}
                  variant="outline"
                  nativeButton={false}
                >
                  {copy.secondaryAction}
                  <ExternalLinkIcon />
                </Button>
              </div>
            </div>

            <aside className="border border-border bg-muted/35 p-5">
              <img
                src="/images/jason-wu-avatar.svg"
                alt="Jason Wu"
                className="aspect-square w-full object-cover"
              />
              <div className="mt-5">
                <p className="text-sm font-semibold text-link uppercase">Jason Wu</p>
                <p className="mt-2 text-2xl font-semibold">{copy.profileTitle}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.profileBody}</p>
                <img
                  src="/images/southern-machinery-logo.png"
                  alt="Southern Machinery"
                  className="mt-5 h-8 w-auto"
                  loading="lazy"
                />
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-border bg-muted/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.36fr_0.64fr] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-semibold text-link uppercase">{copy.whyEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold text-balance">{copy.whyTitle}</h2>
            </div>
            <div className="grid gap-4">
              {copy.principles.map((principle) => (
                <article key={principle.title} className="border-t border-border pt-4">
                  <div className="flex items-start gap-3">
                    <WrenchIcon className="mt-1 size-4 shrink-0 text-link" />
                    <div>
                      <h3 className="text-xl font-semibold">{principle.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-semibold text-link uppercase">{copy.timelineEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-balance">{copy.timelineTitle}</h2>
            <ol className="mt-8 divide-y divide-border border-y border-border">
              {copy.timeline.map((entry, index) => (
                <li key={entry.year} className="grid gap-2 py-5 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <span className="text-sm font-semibold text-muted-foreground">{entry.year}</span>
                  <span>
                    <span className="block text-lg font-semibold">{entry.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {entry.description}
                    </span>
                  </span>
                  {index === copy.timeline.length - 1 ? null : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border bg-muted/35">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-semibold text-link uppercase">{copy.casesEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-balance">{copy.casesTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {copy.casesBody}
            </p>
            <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
              {copy.cases.map((item) => (
                <article key={item.client} className="bg-background p-6">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {item.kind}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{item.client}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <p className="mt-4 inline-flex items-center gap-2 border-t border-border pt-3 text-sm font-semibold text-link">
                    {item.result}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-sm font-semibold text-link uppercase">{copy.recordsEyebrow}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {copy.recordsBody}
              </p>
              <div className="mt-6 grid gap-px border border-border bg-border">
                {PROJECT_CASES.map((item) => (
                  <ProjectCaseCard key={item.id} projectCase={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-px border border-border bg-border md:grid-cols-3">
              {copy.paths.map((path) => (
                <a
                  key={path.href}
                  href={path.href}
                  className="bg-background p-5 transition hover:bg-muted/45"
                >
                  <p className="text-xs font-semibold tracking-wide text-link uppercase">
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{path.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.description}</p>
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <a
                href="mailto:info@smthelp.com"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-link hover:underline"
              >
                <MailIcon className="size-4" />
                info@smthelp.com
              </a>
              <a
                href="https://wa.me/8613602562576"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-link hover:underline"
              >
                <CalendarCheckIcon className="size-4" />
                WhatsApp +86 13602562576
              </a>
              <a
                href="https://cn.linkedin.com/in/smtsupplier"
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-link hover:underline"
              >
                LinkedIn
                <ExternalLinkIcon className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

function getAboutCopy(locale: ReturnType<typeof getCurrentLocale>) {
  if (locale === "zh") {
    return {
      eyebrow: "关于 Jason Wu",
      title: "把深圳的电子制造经验，变成你产线上的机器。",
      description:
        "我是 Jason Wu，深圳市南部机械销售服务有限公司创始人兼 CEO。从产线装机调试做起，在 SMT/THT 设备行业做了 30 多年；2011 年在深圳宝安创业，专门帮全球 EMS 工厂把通孔插装从人手迁移到机器——立式、异形件、PIN 眼端子，配上波峰焊、备件和自动转运。",
      primaryAction: "WhatsApp 聊 15 分钟",
      secondaryAction: "发邮件 info@smthelp.com",
      profileTitle: "南部机械创始人 & CEO",
      profileBody:
        "30 余年 SMT/THT 设备经验，常驻客户产线。口号从来不是口号：Your Trusted Partner for SMT & THT Solutions。",
      whyEyebrow: "做事方式",
      whyTitle: "我坚持的三件事",
      principles: [
        {
          title: "先懂你的板子，再谈我的机器",
          description:
            "做什么产品、什么元件、多少产量、什么预算——这四个问题没答案，任何推荐都是推销。",
        },
        {
          title: "数字只报实测值",
          description:
            "CPH、精度、节拍、回本周期，都来自你的元件在我们机器上跑出来的演示，不引用宣传峰值。",
        },
        {
          title: "卖出去才是服务的开始",
          description:
            "2 小时回复、当天方案、3 天问题预案；装机、培训、备件跟进，直到设备在你的产线上站稳。",
        },
      ],
      timelineEyebrow: "轨迹",
      timelineTitle: "一条从产线走到全球的路线",
      timeline: [
        {
          year: "1990s",
          title: "从装机与售后做起",
          description: "在电子制造设备行业学习、调试、维修——插件机、波峰焊与周边设备。",
        },
        {
          year: "2011",
          title: "在深圳宝安创立南部机械",
          description:
            "深圳市南部机械销售服务有限公司成立，专注 SMT/THT PCB 组装自动化设备与备件出口。",
        },
        {
          year: "2015+",
          title: "走进东南亚与全球 EMS 工厂",
          description: "为多品种高混产线提供定制飞达、异形件插装与波峰焊周边方案。",
        },
        {
          year: "2020+",
          title: "产品与内容双线推进",
          description:
            "STF1003 管式飞达、SUL460 起盘机、AGV 等新产品落地；YouTube 频道 Smthelping 开始用直播演示代替口头承诺。",
        },
        {
          year: "现在",
          title: "把深圳经验写成公开笔记",
          description:
            "这个博客记录真实项目：NR12 安全改造、免费 demo 直播、从手工到自动的每一步。",
        },
      ],
      casesEyebrow: "精选项目",
      casesTitle: "写在档案里的 22 个项目。",
      casesBody:
        "以下项目与数据发布在我的 LinkedIn 档案（linkedin.com/in/smtsupplier），可向客户与同事核实。",
      recordsEyebrow: "项目实录",
      recordsBody:
        "另有二十份脱敏交付记录，覆盖异形插件、定制飞达、分板、波峰焊耗材、ESD 转运与 AGV 物料周转。客户名称、价格与合同件号一律隐去；每条日期与数字均出自项目系统，并注明其计量依据。记录保留项目系统原文（英文），以免翻译造成规格失真。",
      cases: [
        {
          kind: "THT 自动插件线",
          client: "Foxconn",
          description:
            "为富士康的高产量产线部署了一条先进的 THT 自动插件线，在压缩停机的同时显著提升产出。",
          result: "吞吐量提升 25%，停机时间下降",
        },
        {
          kind: "定制 SMT 方案",
          client: "Jabil",
          description:
            "为 Jabil 定制了一套 SMT 解决方案，针对其高可靠性产品的贴装与工艺链路做专项优化。",
          result: "缺陷率降低 30%",
        },
      ],
      paths: [
        {
          eyebrow: "Blog",
          title: "读产线笔记",
          description: "从诊断到 ROI 的完整方法，都在博客里。",
          href: "/blog",
        },
        {
          eyebrow: "Videos",
          title: "看设备跑起来",
          description: "youtube.com/c/Smthelping——演示、直播与安装教程。",
          href: "https://www.youtube.com/c/Smthelping",
        },
        {
          eyebrow: "Company",
          title: "访问南部机械官网",
          description: "smthelp.com · 目录与手册在 file.autoinsertion.com。",
          href: "https://www.smthelp.com",
        },
      ],
    };
  }

  return {
    eyebrow: "About Jason Wu",
    title: "Turning Shenzhen electronics manufacturing experience into machines on your line.",
    description:
      "I am Jason Wu, founder & CEO of Shenzhen Southern Machinery Sales and Service Co., Ltd. I started on factory floors installing and debugging equipment, spent 30+ years in SMT/THT machinery, and founded the company in Bao'an, Shenzhen in 2011 — with one focus: moving through-hole insertion in EMS factories from hands to machines. Radial, odd-form, pin/eyelet insertion, plus wave soldering, spare parts, and automated material transport.",
    primaryAction: "Chat 15 min on WhatsApp",
    secondaryAction: "Email info@smthelp.com",
    profileTitle: "Founder & CEO, Southern Machinery",
    profileBody:
      "30+ years of SMT/THT equipment work, still regular on customer floors. The tagline is a working rule, not a slogan: Your Trusted Partner for SMT & THT Solutions.",
    whyEyebrow: "How I work",
    whyTitle: "Three rules I do not bend",
    principles: [
      {
        title: "Understand your board before pitching a machine",
        description:
          "What product, which components, what volume, what budget — without these four answers, any recommendation is just selling.",
      },
      {
        title: "Report measured numbers only",
        description:
          "CPH, accuracy, takt, and payback come from running YOUR components on our machines in a demo — not from brochure peaks.",
      },
      {
        title: "The sale is the start of the service",
        description:
          "Reply in 2 hours, first proposal the same day, resolution plan in 3 days — then installation, training, and spare parts until the machine earns its floor space.",
      },
    ],
    timelineEyebrow: "Track record",
    timelineTitle: "A path from the line to the world",
    timeline: [
      {
        year: "1990s",
        title: "Started in installation and after-sales",
        description:
          "Learned, debugged, and repaired insertion machines, wave soldering equipment, and line peripherals.",
      },
      {
        year: "2011",
        title: "Founded Southern Machinery in Bao'an, Shenzhen",
        description:
          "Shenzhen Southern Machinery Sales and Service Co., Ltd. — SMT/THT PCB assembly automation equipment and spare parts for export.",
      },
      {
        year: "2015+",
        title: "Into Southeast Asia and global EMS plants",
        description:
          "Custom feeders, odd-form insertion, and wave soldering peripherals for high-mix production lines.",
      },
      {
        year: "2020+",
        title: "Products and content in parallel",
        description:
          "STF1003 tube feeder, SUL460 magazine unloader, and AGV family shipped; the Smthelping YouTube channel replaced promises with live demos.",
      },
      {
        year: "Now",
        title: "Publishing the field notes",
        description:
          "This blog documents real projects — NR12 safety retrofits, free demo livestreams, and every step from manual to automated.",
      },
    ],
    casesEyebrow: "Selected projects",
    casesTitle: "Twenty-two projects on the record.",
    casesBody:
      "These projects and figures are published on my LinkedIn profile (linkedin.com/in/smtsupplier) — verifiable, not anonymous claims.",
    recordsEyebrow: "Field records",
    recordsBody:
      "Twenty desensitised delivery records covering odd-form insertion, engineered feeders, depanelizing, wave soldering consumables, ESD handling and AGV material handling. Customer names, pricing and contract part numbers are withheld at source; every date and figure comes from the project system, and each metric states what it was recorded against.",
    cases: [
      {
        kind: "THT auto insertion line",
        client: "Foxconn",
        description:
          "We deployed a state-of-the-art THT auto insertion line for Foxconn's high-volume production, lifting output while cutting downtime.",
        result: "+25% throughput, reduced downtime",
      },
      {
        kind: "Customized SMT solution",
        client: "Jabil",
        description:
          "For Jabil we customized an SMT solution targeted at their high-reliability assembly requirements, from placement to process control.",
        result: "-30% defect rates",
      },
    ],
    paths: [
      {
        eyebrow: "Blog",
        title: "Read the field notes",
        description: "The full method, from diagnosis to ROI math, lives on the blog.",
        href: "/blog",
      },
      {
        eyebrow: "Videos",
        title: "Watch the machines run",
        description: "youtube.com/c/Smthelping — demos, livestreams, and install guides.",
        href: "https://www.youtube.com/c/Smthelping",
      },
      {
        eyebrow: "Company",
        title: "Visit smthelp.com",
        description: "Company site; catalogs and manuals at file.autoinsertion.com.",
        href: "https://www.smthelp.com",
      },
    ],
  };
}
