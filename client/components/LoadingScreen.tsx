import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A12] text-white/90">
      <div className="flex flex-col items-center gap-4">
        <HugeiconsIcon
          icon={Loading03Icon}
          size={32}
          className="animate-spin text-white/60"
        />
        <p className="text-sm text-white/50">Loading fonts…</p>
      </div>
    </div>
  );
};
