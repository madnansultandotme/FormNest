import { useState } from 'react'
import { FIELD_TYPES } from './FieldTypes'
import FieldEditor from './FieldEditor'
import FieldPreview from './FieldPreview'
import AddFieldButton from './AddFieldButton'

const FormFieldCard = ({ field, index, totalFields, onUpdate, onDelete, onDuplicate, onMove, onAddFieldAfter }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...field })
  const fieldType = FIELD_TYPES.find(f => f.type === field.type)

  const handleSave = () => { onUpdate(field.id, editData); setIsEditing(false) }
  const handleCancel = () => { setEditData({ ...field }); setIsEditing(false) }

  return (
    <div className="mb-4">
      <div className={`bg-white rounded-xl border ${isEditing ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'} transition-all`}>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="text-base">{fieldType?.icon}</span>
            <span className="text-xs font-medium text-gray-500">{fieldType?.label}</span>
            {field.required && <span className="px-1.5 py-0.5 text-[10px] font-medium text-red-600 bg-red-50 rounded">Required</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onMove(field.id, -1)} disabled={index === 0} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30" title="Move up">↑</button>
            <button onClick={() => onMove(field.id, 1)} disabled={index === totalFields - 1} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30" title="Move down">↓</button>
            <button onClick={() => setIsEditing(true)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded" title="Edit">✏️</button>
            <button onClick={() => onDuplicate(field.id)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded" title="Duplicate">📋</button>
            <button onClick={() => onDelete(field.id)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">🗑️</button>
          </div>
        </div>
        <div className="p-4">
          {isEditing ? <FieldEditor field={editData} onChange={setEditData} onSave={handleSave} onCancel={handleCancel} /> : (
            <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
              <p className="text-sm font-medium text-gray-800 mb-3">{field.label || 'Untitled Question'}{field.required && <span className="text-red-500 ml-1">*</span>}</p>
              <FieldPreview field={field} />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center py-3">
        <AddFieldButton onAddField={(type) => onAddFieldAfter(index, type)} />
      </div>
    </div>
  )
}

export default FormFieldCard
