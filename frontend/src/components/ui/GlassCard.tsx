import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gold?: boolean;
  [key: string]: any;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  gold = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-surface-200 shadow-soft
        ${hover ? "transition-all duration-300 hover:shadow-medium hover:-translate-y-1" : ""}
        ${gold ? "border-l-4 border-l-gold-400" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

