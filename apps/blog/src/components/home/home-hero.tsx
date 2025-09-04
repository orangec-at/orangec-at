import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="text-center space-y-4">
      <h1 className="text-4xl font-bold">Hi, I'm Jaeil Lee</h1>
      <p className="text-lg text-gray-700">
        Frontend / Fullstack Developer. React & Next.js Specialist. 0→1 프로젝트
        경험 보유.
      </p>
      <Link href="/projects" className="underline text-blue-600">
        View Projects
      </Link>
    </section>
  );
}
