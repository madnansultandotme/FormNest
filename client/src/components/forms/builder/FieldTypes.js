export const FIELD_TYPES = [
  { type: 'text', label: 'Short Answer', icon: '✏️', desc: 'Single line text' },
  { type: 'textarea', label: 'Long Answer', icon: '📝', desc: 'Multi-line text' },
  { type: 'number', label: 'Number', icon: '#', desc: 'Numeric input' },
  { type: 'email', label: 'Email', icon: '📧', desc: 'Email address' },
  { type: 'phone', label: 'Phone', icon: '📞', desc: 'Phone number' },
  { type: 'date', label: 'Date', icon: '📅', desc: 'Date picker' },
  { type: 'dropdown', label: 'Dropdown', icon: '▼', desc: 'Select one' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑️', desc: 'Select multiple' },
  { type: 'radio', label: 'Multiple Choice', icon: '○', desc: 'Select one' },
  { type: 'file', label: 'File Upload', icon: '📁', desc: 'Upload files' },
  { type: 'rating', label: 'Rating', icon: '⭐', desc: '5-star rating' }
]

export const hasOptions = (type) => ['dropdown', 'radio', 'checkbox'].includes(type)
export const hasPlaceholder = (type) => ['text', 'textarea', 'email', 'phone', 'number'].includes(type)
