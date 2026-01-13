import { useState, useRef, useEffect } from 'react'
import { FIELD_TYPES } from './FieldTypes'

const AddFieldButton = ({ onAddField }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
        <span className="text-lg font-bold">+</span>
        <span>Add Question</span>
      </button>
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Select Field Type</p>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {FIELD_TYPES.map((f) => (
              <button key={f.type} type="button" onClick={() => { onAddField(f.type); setIsOpen(false) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-left">
                <span className="text-xl w-8 text-center">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{f.label}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddFieldButton
