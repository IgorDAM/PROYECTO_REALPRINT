import { Printer } from "lucide-react";

interface LogoProps {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
  align?: "center" | "start";
  className?: string;
}

const sizeClasses = {
  sm: {
    iconBox: "w-8 h-8 rounded-lg",
    icon: "w-4 h-4",
    text: "text-lg",
  },
  md: {
    iconBox: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl",
    icon: "w-5 h-5 sm:w-6 sm:h-6",
    text: "text-2xl sm:text-3xl",
  },
  lg: {
    iconBox: "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl",
    icon: "w-6 h-6 sm:w-8 sm:h-8",
    text: "text-3xl sm:text-5xl",
  },
} as const;

export default function Logo({ dark = true, size = "md", align = "center", className = "" }: LogoProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${align === "center" ? "justify-center" : "justify-start"} gap-3 ${className}`.trim()}>
      <div
        className={`flex items-center justify-center shadow-lg ${classes.iconBox} ${
          dark
            ? "bg-gradient-to-br from-primary-600 to-primary-700 shadow-primary-900/20"
            : "bg-white/10 backdrop-blur-sm border border-white/20 shadow-black/10"
        }`}
      >
        <Printer className={`${classes.icon} ${dark ? "text-white" : "text-gold-400"}`} />
      </div>
      <h1 className={`font-extrabold tracking-tight ${classes.text} ${dark ? "text-surface-900" : "text-white"}`}>
        RealPrint
      </h1>
    </div>
  );
}
