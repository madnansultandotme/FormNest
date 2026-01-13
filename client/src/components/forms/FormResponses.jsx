import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { Inbox, Eye, Download, Trash2, Loader2 } from 'lucide-react'

const FormResponses = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

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

  const formatValue = (v) => Array.isArray(v) ? v.join(', ') : v || '-'

  const handleExport = () => {
    if (!form || responses.length === 0) return

    const data = responses.map((r, i) => {
      const row = {
        '#': i + 1,
        'Submitted At': new Date(r.submittedAt).toLocaleString()
      }
      form.fields.forEach(f => {
        const val = r.responses?.find(x => x.fieldId === f.id)
        row[f.label || 'Untitled'] = formatValue(val?.value)
      })
      return row
    })

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    XLSX.writeFile(wb, `${form.title.replace(/[^a-z0-9]/gi, '_')}_responses.xlsx`)
  }

  const handleDelete = async (responseId) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return
    
    setDeleting(responseId)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/responses/${responseId}`, { headers: { 'x-auth-token': token } })
      setResponses(responses.filter(r => r._id !== responseId))
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete response')
    }
    setDeleting(null)
  }

  const handleDeleteAll = async () => {
    if (!window.confirm(`Are you sure you want to delete all ${responses.length} responses? This cannot be undone.`)) return
    
    setDeleting('all')
    try {
      const token = localStorage.getItem('token')
      await Promise.all(responses.map(r => axios.delete(`/api/responses/${r._id}`, { headers: { 'x-auth-token': token } })))
      setResponses([])
    } catch (err) {
      alert('Failed to delete some responses')
    }
    setDeleting(null)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-text-muted"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...</div>
  if (!form) return <div className="text-center py-8 text-text-muted">Form not found</div>

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{form.title}</h1>
          <p className="text-text-muted">{responses.length} responses</p>
        </div>
        <div className="flex items-center gap-2">
          {responses.length > 0 && (
            <>
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover">
                <Download className="w-4 h-4" />
                Export Excel
              </button>
              <button onClick={handleDeleteAll} disabled={deleting === 'all'} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            </>
          )}
          <Link to={`/form/${id}`} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-muted border border-border rounded-lg hover:bg-accent">
            <Eye className="w-4 h-4" />
            View Form
          </Link>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No responses yet</h3>
          <p className="text-text-muted">Share your form to start collecting responses</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Submitted</th>
                {form.fields.map(f => <th key={f.id} className="px-4 py-3 text-left text-xs font-medium text-text-muted">{f.label || 'Untitled'}</th>)}
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {responses.map((r, i) => (
                <tr key={r._id} className="hover:bg-accent/30">
                  <td className="px-4 py-3 text-sm text-text-muted">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">{new Date(r.submittedAt).toLocaleString()}</td>
                  {form.fields.map(f => {
                    const val = r.responses?.find(x => x.fieldId === f.id)
                    return <td key={f.id} className="px-4 py-3 text-sm text-text-primary max-w-xs truncate">{formatValue(val?.value)}</td>
                  })}
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleDelete(r._id)} 
                      disabled={deleting === r._id}
                      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      title="Delete response"
                    >
                      {deleting === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
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
