import { useState } from 'react'
import { GripVertical, ChevronUp, ChevronDown, Pencil, Copy, Trash2 } from 'lucide-react'
import { FIELD_TYPES } from './FieldTypes'
import FieldEditor from './FieldEditor'
import FieldPreview from './FieldPreview'

const FormFieldCard = ({ field, index, totalFields, onUpdate, onDelete, onDuplicate, onMove, onDragStart, onDragOver, onDrop }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...field })
  const fieldType = FIELD_TYPES.find(f => f.type === field.type)

  const handleSave = () => { onUpdate(field.id, editData); setIsEditing(false) }
  const handleCancel = () => { setEditData({ ...field }); setIsEditing(false) }

  return (
    <div 
      className="mb-3"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      <div className={`bg-card rounded-xl border ${isEditing ? 'border-primary ring-2 ring-accent' : 'border-border hover:border-text-muted'} transition-all`}>
        <div className="flex items-center justify-between px-2 py-2 bg-accent/30 border-b border-border rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text-primary">
              <GripVertical className="w-4 h-4" />
            </div>
            <span className="text-xs text-text-muted font-medium">{index + 1}.</span>
            {fieldType && <fieldType.Icon className="w-4 h-4 text-primary" />}
            <span className="text-xs font-medium text-text-muted">{fieldType?.label}</span>
            {field.required && <span className="px-1.5 py-0.5 text-[10px] font-medium text-red-600 bg-red-50 rounded">Required</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onMove(field.id, -1)} disabled={index === 0} className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-accent rounded disabled:opacity-30" title="Move up">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={() => onMove(field.id, 1)} disabled={index === totalFields - 1} className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-accent rounded disabled:opacity-30" title="Move down">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={() => setIsEditing(true)} className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-accent rounded" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDuplicate(field.id)} className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-accent rounded" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(field.id)} className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {isEditing ? <FieldEditor field={editData} onChange={setEditData} onSave={handleSave} onCancel={handleCancel} /> : (
            <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
              <p className="text-sm font-medium text-text-primary mb-3">{field.label || 'Untitled Question'}{field.required && <span className="text-red-500 ml-1">*</span>}</p>
              <FieldPreview field={field} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormFieldCard
