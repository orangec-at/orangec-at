// 클라이언트/서버 공용 블로그 유틸리티
import { PROJECTS } from "@/data/projects";
import { getRelatedProjectIds } from "@/data/connections";
import { BlogPostMeta } from "./blog-utils.server";

// 블로그 슬러그에서 관련 프로젝트들 가져오기 (클라이언트에서 사용 가능)
export function getRelatedProjects(blogSlug: string) {
  const relatedProjectIds = getRelatedProjectIds(blogSlug);
  return PROJECTS.filter((project) => relatedProjectIds.includes(project.id));
}

// BlogPostMeta 타입 재export (클라이언트에서 타입 참조용)
export type { BlogPostMeta };
