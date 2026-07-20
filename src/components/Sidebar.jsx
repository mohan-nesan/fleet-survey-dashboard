import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart2,
  MapPin,
  AlertTriangle,
  FileText,
  Truck,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inspection', icon: ClipboardCheck, label: 'Tire Inspection' },
  { to: '/fleet-report', icon: BarChart2, label: 'Fleet Reports' },
  { to: '/visits', icon: MapPin, label: 'Field Visits' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/contracts', icon: FileText, label: 'Contracts' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Truck className="text-blue-400" size={28} />
          <div>
            <div className="font-bold text-base leading-tight">Fleet Survey</div>
            <div className="text-xs text-slate-400">Product Technician Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">
            PS
          </div>
          <div>
            <div className="text-sm font-medium">Product Surveyor</div>
            <div className="text-xs text-slate-400">Namakkal, TN</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
