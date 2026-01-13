import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle, Star } from 'lucide-react'

const FormPreview = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`/api/forms/${id}`).then(res => { setForm(res.data); setLoading(false) }).catch(() => { setError('Failed to load form'); setLoading(false) })
  }, [id])

  const handleChange = (fieldId, value) => setResponses(p => ({ ...p, [fieldId]: value }))
  const handleCheckbox = (fieldId, val, checked) => {
    setResponses(p => {
      const curr = Array.isArray(p[fieldId]) ? p[fieldId] : []
      return { ...p, [fieldId]: checked ? [...curr, val] : curr.filter(v => v !== val) }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/responses/submit/${id}`, { responses: Object.keys(responses).map(k => ({ fieldId: k, value: responses[k] })) })
      setSubmitted(true)
    } catch (err) { setError(err.response?.data?.msg || 'Failed to submit') }
  }

  if (loading) return <div className="text-center py-8 text-text-muted">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (!form) return <div className="text-center py-8 text-text-muted">Form not found</div>
  if (submitted) return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Thank You!</h2>
      <p className="text-text-muted">Your response has been recorded.</p>
    </div>
  )

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {form.headerImage && (
          <img src={form.headerImage} alt="Form header" className="w-full h-48 object-cover" />
        )}
        <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-text-primary">{form.title}</h1>
          {form.description && <p className="text-text-muted mt-1">{form.description}</p>}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="p-4 bg-accent/30 rounded-lg border-l-4 border-primary">
              <label className="block text-sm font-medium text-text-primary mb-2">{field.label || 'Untitled'}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
              {['text', 'email', 'phone', 'number'].includes(field.type) && <input type={field.type} value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} required={field.required} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />}
              {field.type === 'textarea' && <textarea value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} required={field.required} rows="4" className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />}
              {field.type === 'date' && <input type="date" value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none" />}
              {field.type === 'dropdown' && <select value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"><option value="">Select</option>{(field.options || []).map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}</select>}
              {field.type === 'radio' && <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2"><input type="radio" name={field.id} value={o.value} checked={responses[field.id] === o.value} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className="text-primary" /><span>{o.label}</span></label>)}</div>}
              {field.type === 'checkbox' && <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2"><input type="checkbox" checked={(responses[field.id] || []).includes(o.value)} onChange={(e) => handleCheckbox(field.id, o.value, e.target.checked)} className="text-primary rounded" /><span>{o.label}</span></label>)}</div>}
              {field.type === 'rating' && <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => handleChange(field.id, s)} className="p-1"><Star className={`w-8 h-8 ${s <= (responses[field.id] || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} /></button>)}</div>}
            </div>
          ))}
          <button type="submit" className="w-full py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default FormPreview
