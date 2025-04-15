// src/components/UsageCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface UsageCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function UsageCard({
  title,
  value,
  icon,
  description,
  trend = "neutral",
}: UsageCardProps) {
  const trendColors = {
    up: "text-emerald-500",
    down: "text-red-500",
    neutral: "text-foreground/70",
  };

  return (
    <Card className="bg-card-bg/50 border-border/50 hover:border-primary-accent/30 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-foreground/60 group-hover:text-primary-accent transition-colors">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p
            className={`text-xs mt-1 flex items-center ${trendColors[trend]}`}
          >
            {description}
            {trend !== "neutral" && (
              <span className="ml-1">
                {trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}