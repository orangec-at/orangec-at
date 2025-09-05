import Image from "next/image";

export default function HomeHero() {
  return (
    <section className="max-w-3xl mx-auto text-center space-y-8">
      {/* Avatar Image */}
      <div className="flex justify-center">
        <Image 
          src="/images/avatar.png" 
          alt="Jaeil Lee" 
          width={128}
          height={128}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      
      {/* Main Introduction */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Jaeil Lee – Frontend & Fullstack Developer
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          4.5년 프론트엔드 전문가로 창업부터 기업 SaaS까지, 사용자 중심 제품을 만듭니다.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center space-x-4">
        <a
          href="#projects"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          View Projects
        </a>
        <a
          href="/contact"
          className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
