import { NexosLogo } from "@/components/icons/clinic-logos";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <NexosLogo size={48} />
        </div>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
          <div className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
