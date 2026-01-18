export default function StatCard({ title, value, icon, trend, trendUp, variant = "blue" }) {
  const iconColors = {
    blue: "bg-gradient-to-br from-primary-500 to-primary-600 text-white",
    gold: "bg-gradient-to-br from-gold-400 to-gold-500 text-white",
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  };

  const borderColors = {
    blue: "border-l-primary-500",
    gold: "border-l-gold-400",
    green: "border-l-emerald-500",
    purple: "border-l-purple-500",
  };

  return (
    <div className={`bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-surface-200 shadow-soft border-l-4 ${borderColors[variant]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs lg:text-sm font-medium text-surface-500 truncate">{title}</p>
          <p className="text-xl lg:text-3xl font-bold text-surface-900 mt-1 lg:mt-2">{value}</p>
          {trend && (
            <p className={`text-xs lg:text-sm mt-1 lg:mt-2 flex items-center gap-1 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
              <span className="material-symbols-outlined text-sm">
                {trendUp ? "trending_up" : "trending_down"}
              </span>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${iconColors[variant]}`}>
            <span className="material-symbols-outlined text-base lg:text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
