import type { DeviceType } from "./types";

function MobileFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="inline-flex flex-col items-center rounded-[2.5rem] bg-zinc-900 p-2.5 shadow-2xl dark:bg-zinc-800">
      <div className="mb-2 h-[18px] w-[80px] rounded-full bg-zinc-950" />
      <div className="overflow-hidden rounded-[1.75rem]">
        <img className="block w-[280px]" src={src} alt={alt} />
      </div>
      <div className="mt-2 h-[4px] w-[100px] rounded-full bg-zinc-700" />
    </div>
  );
}

function DesktopFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="inline-flex flex-col overflow-hidden rounded-xl border border-border bg-zinc-100 shadow-2xl dark:bg-zinc-800">
      <div className="flex items-center gap-1.5 bg-zinc-200 px-3 py-2 dark:bg-zinc-700">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
      </div>
      <img className="block max-w-[640px]" src={src} alt={alt} />
    </div>
  );
}

export function DeviceFrame({
  type,
  src,
  alt,
}: {
  type: DeviceType;
  src: string;
  alt: string;
}) {
  return type === "mobile" ? <MobileFrame src={src} alt={alt} /> : <DesktopFrame src={src} alt={alt} />;
}
