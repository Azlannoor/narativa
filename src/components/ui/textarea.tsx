import * as React from "react";
import { cn } from "@/src/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-xl border border-[hsl(230,15%,22%)]/80 bg-[hsl(230,22%,8%)] px-3.5 py-2.5 text-sm text-[hsl(220,20%,95%)] transition-colors placeholder:text-[hsl(225,12%,50%)] focus-visible:outline-none focus-visible:border-[hsl(262,83%,68%)] focus-visible:ring-2 focus-visible:ring-[hsl(262,83%,68%)]/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
