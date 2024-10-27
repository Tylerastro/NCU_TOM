export default function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 bg-background/50 flex flex-col gap-4">
      <div className="w-1/2 h-4 bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        <div className="w-3/4 h-3 bg-muted rounded animate-pulse" />
        <div className="w-1/2 h-3 bg-muted rounded animate-pulse" />
      </div>
      <div className="mt-auto flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        <div className="w-24 h-3 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
