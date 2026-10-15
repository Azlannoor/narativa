import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

export function Select({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newVal: string) => {
    if (!isControlled) {
      setUncontrolledValue(newVal);
    }
    onValueChange?.(newVal);
    setOpen(false);
  };

  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange: handleValueChange, open, setOpen }}
    >
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  placeholder,
}: {
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be in Select");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-[hsl(230,15%,22%)]/80 bg-[hsl(230,22%,8%)] px-3.5 py-2 text-sm text-[hsl(220,20%,95%)] transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(262,83%,68%)]/30",
        className
      )}
    >
      {children || <span className="text-[hsl(225,12%,50%)]">{placeholder}</span>}
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
    </button>
  );
}

export function SelectValue({
  placeholder,
  displayValue,
}: {
  placeholder?: string;
  displayValue?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be in Select");

  return (
    <span className="truncate">
      {displayValue || context.value || placeholder}
    </span>
  );
}

export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context || !context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[hsl(230,15%,22%)] bg-[hsl(230,20%,13%)] p-1 text-[hsl(220,20%,95%)] shadow-xl animate-in fade-in-0 duration-150",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be in Select");

  const isSelected = context.value === value;

  return (
    <div
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors",
        isSelected
          ? "bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] font-medium"
          : "text-[hsl(220,20%,90%)] hover:bg-[hsl(230,20%,18%)] hover:text-white",
        className
      )}
    >
      {children}
    </div>
  );
}
