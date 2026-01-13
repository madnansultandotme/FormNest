import { useReducer } from 'react'
import AlertContext from './AlertContext'

const initialState = { alerts: [] }

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] }
    case 'REMOVE_ALERT':
      return { ...state, alerts: state.alerts.filter(a => a.id !== action.payload) }
    default:
      return state
  }
}

const AlertState = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState)

  const setAlert = (msg, type, timeout = 4000) => {
    const id = Date.now()
    dispatch({ type: 'SET_ALERT', payload: { msg, type, id } })
    setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout)
  }

  return (
    <AlertContext.Provider value={{ alerts: state.alerts, setAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertState
