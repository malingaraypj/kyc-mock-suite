import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: number;
}

const statusConfig = {
  0: { label: "Pending", variant: "warning" as const },
  1: { label: "Accepted", variant: "success" as const },
  2: { label: "Rejected", variant: "destructive" as const },
  3: { label: "Revoked", variant: "secondary" as const }
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[0];
  
  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
