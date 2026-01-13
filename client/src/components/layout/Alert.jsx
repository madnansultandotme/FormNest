import { useContext } from 'react'
import AlertContext from '../../context/AlertContext'

const Alert = () => {
  const { alerts } = useContext(AlertContext)
  if (alerts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map(alert => (
        <div key={alert.id} className={`px-4 py-3 rounded-lg shadow-lg ${alert.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  )
}

export default Alert
