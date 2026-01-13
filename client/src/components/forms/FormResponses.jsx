import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const FormResponses = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token')
        const config = { headers: { 'x-auth-token': token } }
        const [formRes, respRes] = await Promise.all([axios.get(`/api/forms/${id}`, config), axios.get(`/api/responses/${id}`, config)])
        setForm(formRes.data)
        setResponses(respRes.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>
  if (!form) return <div className="text-center py-8 text-gray-500">Form not found</div>

  const formatValue = (v) => Array.isArray(v) ? v.join(', ') : v || '-'

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <p className="text-gray-600">{responses.length} responses</p>
        </div>
        <Link to={`/form/${id}`} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">View Form</Link>
      </div>
      {responses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No responses yet</h3>
          <p className="text-gray-500">Share your form to start collecting responses</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Submitted</th>
                {form.fields.map(f => <th key={f.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{f.label || 'Untitled'}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {responses.map((r, i) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(r.submittedAt).toLocaleString()}</td>
                  {form.fields.map(f => {
                    const val = r.responses?.find(x => x.fieldId === f.id)
                    return <td key={f.id} className="px-4 py-3 text-sm text-gray-800">{formatValue(val?.value)}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default FormResponses
