import { useContext } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import AlertContext from '../../context/AlertContext'

const Alert = () => {
  const { alerts } = useContext(AlertContext)
  if (alerts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map(alert => (
        <div key={alert.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-accent text-primary border border-primary/20'}`}>
          {alert.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {alert.msg}
        </div>
      ))}
    </div>
  )
}

export default Alert
