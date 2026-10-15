import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(262,83%,68%)] text-white hover:bg-[hsl(262,83%,68%)]/80",
        secondary:
          "border-transparent bg-[hsl(230,20%,16%)] text-[hsl(220,20%,90%)] hover:bg-[hsl(230,20%,20%)]",
        destructive:
          "border-transparent bg-[hsl(0,75%,62%)]/20 text-[hsl(0,75%,65%)] border-[hsl(0,75%,62%)]/40",
        outline:
          "border-[hsl(230,15%,22%)] text-[hsl(225,12%,70%)] bg-transparent",
        accent:
          "border-[hsl(190,90%,55%)]/30 bg-[hsl(190,90%,55%)]/15 text-[hsl(190,90%,55%)]",
        // Pilar Konten
        edukasi:
          "border-[hsl(190,90%,55%)]/30 bg-[hsl(190,90%,55%)]/15 text-[hsl(190,90%,55%)]",
        inspirasi:
          "border-[hsl(262,83%,68%)]/30 bg-[hsl(262,83%,68%)]/15 text-[hsl(262,83%,75%)]",
        promosi:
          "border-[hsl(38,92%,60%)]/30 bg-[hsl(38,92%,60%)]/15 text-[hsl(38,92%,60%)]",
        bts:
          "border-[hsl(165,75%,45%)]/30 bg-[hsl(165,75%,45%)]/15 text-[hsl(165,75%,50%)]",
        // Kategori Hook
        kesalahan:
          "border-[hsl(0,75%,62%)]/30 bg-[hsl(0,75%,62%)]/15 text-[hsl(0,75%,68%)]",
        kontroversial:
          "border-[hsl(38,92%,60%)]/30 bg-[hsl(38,92%,60%)]/15 text-[hsl(38,92%,60%)]",
        studiKasus:
          "border-[hsl(215,85%,60%)]/30 bg-[hsl(215,85%,60%)]/15 text-[hsl(215,85%,68%)]",
        // Status Skrip
        draft:
          "border-[hsl(230,15%,30%)] bg-[hsl(230,15%,16%)] text-[hsl(225,12%,65%)]",
        final:
          "border-[hsl(152,60%,50%)]/30 bg-[hsl(152,60%,50%)]/15 text-[hsl(152,60%,55%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
