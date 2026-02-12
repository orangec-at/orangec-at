// 프로젝트-블로그 연결의 단일 진실 공급원
export const PROJECT_BLOG_CONNECTIONS = [
  {
    projectId: "1", // Drawhatha
    blogSlugs: ["from-idea-to-app-store-in-3-months"]
  },
  {
    projectId: "2", // Yogaday  
    blogSlugs: ["shipping-fullstack-booking-platform-solo"]
  },
  {
    projectId: "3", // SaaS 플랫폼
    blogSlugs: ["my-first-post"] // 여러 프로젝트가 같은 블로그 참조 가능
  },
  {
    projectId: "7", // DPP
    blogSlugs: ["building-3-frontend-architecture-ev-battery"]
  }
];

// 프로젝트의 관련 블로그 조회
export function getRelatedBlogSlugs(projectId: string): string[] {
  return PROJECT_BLOG_CONNECTIONS
    .filter(conn => conn.projectId === projectId)
    .flatMap(conn => conn.blogSlugs);
}

// 블로그의 관련 프로젝트 조회  
export function getRelatedProjectIds(blogSlug: string): string[] {
  return PROJECT_BLOG_CONNECTIONS
    .filter(conn => conn.blogSlugs.includes(blogSlug))
    .map(conn => conn.projectId);
}

// 연결 검증 (개발용)
export function validateConnections() {
  const allProjectIds = PROJECT_BLOG_CONNECTIONS.map(c => c.projectId);
  const allBlogSlugs = PROJECT_BLOG_CONNECTIONS.flatMap(c => c.blogSlugs);
  
  console.log('🔗 연결 상태:');
  console.log('연결된 프로젝트:', [...new Set(allProjectIds)]);
  console.log('연결된 블로그:', [...new Set(allBlogSlugs)]);
}
