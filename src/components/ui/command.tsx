import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function Command({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[hsl(230,20%,13%)] text-[hsl(220,20%,95%)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-xl overflow-hidden rounded-2xl border border-[hsl(230,15%,22%)] bg-[hsl(230,20%,13%)] shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[hsl(225,12%,65%)] hover:bg-[hsl(230,20%,18%)] hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function CommandInput({
  value,
  onValueChange,
  placeholder = "Cari di Narativa... (Ctrl+K)",
  className,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="flex items-center border-b border-[hsl(230,15%,22%)]/60 px-4">
      <Search className="mr-3 h-4 w-4 shrink-0 text-[hsl(225,12%,65%)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-12 w-full rounded-md bg-transparent py-3 text-sm text-[hsl(220,20%,95%)] outline-none placeholder:text-[hsl(225,12%,50%)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        autoFocus
      />
    </div>
  );
}

export function CommandList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-h-[340px] overflow-y-auto overflow-x-hidden p-2 text-[hsl(220,20%,95%)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandEmpty({
  children = "Tidak ada hasil ditemukan.",
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="py-6 text-center text-sm text-[hsl(225,12%,60%)]">
      {children}
    </div>
  );
}

export function CommandGroup({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden p-1 text-[hsl(220,20%,95%)]", className)}>
      <div className="px-2 py-1.5 text-xs font-semibold text-[hsl(225,12%,55%)] uppercase tracking-wider">
        {heading}
      </div>
      {children}
    </div>
  );
}

export function CommandItem({
  children,
  onSelect,
  className,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm text-[hsl(220,20%,90%)] outline-none hover:bg-[hsl(230,20%,18%)] hover:text-white transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
