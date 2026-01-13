import { 
  Type, AlignLeft, Hash, Mail, Phone, Calendar, 
  ChevronDown, CheckSquare, Circle, Upload, Star 
} from 'lucide-react'

export const FIELD_TYPES = [
  { type: 'text', label: 'Short Answer', Icon: Type, desc: 'Single line text' },
  { type: 'textarea', label: 'Long Answer', Icon: AlignLeft, desc: 'Multi-line text' },
  { type: 'number', label: 'Number', Icon: Hash, desc: 'Numeric input' },
  { type: 'email', label: 'Email', Icon: Mail, desc: 'Email address' },
  { type: 'phone', label: 'Phone', Icon: Phone, desc: 'Phone number' },
  { type: 'date', label: 'Date', Icon: Calendar, desc: 'Date picker' },
  { type: 'dropdown', label: 'Dropdown', Icon: ChevronDown, desc: 'Select one' },
  { type: 'checkbox', label: 'Checkboxes', Icon: CheckSquare, desc: 'Select multiple' },
  { type: 'radio', label: 'Multiple Choice', Icon: Circle, desc: 'Select one' },
  { type: 'file', label: 'File Upload', Icon: Upload, desc: 'Upload files' },
  { type: 'rating', label: 'Rating', Icon: Star, desc: '5-star rating' }
]

export const hasOptions = (type) => ['dropdown', 'radio', 'checkbox'].includes(type)
export const hasPlaceholder = (type) => ['text', 'textarea', 'email', 'phone', 'number'].includes(type)
