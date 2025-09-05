import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center space-y-8">
        {/* Error Number */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
            <br />
            아래 버튼을 통해 홈으로 돌아가세요.
          </p>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            홈으로 돌아가기
          </Link>
          <div className="text-sm text-gray-500">
            또는{" "}
            <Link href="/blog" className="text-gray-700 hover:underline">
              블로그
            </Link>
            {", "}
            <Link href="/projects" className="text-gray-700 hover:underline">
              프로젝트
            </Link>
            를 둘러보세요
          </div>
        </div>
      </div>
    </main>
  );
}