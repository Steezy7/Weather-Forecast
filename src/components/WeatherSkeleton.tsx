const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />
);

const WeatherSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 max-w-5xl mx-auto">
    <div className="md:col-span-8 space-y-4">
      <Pulse className="h-64 rounded-3xl" />
      <Pulse className="h-28 rounded-3xl" />
    </div>
    <div className="md:col-span-4 space-y-4">
      <Pulse className="h-80 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        <Pulse className="h-24 rounded-2xl" />
        <Pulse className="h-24 rounded-2xl" />
        <Pulse className="h-24 rounded-2xl" />
        <Pulse className="h-24 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default WeatherSkeleton;
