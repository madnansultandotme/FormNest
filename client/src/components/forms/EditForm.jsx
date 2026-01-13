import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { ClipboardList, Loader2, ImagePlus, X } from 'lucide-react'
import AddFieldButton from './builder/AddFieldButton'
import FormFieldCard from './builder/FormFieldCard'
import { hasOptions } from './builder/FieldTypes'

const EditForm = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({ title: '', description: '', headerImage: '', fields: [] })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`/api/forms/${id}`, { headers: { 'x-auth-token': token } })
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          headerImage: res.data.headerImage || '',
          fields: res.data.fields || []
        })
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load form')
      }
      setLoading(false)
    }
    fetchForm()
  }, [id])

  const createField = (type) => ({
    id: uuidv4(), type, label: '', required: false, placeholder: '',
    options: hasOptions(type) ? [{ value: uuidv4(), label: 'Option 1' }] : undefined
  })

  const addField = (type) => setFormData(p => ({ ...p, fields: [...p.fields, createField(type)] }))
  const updateField = (id, data) => setFormData(p => ({ ...p, fields: p.fields.map(f => f.id === id ? { ...f, ...data } : f) }))
  const deleteField = (id) => setFormData(p => ({ ...p, fields: p.fields.filter(f => f.id !== id) }))
  const duplicateField = (id) => { const f = formData.fields.find(x => x.id === id); if (f) { const idx = formData.fields.findIndex(x => x.id === id); const nf = [...formData.fields]; nf.splice(idx + 1, 0, { ...f, id: uuidv4() }); setFormData(p => ({ ...p, fields: nf })) } }
  const moveField = (id, dir) => { const idx = formData.fields.findIndex(f => f.id === id); const ni = idx + dir; if (ni < 0 || ni >= formData.fields.length) return; const f = [...formData.fields]; [f[idx], f[ni]] = [f[ni], f[idx]]; setFormData(p => ({ ...p, fields: f })) }

  const handleDragStart = (e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) return
    
    const newFields = [...formData.fields]
    const [draggedField] = newFields.splice(dragIndex, 1)
    newFields.splice(dropIndex, 0, draggedField)
    setFormData(p => ({ ...p, fields: newFields }))
    setDragIndex(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData(p => ({ ...p, headerImage: event.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const removeHeaderImage = () => {
    setFormData(p => ({ ...p, headerImage: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert('Please enter a form title')
    if (formData.fields.length === 0) return alert('Please add at least one question')
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/forms/${id}`, formData, { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } })
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update form')
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading form...
    </div>
  )

  if (error) return (
    <div className="text-center py-16">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Back to Dashboard</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-6">
        {/* Header Image Section */}
        {formData.headerImage ? (
          <div className="relative">
            <img src={formData.headerImage} alt="Form header" className="w-full h-48 object-cover" />
            <button 
              onClick={removeHeaderImage}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-32 bg-accent/50 border-b border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
          >
            <ImagePlus className="w-8 h-8 text-text-muted mb-2" />
            <span className="text-sm text-text-muted">Click to add header image</span>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-6">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Untitled Form" className="w-full text-2xl font-semibold text-text-primary border-none outline-none placeholder-text-muted mb-2 bg-transparent" />
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Form description (optional)" rows="2" className="w-full text-text-muted border-none outline-none placeholder-text-muted resize-none bg-transparent" />
        </div>
      </div>

      <div className="min-h-[200px]">
        {formData.fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">No questions yet</h3>
            <p className="text-text-muted mb-6">Click the button below to add your first question</p>
          </div>
        ) : (
          <div className="mb-4">
            {formData.fields.map((field, index) => (
              <FormFieldCard 
                key={field.id} 
                field={field} 
                index={index} 
                totalFields={formData.fields.length} 
                onUpdate={updateField} 
                onDelete={deleteField} 
                onDuplicate={duplicateField} 
                onMove={moveField}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-center">
          <AddFieldButton onAddField={addField} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
        <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 text-sm font-medium text-text-primary bg-card border border-border rounded-lg hover:bg-accent">Cancel</button>
        <button type="button" onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50">{saving ? 'Saving...' : 'Update Form'}</button>
      </div>
    </div>
  )
}

export default EditForm
