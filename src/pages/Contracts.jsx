import { useState } from 'react'
import { FileText, Calendar, Users } from 'lucide-react'
import contracts from '../data/contracts.json'

const STATUS_STYLE = {
  Active:   'bg-green-100 text-green-700',
  Expiring: 'bg-yellow-100 text-yellow-700',
  Expired:  'bg-red-100 text-red-700',
}

const STATUSES = ['All', 'Active', 'Expiring', 'Expired']

export default function Contracts() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? contracts : contracts.filter(c => c.status === filter)

  const totalVehicles = contracts.reduce((sum, c) => sum + c.fleetSize, 0)
  const activeCount   = contracts.filter(c => c.status === 'Active').length
  const expiringCount = contracts.filter(c => c.status === 'Expiring').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Survey Agreements</h1>
        <p className="text-gray-500 text-sm mt-1">Field survey contracts and product placement agreements</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Contracts',      value: activeCount,   Icon: FileText,  color: 'text-green-600 bg-green-50' },
          { label: 'Expiring Soon',         value: expiringCount, Icon: Calendar,  color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Total Fleet Vehicles',  value: totalVehicles, Icon: Users,     color: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}><Icon size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-400">
              <th className="px-5 py-4 font-medium">ID</th>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Fleet</th>
              <th className="px-5 py-4 font-medium">Start</th>
              <th className="px-5 py-4 font-medium">End</th>
              <th className="px-5 py-4 font-medium">Surveys/yr</th>
              <th className="px-5 py-4 font-medium">Next Survey</th>
              <th className="px-5 py-4 font-medium">Value</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{c.id}</td>
                <td className="px-5 py-3 font-medium text-gray-700">{c.customer}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{c.product}</td>
                <td className="px-5 py-3 text-gray-700">{c.fleetSize}</td>
                <td className="px-5 py-3 text-gray-500">{c.startDate}</td>
                <td className="px-5 py-3 text-gray-500">{c.endDate}</td>
                <td className="px-5 py-3 text-gray-700 text-center">{c.surveysPerYear}</td>
                <td className="px-5 py-3 text-gray-500">{c.nextSurvey ?? '—'}</td>
                <td className="px-5 py-3 font-medium text-gray-700">{c.value}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-gray-400">No contracts for this filter.</div>
        )}
      </div>
    </div>
  )
}
