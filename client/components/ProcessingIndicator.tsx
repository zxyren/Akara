interface ProcessingIndicatorProps {
  current: number;
  total: number;
}

export const ProcessingIndicator = ({ current, total }: ProcessingIndicatorProps) => {
  return (
    <div className="mb-6 bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-cyan-300">Processing fonts...</span>
        <span className="text-sm text-cyan-300">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1">
        <div
          className="bg-cyan-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
};