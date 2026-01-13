import { Upload, Star } from 'lucide-react'

const FieldPreview = ({ field }) => {
  const inputClass = "w-full px-3 py-2 border border-border rounded-lg text-sm text-text-muted bg-accent/30"

  switch (field.type) {
    case 'text': case 'email': case 'phone': case 'number':
      return <input type={field.type} className={inputClass} placeholder={field.placeholder || 'Your answer'} disabled />
    case 'textarea':
      return <textarea className={inputClass} placeholder={field.placeholder || 'Your answer'} rows="3" disabled />
    case 'dropdown':
      return <select className={inputClass} disabled><option>Select an option</option>{(field.options || []).map((o, i) => <option key={i}>{o.label}</option>)}</select>
    case 'radio':
      return <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2 text-sm text-text-muted"><input type="radio" disabled className="w-4 h-4 text-primary" /><span>{o.label || `Option ${i+1}`}</span></label>)}</div>
    case 'checkbox':
      return <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2 text-sm text-text-muted"><input type="checkbox" disabled className="w-4 h-4 rounded text-primary" /><span>{o.label || `Option ${i+1}`}</span></label>)}</div>
    case 'date':
      return <input type="date" className={inputClass} disabled />
    case 'file':
      return (
        <div className="px-4 py-6 border-2 border-dashed border-border rounded-lg text-center text-text-muted text-sm flex flex-col items-center gap-2">
          <Upload className="w-6 h-6" />
          Click to upload
        </div>
      )
    case 'rating':
      return <div className="flex gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400" />)}</div>
    default:
      return <input type="text" className={inputClass} disabled />
  }
}

export default FieldPreview
