import { Truck, AlertTriangle, ClipboardCheck, MapPin } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import StatCard from '../components/StatCard'
import fleets from '../data/fleets.json'
import alerts from '../data/alerts.json'
import visits from '../data/visits.json'

const BAR_COLORS = {
  Active: '#3b82f6',
  Alert: '#f59e0b',
  Critical: '#ef4444',
}

const treadChartData = fleets.map(f => ({
  name: f.name.split(' ').slice(0, 2).join(' '),
  depth: f.avgTreadDepth,
  status: f.status,
}))

export default function Dashboard() {
  const totalVehicles = fleets.reduce((sum, f) => sum + f.vehicles, 0)
  const openAlerts = alerts.filter(a => a.status === 'Open' || a.status === 'In Progress').length
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Fleet survey overview — Namakkal Region, July 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Fleets Tracked"
          value={fleets.length}
          subtitle={`${totalVehicles} total vehicles`}
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Pending Inspections"
          value="3"
          subtitle="Due within 30 days"
          icon={ClipboardCheck}
          color="yellow"
          trend={{ up: false, text: '1 overdue' }}
        />
        <StatCard
          title="Open Alerts"
          value={openAlerts}
          subtitle={`${criticalCount} critical`}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Visits This Month"
          value={visits.length}
          subtitle="Jul 2026"
          icon={MapPin}
          color="green"
          trend={{ up: true, text: '+2 from last month' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Avg Tread Depth by Fleet (mm)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={treadChartData} margin={{ top: 5, right: 10, left: -10, bottom: 65 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-28} textAnchor="end" interval={0} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} unit="mm" />
              <Tooltip formatter={(v) => [`${v} mm`, 'Avg Tread Depth']} />
              <Bar dataKey="depth" radius={[4, 4, 0, 0]}>
                {treadChartData.map((entry, i) => (
                  <Cell key={i} fill={BAR_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block" />Normal</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500 inline-block" />Alert</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block" />Critical</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold ${
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'High'     ? 'bg-orange-100 text-orange-700' :
                  alert.severity === 'Medium'   ? 'bg-yellow-100 text-yellow-700' :
                                                  'bg-blue-100 text-blue-700'
                }`}>{alert.severity}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{alert.fleetName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.type} — {alert.vehicleId}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{alert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Recent Field Visits</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visits.slice(0, 4).map(v => (
              <tr key={v.id}>
                <td className="py-3 font-medium text-gray-700">{v.customer}</td>
                <td className="py-3 text-gray-500">{v.location}</td>
                <td className="py-3 text-gray-500">{v.type}</td>
                <td className="py-3 text-gray-500">{v.date}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    v.outcome === 'Completed'       ? 'bg-green-100 text-green-700' :
                    v.outcome === 'Action Required' ? 'bg-red-100 text-red-700' :
                                                     'bg-blue-100 text-blue-700'
                  }`}>{v.outcome}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
