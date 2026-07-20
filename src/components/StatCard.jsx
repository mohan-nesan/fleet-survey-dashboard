const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg shrink-0 ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
            {trend.up ? '▲' : '▼'} {trend.text}
          </p>
        )}
      </div>
    </div>
  )
}
