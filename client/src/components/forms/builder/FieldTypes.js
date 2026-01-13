export const FIELD_TYPES = [
  { type: 'text', label: 'Short Answer', icon: '✏️', description: 'Single line text' },
  { type: 'textarea', label: 'Long Answer', icon: '📝', description: 'Multi-line text' },
  { type: 'number', label: 'Number', icon: '#', description: 'Numeric input' },
  { type: 'email', label: 'Email', icon: '📧', description: 'Email address' },
  { type: 'phone', label: 'Phone', icon: '📞', description: 'Phone number' },
  { type: 'date', label: 'Date', icon: '📅', description: 'Date picker' },
  { type: 'dropdown', label: 'Dropdown', icon: '▼', description: 'Select one option' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☑️', description: 'Select multiple' },
  { type: 'radio', label: 'Multiple Choice', icon: '○', description: 'Select one' },
  { type: 'file', label: 'File Upload', icon: '📁', description: 'Upload files' },
  { type: 'rating', label: 'Rating', icon: '⭐', description: '5-star rating' }
];

export const hasOptions = (type) => ['dropdown', 'radio', 'checkbox'].includes(type);
export const hasPlaceholder = (type) => ['text', 'textarea', 'email', 'phone', 'number'].includes(type);
