import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from "@hugeicons/core-free-icons";

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-poppins text-zinc-100">
      <div className="flex flex-col items-center gap-4">
        <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-zinc-400" />
        <p className="text-sm text-zinc-500">Loading fonts…</p>
      </div>
    </div>
  );
};