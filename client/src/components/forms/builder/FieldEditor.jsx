import { v4 as uuidv4 } from 'uuid'
import { Plus, X } from 'lucide-react'
import { hasOptions, hasPlaceholder } from './FieldTypes'

const FieldEditor = ({ field, onChange, onSave, onCancel }) => {
  const update = (key, value) => onChange({ ...field, [key]: value })

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1">Question</label>
        <input type="text" value={field.label} onChange={(e) => update('label', e.target.value)} placeholder="Enter your question" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" autoFocus />
      </div>
      {hasPlaceholder(field.type) && (
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Placeholder</label>
          <input type="text" value={field.placeholder || ''} onChange={(e) => update('placeholder', e.target.value)} placeholder="Placeholder text" className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
        </div>
      )}
      {hasOptions(field.type) && (
        <div>
          <label className="block text-xs font-medium text-text-muted mb-2">Options</label>
          <div className="space-y-2">
            {(field.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-5">{idx + 1}.</span>
                <input type="text" value={opt.label} onChange={(e) => { const opts = [...field.options]; opts[idx] = { ...opts[idx], label: e.target.value }; update('options', opts) }} placeholder={`Option ${idx + 1}`} className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                <button type="button" onClick={() => update('options', field.options.filter((_, i) => i !== idx))} disabled={field.options.length <= 1} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => update('options', [...(field.options || []), { value: uuidv4(), label: '' }])} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-text-muted border border-dashed border-border rounded-lg hover:border-primary hover:text-primary hover:bg-accent">
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={field.required || false} onChange={(e) => update('required', e.target.checked)} className="w-4 h-4 rounded border-border text-primary" />
        <span className="text-sm text-text-primary">Required field</span>
      </label>
      <div className="flex justify-end gap-2 pt-3 border-t border-border">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-text-muted bg-card border border-border rounded-lg hover:bg-accent">Cancel</button>
        <button type="button" onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">Done</button>
      </div>
    </div>
  )
}

export default FieldEditor
