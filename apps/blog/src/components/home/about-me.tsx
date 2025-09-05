import CareerTimeline from "./career-timeline";

export default function AboutMe() {
  return (
    <section className="max-w-2xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">About Me</h2>
      <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
        <p>
          마이다스아이티에서 건축 SaaS 플랫폼을 개발하며 모노레포 아키텍처와 SSO 시스템을 구축했습니다.
        </p>
        <p>
          이후 요가 기록 앱(드로우하타)과 원데이클래스 플랫폼(요가데이)을 기획부터 운영까지 전 과정 단독 수행하며 실제 매출이 발생하는 비즈니스를 만들었습니다.
        </p>
        <p>
          Claude Code 등 AI 도구를 활용해 개발 생산성을 300% 향상시키며, 기술과 비즈니스의 균형점을 찾는 개발자입니다.
        </p>
      </div>
    </section>
  );
}
