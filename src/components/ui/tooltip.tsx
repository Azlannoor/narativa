import * as React from "react";
import { cn } from "@/src/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TooltipContent) {
            return visible ? child : null;
          }
          return child;
        }
        return child;
      })}
    </div>
  );
}

export function TooltipTrigger({
  children,
  className,
  asChild = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn((children.props as any)?.className, className),
      ...props,
    });
  }
  return (
    <div className={cn("inline-flex cursor-default", className)} {...props}>
      {children}
    </div>
  );
}

export function TooltipContent({
  children,
  className,
  side = "top",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-[hsl(230,15%,22%)] bg-[hsl(230,20%,13%)] px-3 py-1.5 text-xs text-[hsl(220,20%,95%)] shadow-xl animate-in fade-in-0 duration-150",
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
}
