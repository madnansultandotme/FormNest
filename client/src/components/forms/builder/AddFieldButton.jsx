import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
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
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted bg-card border-2 border-dashed border-border rounded-full hover:border-primary hover:text-primary hover:bg-accent transition-all">
        <Plus className="w-4 h-4" />
        <span>Add Question</span>
      </button>
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-card rounded-xl shadow-xl border border-border z-50 overflow-hidden">
          <div className="px-4 py-3 bg-accent/50 border-b border-border">
            <p className="text-xs font-semibold text-text-muted uppercase">Select Field Type</p>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {FIELD_TYPES.map((f) => (
              <button key={f.type} type="button" onClick={() => { onAddField(f.type); setIsOpen(false) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-left">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <f.Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{f.label}</p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
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
