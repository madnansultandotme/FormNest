import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import AddFieldButton from './builder/AddFieldButton'
import FormFieldCard from './builder/FormFieldCard'
import { hasOptions } from './builder/FieldTypes'

const CreateForm = () => {
  const [formData, setFormData] = useState({ title: '', description: '', fields: [] })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const createField = (type) => ({
    id: uuidv4(), type, label: '', required: false, placeholder: '',
    options: hasOptions(type) ? [{ value: uuidv4(), label: 'Option 1' }] : undefined
  })

  const addField = (type) => setFormData(p => ({ ...p, fields: [...p.fields, createField(type)] }))
  const addFieldAfter = (index, type) => { const f = [...formData.fields]; f.splice(index + 1, 0, createField(type)); setFormData(p => ({ ...p, fields: f })) }
  const updateField = (id, data) => setFormData(p => ({ ...p, fields: p.fields.map(f => f.id === id ? { ...f, ...data } : f) }))
  const deleteField = (id) => setFormData(p => ({ ...p, fields: p.fields.filter(f => f.id !== id) }))
  const duplicateField = (id) => { const f = formData.fields.find(x => x.id === id); if (f) { const idx = formData.fields.findIndex(x => x.id === id); const nf = [...formData.fields]; nf.splice(idx + 1, 0, { ...f, id: uuidv4() }); setFormData(p => ({ ...p, fields: nf })) } }
  const moveField = (id, dir) => { const idx = formData.fields.findIndex(f => f.id === id); const ni = idx + dir; if (ni < 0 || ni >= formData.fields.length) return; const f = [...formData.fields]; [f[idx], f[ni]] = [f[ni], f[idx]]; setFormData(p => ({ ...p, fields: f })) }

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert('Please enter a form title')
    if (formData.fields.length === 0) return alert('Please add at least one question')
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/forms', formData, { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } })
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save form')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="p-6">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Untitled Form" className="w-full text-2xl font-semibold text-gray-800 border-none outline-none placeholder-gray-400 mb-2" />
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Form description (optional)" rows="2" className="w-full text-gray-600 border-none outline-none placeholder-gray-400 resize-none" />
        </div>
      </div>
      <div className="min-h-[200px]">
        {formData.fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-50">📋</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No questions yet</h3>
            <p className="text-gray-500 mb-6">Click the button below to add your first question</p>
            <div className="flex justify-center"><AddFieldButton onAddField={addField} /></div>
          </div>
        ) : formData.fields.map((field, index) => (
          <FormFieldCard key={field.id} field={field} index={index} totalFields={formData.fields.length} onUpdate={updateField} onDelete={deleteField} onDuplicate={duplicateField} onMove={moveField} onAddFieldAfter={addFieldAfter} />
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
        <button type="button" onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Form'}</button>
      </div>
    </div>
  )
}

export default CreateForm
