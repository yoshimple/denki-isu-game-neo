import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-400 mb-4">⚡ 404 ⚡</h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-400 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-200 transform hover:scale-105"
        >
          ⚡ トップページへ戻る ⚡
        </Link>
      </div>
    </div>
  );
}
