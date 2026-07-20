import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import fleets from '../data/fleets.json'
import inspections from '../data/inspections.json'

const STATUS_COLOR = { Active: '#22c55e', Alert: '#f59e0b', Critical: '#ef4444' }
const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444']

const treadData = fleets.map(f => ({
  name: f.name.split(' ').slice(0, 2).join(' '),
  depth: f.avgTreadDepth,
  status: f.status,
}))

const statusDistribution = [
  { name: 'Active',   value: fleets.filter(f => f.status === 'Active').length },
  { name: 'Alert',    value: fleets.filter(f => f.status === 'Alert').length },
  { name: 'Critical', value: fleets.filter(f => f.status === 'Critical').length },
].filter(s => s.value > 0)

export default function FleetReport() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fleet Validation Report</h1>
          <p className="text-gray-500 text-sm mt-1">Tread depth analysis and fleet health — July 2026</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Print Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Tread Depth by Fleet (mm)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={treadData} margin={{ top: 5, right: 10, left: -10, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} unit="mm" />
              <Tooltip formatter={(v) => [`${v} mm`, 'Avg Tread Depth']} />
              <Bar dataKey="depth" radius={[4, 4, 0, 0]}>
                {treadData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLOR[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500 inline-block" />Active</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500 inline-block" />Alert</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block" />Critical</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Fleet Status Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                dataKey="value"
                paddingAngle={3}
              >
                {statusDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [`${v} fleet(s)`, name]} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Fleet Summary</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Fleet Name</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Vehicles</th>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Avg Tread</th>
              <th className="pb-3 font-medium">Last Inspection</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {fleets.map(f => (
              <tr key={f.id}>
                <td className="py-3 font-mono text-xs text-gray-400">{f.id}</td>
                <td className="py-3 font-medium text-gray-700">{f.name}</td>
                <td className="py-3 text-gray-500">{f.location}</td>
                <td className="py-3 text-gray-700">{f.vehicles}</td>
                <td className="py-3 text-gray-500 text-xs">{f.product}</td>
                <td className="py-3">
                  <span className={`font-bold ${
                    f.avgTreadDepth < 3 ? 'text-red-600' :
                    f.avgTreadDepth < 5 ? 'text-yellow-600' :
                                          'text-green-600'
                  }`}>{f.avgTreadDepth} mm</span>
                </td>
                <td className="py-3 text-gray-500">{f.lastInspection}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    f.status === 'Active'   ? 'bg-green-100 text-green-700' :
                    f.status === 'Alert'    ? 'bg-yellow-100 text-yellow-700' :
                                             'bg-red-100 text-red-700'
                  }`}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Inspection Log</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Vehicle</th>
              <th className="pb-3 font-medium">Fleet</th>
              <th className="pb-3 font-medium">Axle</th>
              <th className="pb-3 font-medium">Tread (mm)</th>
              <th className="pb-3 font-medium">PSI</th>
              <th className="pb-3 font-medium">Condition</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {inspections.map(ins => (
              <tr key={ins.id}>
                <td className="py-2 font-mono text-xs text-gray-400">{ins.id}</td>
                <td className="py-2 font-medium text-gray-700">{ins.vehicleId}</td>
                <td className="py-2 text-gray-500 text-xs">
                  {ins.fleetName.split(' ').slice(0, 2).join(' ')}
                </td>
                <td className="py-2 text-gray-500">{ins.axle}</td>
                <td className="py-2 font-bold">
                  <span className={
                    ins.treadDepth < 3 ? 'text-red-600' :
                    ins.treadDepth < 5 ? 'text-yellow-600' :
                                         'text-green-600'
                  }>{ins.treadDepth}</span>
                </td>
                <td className="py-2 text-gray-700">{ins.pressure}</td>
                <td className="py-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div key={n} className={`w-3 h-3 rounded-sm ${
                        n <= ins.condition
                          ? ins.condition <= 2 ? 'bg-red-500'
                          : ins.condition === 3 ? 'bg-yellow-500'
                          : 'bg-green-500'
                          : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                </td>
                <td className="py-2 text-gray-500">{ins.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
