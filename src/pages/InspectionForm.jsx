import { useState } from 'react'
import fleets from '../data/fleets.json'

const AXLE_OPTIONS = [
  'Front Left', 'Front Right',
  'Rear Left', 'Rear Right',
  'Rear Inner Left', 'Rear Inner Right',
  'Spare',
]
const VEHICLE_TYPES = ['Heavy Truck', 'Semi-Trailer', 'Dump Truck', 'Tanker', 'Flatbed']
const CONDITION_LABELS = { 1: 'Critical', 2: 'Poor', 3: 'Fair', 4: 'Good', 5: 'Excellent' }

const emptyForm = {
  fleetId: '',
  vehicleId: '',
  vehicleType: '',
  date: new Date().toISOString().slice(0, 10),
  axle: '',
  treadDepth: '',
  pressure: '',
  condition: 3,
  mileage: '',
  notes: '',
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('fsd_inspections') || '[]')
  } catch {
    return []
  }
}

export default function InspectionForm() {
  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState(loadHistory)

  const selectedFleet = fleets.find(f => f.id === form.fleetId)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const record = {
      ...form,
      id: `INS-${Date.now()}`,
      fleetName: selectedFleet?.name ?? '',
      treadDepth: parseFloat(form.treadDepth),
      pressure: parseInt(form.pressure),
      mileage: parseInt(form.mileage),
      condition: parseInt(form.condition),
    }
    const updated = [record, ...history]
    localStorage.setItem('fsd_inspections', JSON.stringify(updated))
    setHistory(updated)
    setForm(emptyForm)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const cond = parseInt(form.condition)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tire Inspection Form</h1>
        <p className="text-gray-500 text-sm mt-1">
          Record tread depth, pressure readings, and condition rating during field visits
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-sm font-medium">
                Inspection record saved successfully.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fleet</label>
                <select name="fleetId" value={form.fleetId} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select fleet…</option>
                  {fleets.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Reg. No.</label>
                <input type="text" name="vehicleId" value={form.vehicleId} onChange={handleChange} required
                  placeholder="e.g. TN33AK4521"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select type…</option>
                  {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Axle Position</label>
                <select name="axle" value={form.axle} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select axle…</option>
                  {AXLE_OPTIONS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (km)</label>
                <input type="number" name="mileage" value={form.mileage} onChange={handleChange} required
                  placeholder="e.g. 45000" min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tread Depth (mm)</label>
                <input type="number" name="treadDepth" value={form.treadDepth} onChange={handleChange} required
                  step="0.1" min="0" max="20" placeholder="e.g. 7.5"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Pressure (PSI)</label>
                <input type="number" name="pressure" value={form.pressure} onChange={handleChange} required
                  min="50" max="200" placeholder="e.g. 110"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tire Condition —{' '}
                <span className="font-bold">
                  {cond}/5 {CONDITION_LABELS[cond]}
                </span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n}
                    onClick={() => setForm(prev => ({ ...prev, condition: n }))}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                      n <= cond
                        ? cond <= 2 ? 'bg-red-500 text-white'
                        : cond === 3 ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>{n}</button>
                ))}
                <span className="text-xs text-gray-400 ml-2">1 = Critical · 5 = Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes & Observations</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                placeholder="Describe wear patterns, anomalies, or recommendations…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div className="flex gap-3">
              <button type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Save Inspection Record
              </button>
              <button type="button" onClick={() => setForm(emptyForm)}
                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {selectedFleet && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Fleet Info</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Vehicles', selectedFleet.vehicles],
                  ['Product', selectedFleet.product],
                  ['Location', selectedFleet.location],
                  ['Last Inspection', selectedFleet.lastInspection],
                  ['Avg Tread Depth', `${selectedFleet.avgTreadDepth} mm`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-gray-500 shrink-0">{label}</span>
                    <span className="font-medium text-xs text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Saved Records ({history.length})
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400">No records saved yet. Submit a form above.</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 5).map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-lg p-3 text-xs">
                    <div className="font-medium text-gray-700">{r.fleetName || 'Unknown Fleet'}</div>
                    <div className="text-gray-500">{r.vehicleId} — {r.axle}</div>
                    <div className="text-gray-400 mt-0.5">
                      {r.treadDepth}mm · {r.pressure}psi · Cond {r.condition}/5
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
