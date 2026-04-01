export default function DashboardLoading() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-32 bg-muted rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-xl border" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-white rounded-xl border" />
        <div className="h-64 bg-white rounded-xl border" />
      </div>

      <div className="h-48 bg-white rounded-xl border" />
    </div>
  );
}
