import { useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import alertsData from '../data/alerts.json'

const SEVERITY_STYLE = {
  Critical: { badge: 'bg-red-100 text-red-700',       border: 'border-l-4 border-l-red-500',    icon: 'text-red-500' },
  High:     { badge: 'bg-orange-100 text-orange-700', border: 'border-l-4 border-l-orange-500', icon: 'text-orange-500' },
  Medium:   { badge: 'bg-yellow-100 text-yellow-700', border: 'border-l-4 border-l-yellow-500', icon: 'text-yellow-500' },
  Low:      { badge: 'bg-blue-100 text-blue-700',     border: 'border-l-4 border-l-blue-400',   icon: 'text-blue-400' },
}

const STATUS_STYLE = {
  'Open':        'bg-red-50 text-red-600',
  'In Progress': 'bg-yellow-50 text-yellow-600',
  'Monitoring':  'bg-blue-50 text-blue-600',
  'Resolved':    'bg-green-50 text-green-600',
}

const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low']

export default function Alerts() {
  const [alerts, setAlerts] = useState(alertsData)
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? alerts : alerts.filter(a => a.severity === filter)
  const activeCount = alerts.filter(a => a.status !== 'Resolved').length

  function resolve(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Alert Panel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Weak signal alerts and anomaly notifications from field surveys
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {SEVERITIES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>{s}</button>
        ))}
        <span className="ml-auto text-sm text-gray-400">{activeCount} active</span>
      </div>

      <div className="space-y-4">
        {filtered.map(alert => {
          const sev = SEVERITY_STYLE[alert.severity] ?? SEVERITY_STYLE.Low
          const resolved = alert.status === 'Resolved'
          return (
            <div key={alert.id} className={`bg-white rounded-xl shadow-sm p-5 ${sev.border} ${resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className={`${sev.icon} mt-0.5 shrink-0`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${sev.badge}`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{alert.type}</span>
                    <span className="text-xs text-gray-400">— {alert.vehicleId}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1.5">{alert.fleetName}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                    <span>ID: {alert.id}</span>
                    <span>Date: {alert.date}</span>
                    <span className={`px-2 py-0.5 rounded font-medium ${STATUS_STYLE[alert.status] ?? 'bg-gray-50 text-gray-500'}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                {resolved ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 shrink-0 ml-4">
                    <CheckCircle size={16} /> Resolved
                  </span>
                ) : (
                  <button onClick={() => resolve(alert.id)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 transition-colors shrink-0 ml-4">
                    <CheckCircle size={16} /> Resolve
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center text-gray-400">
            No alerts for this filter.
          </div>
        )}
      </div>
    </div>
  )
}
