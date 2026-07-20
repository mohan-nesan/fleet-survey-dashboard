import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import InspectionForm from './pages/InspectionForm'
import FleetReport from './pages/FleetReport'
import FieldVisits from './pages/FieldVisits'
import Alerts from './pages/Alerts'
import Contracts from './pages/Contracts'

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-amber-400 text-amber-900 text-xs font-semibold text-center py-2 px-4 shrink-0 flex items-center justify-center gap-2">
          <span>⚠</span>
          <span>
            DEMO APPLICATION — All data is simulated.
          </span>
        </div>
        <div className="flex flex-1 bg-gray-100 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inspection" element={<InspectionForm />} />
              <Route path="/fleet-report" element={<FleetReport />} />
              <Route path="/visits" element={<FieldVisits />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/contracts" element={<Contracts />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  )
}
