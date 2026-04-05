// ダッシュボード共通ローディング表示
export default function DashboardLoading() {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* ヘッダースケルトン */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* メトリクスカードスケルトン */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* コンテンツスケルトン */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-5 bg-white">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
