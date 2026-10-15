import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[hsl(262,83%,68%)] to-[hsl(262,75%,58%)] text-white shadow-md hover:from-[hsl(262,83%,72%)] hover:to-[hsl(262,75%,62%)] hover:shadow-[0_0_20px_-4px_hsla(262,83%,68%,0.45)]",
        destructive:
          "bg-[hsl(0,75%,62%)] text-white hover:bg-[hsl(0,75%,56%)] shadow-sm hover:shadow-[0_0_16px_-4px_hsla(0,75%,62%,0.4)]",
        outline:
          "border border-[hsl(230,15%,22%)] bg-[hsl(230,22%,10%)]/50 text-[hsl(220,20%,95%)] hover:bg-[hsl(230,20%,14%)] hover:border-[hsl(262,83%,68%)]/50 hover:text-white",
        secondary:
          "bg-[hsl(230,20%,14%)] text-[hsl(220,20%,95%)] hover:bg-[hsl(230,20%,18%)] border border-[hsl(230,15%,22%)]/40",
        ghost:
          "text-[hsl(225,12%,65%)] hover:text-[hsl(220,20%,95%)] hover:bg-[hsl(230,20%,14%)]",
        accent:
          "bg-[hsl(190,90%,55%)] text-[hsl(230,25%,6%)] font-semibold shadow-md hover:bg-[hsl(190,90%,62%)] hover:shadow-[0_0_20px_-4px_hsla(190,90%,55%,0.5)]",
        link: "text-[hsl(190,90%,55%)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
