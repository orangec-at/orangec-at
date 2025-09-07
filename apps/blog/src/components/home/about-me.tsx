const aboutMeText = [
  "저는 스타트업과 팀이 가진 아이디어를 실제 제품으로 구현하는 일을 돕습니다. ",
  "SaaS 플랫폼, 데이터 대시보드, 모바일 앱 등 다양한 프로젝트 경험을 통해 React와 Next.js로 사용자 친화적인 인터페이스를 빠르게 설계하고 개발할 수 있습니다. ",
  "코딩뿐 아니라 원활한 커뮤니케이션을 중시하며, 기획자·디자이너·백엔드 개발자와 긴밀하게 협업해 가치 있는 기능을 제공합니다. ",
  "빠른 실행력과 품질이 필요한 프로젝트라면 함께할 준비가 되어 있습니다.",
];

export default function AboutMe() {
  return (
    <section className="max-w-2xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h2>
      <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        {aboutMeText.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </section>
  );
}
