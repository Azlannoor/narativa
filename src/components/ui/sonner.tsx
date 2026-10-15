import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(230,20%,13%)] group-[.toaster]:text-[hsl(220,20%,95%)] group-[.toaster]:border-[hsl(230,15%,22%)] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-sans",
          description: "group-[.toast]:text-[hsl(225,12%,65%)]",
          actionButton:
            "group-[.toast]:bg-[hsl(262,83%,68%)] group-[.toast]:text-white font-medium rounded-lg",
          cancelButton:
            "group-[.toast]:bg-[hsl(230,20%,16%)] group-[.toast]:text-[hsl(225,12%,65%)] rounded-lg",
          success:
            "group-[.toaster]:border-[hsl(152,60%,50%)]/40",
          error:
            "group-[.toaster]:border-[hsl(0,75%,62%)]/40",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
