import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ChargeFlag } from "@/types";

interface ChargeFlagBadgeProps {
  status: ChargeFlag;
  showIcon?: boolean;
}

const config: Record<
  ChargeFlag,
  {
    label: string;
    variant: "valid" | "review" | "overcharged";
    Icon: React.ElementType;
  }
> = {
  valid: {
    label: "Likely valid",
    variant: "valid",
    Icon: CheckCircle2,
  },
  review_needed: {
    label: "Review needed",
    variant: "review",
    Icon: AlertTriangle,
  },
  possibly_overcharged: {
    label: "Possibly overcharged",
    variant: "overcharged",
    Icon: XCircle,
  },
};

export function ChargeFlagBadge({ status, showIcon = true }: ChargeFlagBadgeProps) {
  const { label, variant, Icon } = config[status];

  return (
    <Badge variant={variant}>
      {showIcon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
}
