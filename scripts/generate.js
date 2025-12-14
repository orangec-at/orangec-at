#!/usr/bin/env node
/**
 * Minimal generator: JD JSON + profile JSON (+ .env tokens) -> resume/cover drafts.
 * - Loads .env (if exists) to replace {{ENV_*}} tokens in profile.
 * - Scores projects against JD (must/nice/domain/tags/stack) and picks top matches.
 * - Emits Markdown/MDX drafts under apps/blog/documents/resumes|cover-letters.
 *
 * Usage:
 *   node scripts/generate.js --jd data/jd/dunamu-fe.json --profile data/profile/profile.json --out apps/blog/documents
 */

const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const arg = (name, def) => {
  const idx = args.indexOf(name);
  if (idx === -1) return def;
  return args[idx + 1];
};

const jdPath = arg("--jd");
const profilePath = arg("--profile");
const outBase = arg("--out", "apps/blog/documents");
const envPath = arg("--env", ".env");

if (!jdPath || !profilePath) {
  console.error("Usage: node scripts/generate.js --jd <jd.json> --profile <profile.json> [--out apps/blog/documents] [--env .env]");
  process.exit(1);
}

const loadEnv = (file) => {
  if (!fs.existsSync(file)) return {};
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const m = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
};

const envVars = loadEnv(envPath);

const replaceEnvTokens = (value) => {
  if (typeof value === "string") {
    return value.replace(/{{ENV_([A-Z0-9_]+)}}/g, (_, key) => envVars[key] || process.env[key] || `{{${key}_MISSING}}`);
  }
  if (Array.isArray(value)) return value.map(replaceEnvTokens);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = replaceEnvTokens(v);
    }
    return next;
  }
  return value;
};

const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const jd = loadJSON(jdPath);
const profileRaw = loadJSON(profilePath);
const profile = replaceEnvTokens(profileRaw);

const toSet = (arr = []) => new Set((arr || []).map((s) => s.toLowerCase()));
const intersectCount = (a, b) => {
  let c = 0;
  for (const v of a) if (b.has(v)) c += 1;
  return c;
};

const scoreProject = (project, jdData) => {
  const jdMust = toSet(jdData.must);
  const jdNice = toSet(jdData.nice);
  const jdDomain = toSet(jdData.domain);

  const projTags = toSet(project.tags);
  const projStack = toSet(project.stack);
  const projDomain = toSet(project.domain);

  const mustScore = intersectCount(projTags, jdMust) + intersectCount(projStack, jdMust) + intersectCount(projDomain, jdMust);
  const niceScore = intersectCount(projTags, jdNice) + intersectCount(projStack, jdNice) + intersectCount(projDomain, jdNice);
  const domainScore = intersectCount(projDomain, jdDomain) * 2;

  return mustScore * 2 + niceScore + domainScore;
};

