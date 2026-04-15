import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-100 text-primary-700",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        valid: "border-transparent bg-accent-100 text-accent-600",
        review: "border-transparent bg-warning-100 text-warning-600",
        overcharged: "border-transparent bg-destructive-100 text-destructive-600",
        outline: "border-border text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        blue: "border-transparent bg-primary-50 text-primary-600",
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
