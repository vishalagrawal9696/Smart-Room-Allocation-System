export default function StatCard({ icon: Icon, label, value, color = "blue", loading }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    teal: "bg-teal-50 text-teal-600",
  };

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-12 bg-slate-200 rounded animate-pulse mb-1" />
        ) : (
          <div className="text-2xl font-bold text-slate-800">{value ?? "—"}</div>
        )}
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
