import { cn } from "@repo/ui/lib/utils";
import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

import type { MetricBasis, ProjectCase } from "#/lib/project-cases";

type ProjectCaseCardProps = {
  readonly projectCase: ProjectCase;
};

const STATUS_TONE: Record<ProjectCase["statusTone"], string> = {
  done: "border-link/35 bg-link/10 text-link",
  part: "border-border bg-muted text-foreground",
  open: "border-border bg-muted/50 text-muted-foreground",
};

const BASIS_TONE: Record<MetricBasis, string> = {
  "Delivery record": "text-muted-foreground",
  Measured: "text-link",
  Specification: "text-muted-foreground",
};

export function ProjectCaseCard({ projectCase }: ProjectCaseCardProps) {
  const [failedImage, setFailedImage] = useState(false);

  const facts = [
    { label: "Region", value: projectCase.region },
    { label: "Industry", value: projectCase.industry },
    { label: "Recorded window", value: projectCase.recordedWindow },
    { label: "Team", value: projectCase.team },
  ];

  const narrative = [
    { heading: "Project background", body: projectCase.background },
    { heading: "The challenge", body: projectCase.challenge },
    { heading: "Our solution", body: projectCase.solution },
    { heading: "Implementation and results", body: projectCase.implementation },
  ];

  const showImage = projectCase.image && !failedImage;

  return (
    <article id={projectCase.id} className="scroll-mt-24 bg-background p-5 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="mt-0.5 text-2xl font-semibold text-muted-foreground/50 tabular-nums">
          {projectCase.num}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl leading-snug font-semibold text-balance">{projectCase.title}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="border border-border bg-muted/45 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {projectCase.region}
            </span>
            <span className="border border-border bg-muted/45 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {projectCase.industry}
            </span>
            <span
              className={cn(
                "border px-2 py-0.5 text-xs font-semibold",
                STATUS_TONE[projectCase.statusTone],
              )}
            >
              {projectCase.status}
            </span>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {fact.label}
            </dt>
            <dd className="mt-0.5 text-sm leading-6 font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>

      {showImage ? (
        <figure className="mt-5">
          <img
            src={projectCase.image?.src}
            alt={projectCase.image?.alt ?? ""}
            loading="lazy"
            decoding="async"
            onError={() => setFailedImage(true)}
            className="w-full border border-border object-cover"
          />
          <figcaption className="mt-2 text-xs leading-5 text-muted-foreground">
            Image from the Southern Machinery product library.
            {projectCase.image?.sourcePage ? (
              <>
                {" "}
                <a
                  href={projectCase.image.sourcePage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-link hover:underline"
                >
                  Source page
                  <ExternalLinkIcon className="size-3" />
                </a>
              </>
            ) : null}
          </figcaption>
        </figure>
      ) : null}

      <div className="mt-5">
        <h4 className="text-xs font-semibold tracking-wide text-link uppercase">Customer profile</h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{projectCase.profile}</p>
      </div>

      <div className="mt-5 grid gap-4">
        {narrative.map((block) => (
          <div key={block.heading}>
            <h4 className="text-base font-semibold">{block.heading}</h4>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{block.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
        {projectCase.metrics.map((metric) => (
          <div key={`${metric.value}-${metric.label}`} className="bg-background p-3">
            <span className="block text-xl leading-tight font-semibold">{metric.value}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {metric.label}
            </span>
            <span
              className={cn(
                "mt-1 block text-[11px] font-semibold tracking-wide uppercase",
                BASIS_TONE[metric.basis],
              )}
            >
              {metric.basis}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-semibold tracking-wide text-link uppercase">
          Customer benefits
        </h4>
        <ul className="mt-2 grid gap-1.5">
          {projectCase.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-link" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <details className="group mt-5 border-t border-border pt-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-link hover:underline [&::-webkit-details-marker]:hidden">
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
          />
          Project timeline ({projectCase.timeline.length} recorded milestones)
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <tbody>
              {projectCase.timeline.map((milestone, index) => (
                <tr key={`${milestone.date}-${index}`} className="border-t border-border">
                  <th
                    scope="row"
                    className="w-2/5 min-w-32 py-2 pr-4 align-top text-xs font-semibold whitespace-nowrap"
                  >
                    {milestone.date}
                  </th>
                  <td className="py-2 align-top text-sm leading-6 text-muted-foreground">
                    {milestone.event}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        <span className="font-semibold text-foreground">Evidence basis.</span>{" "}
        {projectCase.evidence}
      </p>
    </article>
  );
}
