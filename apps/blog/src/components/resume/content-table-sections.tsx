import { ContentTable, ContentTableColumn } from "@orangec-at/design";
import { ResumeSection } from "./resume-section";

interface ResumeExperienceItem {
  company: string;
  role: string;
  period: string;
  summary?: string;
  achievements?: string[];
  techStack?: string[];
}

interface ResumeProjectItem {
  name: string;
  period: string;
  role: string;
  context?: string;
  summary?: string;
  achievements?: string[];
  techStack?: string[];
  linkLabel?: string;
  linkUrl?: string;
}

interface ResumeEducationItem {
  school: string;
  period: string;
  major?: string;
  note?: string;
}

interface ResumeExperienceContentTableProps {
  title?: string;
  data: ResumeExperienceItem[];
}

interface ResumeProjectContentTableProps {
  title?: string;
  data: ResumeProjectItem[];
}

interface ResumeEducationContentTableProps {
  title?: string;
  data: ResumeEducationItem[];
}

function TechStack({ stack }: { stack?: string[] }) {
  if (!stack?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
      {stack.map((item) => (
        <span
          key={item}
          className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const experienceColumns: ContentTableColumn<ResumeExperienceItem>[] = [
  {
    key: "period",
    header: "기간",
    width: "w-1/5",
    align: "left",
    render: (value) => <span className="font-semibold">{value}</span>,
  },
  {
    key: "company",
    header: "소속 / 역할",
    width: "w-1/4",
    align: "left",
    render: (_, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {row.company}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{row.role}</p>
      </div>
    ),
  },
  {
    key: "achievements",
    header: "주요 내용",
    width: "w-2/4",
    align: "left",
    render: (value, row) => (
      <div className="space-y-2">
        {row.summary ? (
          <p className="leading-relaxed text-gray-900 dark:text-gray-100">
            {row.summary}
          </p>
        ) : null}
        {value?.length ? (
          <ul className="list-disc space-y-1 pl-4 text-gray-900 dark:text-gray-100">
            {value.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <TechStack stack={row.techStack} />
      </div>
    ),
  },
];

const projectColumns: ContentTableColumn<ResumeProjectItem>[] = [
  {
    key: "period",
    header: "기간 / 역할",
    width: "w-1/5",
    align: "left",
    render: (value, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {value}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{row.role}</p>
      </div>
    ),
  },
  {
    key: "name",
    header: "프로젝트",
    width: "w-1/4",
    align: "left",
    render: (_, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {row.name}
        </p>
        {row.context ? (
          <p className="text-xs text-gray-600 dark:text-gray-300">
            {row.context}
          </p>
        ) : null}
        {row.linkUrl ? (
          <a
            href={row.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 underline dark:text-blue-400"
          >
            {row.linkLabel ?? row.linkUrl}
          </a>
        ) : null}
      </div>
    ),
  },
  {
    key: "achievements",
    header: "주요 성과",
    width: "w-7/12",
    align: "left",
    render: (value, row) => (
      <div className="space-y-2">
        {row.summary ? (
          <p className="leading-relaxed text-gray-900 dark:text-gray-100">
            {row.summary}
          </p>
        ) : null}
        {value?.length ? (
          <ul className="list-disc space-y-1 pl-4 text-gray-900 dark:text-gray-100">
            {value.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <TechStack stack={row.techStack} />
      </div>
    ),
  },
];

const educationColumns: ContentTableColumn<ResumeEducationItem>[] = [
  {
    key: "period",
    header: "기간",
    width: "w-1/5",
    align: "left",
    render: (value) => <span className="font-semibold">{value}</span>,
  },
  {
    key: "school",
    header: "학교 / 과정",
    width: "w-2/5",
    align: "left",
    render: (_, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-gray-900 dark:text-gray-100">
          {row.school}
        </p>
        {row.major ? (
          <p className="text-xs text-gray-600 dark:text-gray-300">{row.major}</p>
        ) : null}
      </div>
    ),
  },
  {
    key: "note",
    header: "비고",
    width: "w-2/5",
    align: "left",
    render: (value) => (
      <p className="leading-relaxed text-gray-900 dark:text-gray-100">
        {value ?? "-"}
      </p>
    ),
  },
];

export function ResumeExperienceContentTable({
  data,
  title = "주요 경력",
}: ResumeExperienceContentTableProps) {
  return (
    <ResumeSection title={title}>
      <ContentTable
        columns={experienceColumns}
        data={data}
        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      />
    </ResumeSection>
  );
}

export function ResumeProjectContentTable({
  data,
  title = "주요 프로젝트",
}: ResumeProjectContentTableProps) {
  return (
    <ResumeSection title={title}>
      <ContentTable
        columns={projectColumns}
        data={data}
        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      />
    </ResumeSection>
  );
}

export function ResumeEducationContentTable({
  data,
  title = "학력",
}: ResumeEducationContentTableProps) {
  return (
    <ResumeSection title={title}>
      <ContentTable
        columns={educationColumns}
        data={data}
        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      />
    </ResumeSection>
  );
}
