import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

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

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (!form) return <div className="text-center py-8 text-gray-500">Form not found</div>
  if (submitted) return <div className="max-w-xl mx-auto py-16 text-center"><div className="text-5xl mb-4">✅</div><h2 className="text-2xl font-bold mb-2">Thank You!</h2><p className="text-gray-600">Your response has been recorded.</p></div>

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          {form.description && <p className="text-gray-600 mt-1">{form.description}</p>}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <label className="block text-sm font-medium text-gray-800 mb-2">{field.label || 'Untitled'}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
              {['text', 'email', 'phone', 'number'].includes(field.type) && <input type={field.type} value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />}
              {field.type === 'textarea' && <textarea value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} placeholder={field.placeholder} required={field.required} rows="4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />}
              {field.type === 'date' && <input type="date" value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />}
              {field.type === 'dropdown' && <select value={responses[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Select</option>{(field.options || []).map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}</select>}
              {field.type === 'radio' && <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2"><input type="radio" name={field.id} value={o.value} checked={responses[field.id] === o.value} onChange={(e) => handleChange(field.id, e.target.value)} required={field.required} /><span>{o.label}</span></label>)}</div>}
              {field.type === 'checkbox' && <div className="space-y-2">{(field.options || []).map((o, i) => <label key={i} className="flex items-center gap-2"><input type="checkbox" checked={(responses[field.id] || []).includes(o.value)} onChange={(e) => handleCheckbox(field.id, o.value, e.target.checked)} /><span>{o.label}</span></label>)}</div>}
              {field.type === 'rating' && <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => handleChange(field.id, s)} className={`text-3xl ${s <= (responses[field.id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>)}</div>}
            </div>
          ))}
          <button type="submit" className="w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default FormPreview
