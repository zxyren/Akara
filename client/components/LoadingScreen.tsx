import { IconLoader3 } from "@tabler/icons-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-poppins flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <IconLoader3 size={48} stroke={1} className="animate-spin text-cyan-400 mb-6" />
        <p className="text-slate-400">Loading fonts...</p>
      </div>
    </div>
  );
};