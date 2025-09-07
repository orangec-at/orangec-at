import Image from "next/image";
import SplitText from "../ui/split-text";

const TITLE = "Jaeil Lee | Frontend & Fullstack Developer";
const JOB = "실제 운영 서비스를 만들고 키우는 Product Engineer";
const DESC =
  "1년+ 실제 운영 서비스 경험, 빠르고 안정적으로 웹 서비스를 구현합니다.";

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
          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
        />
      </div>

      {/* Main Introduction */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {TITLE}
          </h2>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {JOB}
          </h2>
        </div>
        <SplitText
          text={DESC}
          className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
          splitType="words"
          ease="elastic.out(1, 0.7)"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center space-x-4">
        <a
          href="#projects"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          프로젝트 보기
        </a>
        <a
          href="/contact"
          className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white dark:text-white px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