const pickTopProjects = (projects, jdData, limit = 4) =>
  [...projects]
    .map((p) => ({ p, score: scoreProject(p, jdData) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const slugify = (str) =>
  (str || "output")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const dateStamp = new Date().toISOString().slice(0, 10);
const baseSlug = `${slugify(jd.company || "company")}-${slugify(jd.title || "role")}`;

const formatBasics = (b) => [
  `- 이름: ${b.name || ""}`,
  `- 이메일: ${b.email || ""}`,
  `- 전화: ${b.phone || ""}`,
  `- GitHub: ${b.links?.github || ""}`,
  `- Portfolio: ${b.links?.portfolio || ""}`,
  `- Blog: ${b.links?.blog || ""}`
].join("\n");

const formatGaps = (gaps = []) =>
  gaps
    .map(
      (g) =>
        `- ${g.start || ""} ~ ${g.end || ""} (${g.reason || "사유 미기입"})\n  - 활동: ${(g.activities || []).join(", ") || "활동 미기입"}\n  - 상태: ${g.status || ""}`
    )
    .join("\n");

const formatProjects = (projects = []) =>
  projects
    .map((p) => {
      const ach = (p.achievements || []).map((a) => `  - ${a}`).join("\n");
      return `### ${p.name} | ${p.role}\n**기간**: ${p.period}\n**스택**: ${(p.stack || []).join(", ")}\n${ach}\n`;
    })
    .join("\n");

const formatCore = (jdData) => {
  const must = (jdData.must || []).slice(0, 6).join(", ");
  const nice = (jdData.nice || []).slice(0, 4).join(", ");
  const domain = (jdData.domain || []).join(", ");
  return [
    `- JD 핵심: ${must}`,
    nice ? `- 우대: ${nice}` : "",
    domain ? `- 도메인: ${domain}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

const renderResume = ({ jdData, basics, projects, gaps }) => `---
title: "${jdData.company || ""} ${jdData.title || ""} 이력서"
type: "resume"
status: "draft"
company: "${jdData.company || ""}"
targetPosition: "${jdData.title || ""}"
updatedAt: "${dateStamp}"
---

## 기본 정보
${formatBasics(basics)}

## JD 핵심 정합도
${formatCore(jdData)}

## 주요 프로젝트
${formatProjects(projects)}

## 휴직/공백
${gaps && gaps.length ? formatGaps(gaps) : "- 공백 없음 또는 미기입"}

## 스택 요약
- 주력: ${(profile.skills?.primary || []).join(", ")}
- 보조: ${(profile.skills?.secondary || []).join(", ")}
- 도구: ${(profile.skills?.tools || []).join(", ")}
`;

const renderCover = ({ jdData, projects, gaps }) => {
  const topProjectLines = projects
    .slice(0, 2)
    .map((p) => `- ${p.name}: ${p.achievements?.[0] || "성과 기입 필요"}`)
    .join("\n");

  const gapLine =
    gaps && gaps.length
      ? `- 공백: ${gaps[0].start || ""}~${gaps[0].end || ""}, 사유: ${gaps[0].reason || ""}, 활동: ${(gaps[0].activities || []).join(", ")}`
      : "- 공백 없음 또는 미기입";

  return `---
title: "${jdData.company || ""} ${jdData.title || ""} 자기소개서"
type: "cover-letter"
status: "draft"
company: "${jdData.company || ""}"
targetPosition: "${jdData.title || ""}"
updatedAt: "${dateStamp}"
---

## 지원 동기
- ${jdData.summary || "JD 요약 미기입"}에 공감하며, 운영/어드민 경험을 적용하고자 지원합니다.

## 강점과 경험 (JD 매칭)
${topProjectLines || "- 프로젝트 성과 기입 필요"}

## 휴직/공백
${gapLine}

## 마무리
- React/Next.js/React Query 기반 어드민 경험, 컴포넌트 재사용, 성능·배포 최적화를 두나무 운영플랫폼에 적용하겠습니다.
`;
};

const main = () => {
  const topProjects = pickTopProjects(profile.projects || [], jd, 4);

  const resumeOutDir = path.join(outBase, "resumes");
  const coverOutDir = path.join(outBase, "cover-letters");
  ensureDir(resumeOutDir);
  ensureDir(coverOutDir);

  const resumeContent = renderResume({
    jdData: jd,
    basics: profile.basics || {},
    projects: topProjects,
    gaps: profile.gaps || []
  });

  const coverContent = renderCover({
    jdData: jd,
    projects: topProjects,
    gaps: profile.gaps || []
  });

  const resumePath = path.join(resumeOutDir, `${baseSlug}.mdx`);
  const coverPath = path.join(coverOutDir, `${baseSlug}.mdx`);
  fs.writeFileSync(resumePath, resumeContent, "utf8");
  fs.writeFileSync(coverPath, coverContent, "utf8");

  console.log(`Generated resume: ${resumePath}`);
  console.log(`Generated cover-letter: ${coverPath}`);
};

main();
