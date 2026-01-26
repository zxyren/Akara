interface ProcessingIndicatorProps {
  current: number;
  total: number;
}

export const ProcessingIndicator = ({ current, total }: ProcessingIndicatorProps) => {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="mb-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-400">Processing fonts…</span>
        <span className="font-medium text-zinc-300">
          {current} / {total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-400 transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};