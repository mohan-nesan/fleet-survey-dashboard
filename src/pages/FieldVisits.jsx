import { useState } from 'react'
import { MapPin, User, Package, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import visits from '../data/visits.json'

const OUTCOME_CONFIG = {
  'Completed':      { bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle },
  'Action Required':{ bg: 'bg-red-100',   text: 'text-red-700',   Icon: AlertCircle },
  'Scheduled':      { bg: 'bg-blue-100',  text: 'text-blue-700',  Icon: Clock },
}

const TYPES = ['All', 'Inspection', 'Placement', 'Alert Follow-up', 'Follow-up']

export default function FieldVisits() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? visits : visits.filter(v => v.type === filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Field Visit Log</h1>
        <p className="text-gray-500 text-sm mt-1">Customer site visits and field survey records</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === t
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>{t}</button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {filtered.map(v => {
          const cfg = OUTCOME_CONFIG[v.outcome] ?? OUTCOME_CONFIG['Scheduled']
          const { Icon } = cfg
          return (
            <div key={v.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="font-semibold text-gray-800">{v.customer}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{v.purpose}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${cfg.bg} ${cfg.text}`}>
                  <Icon size={12} /> {v.outcome}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1.5"><MapPin size={12} className="shrink-0" />{v.location}</div>
                <div className="flex items-center gap-1.5"><Calendar size={12} className="shrink-0" />{v.date}</div>
                <div className="flex items-center gap-1.5"><User size={12} className="shrink-0" />{v.contactPerson}</div>
                <div className="flex items-center gap-1.5"><Package size={12} className="shrink-0" />{v.type}</div>
              </div>

              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">{v.notes}</p>

              <div className="mt-3">
                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  {v.product}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center text-gray-400">
          No visits for this filter.
        </div>
      )}
    </div>
  )
}
