import { CircleAlert } from "lucide-react";

export default function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex w-full flex-col h-full items-center gap-2 justify-center">
      <CircleAlert className="text-foreground w-18 h-18" />
      <p className="text-foreground text-center text-base">{text}</p>
    </div>
  );
}
