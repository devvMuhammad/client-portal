import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Chat Header */}
      <div className="hidden md:flex gap-2 items-center border-b h-14 px-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="flex-1 h-10" />
      </div>
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    </div>
  );
}
