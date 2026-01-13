import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import AddFieldButton from './builder/AddFieldButton';
import FormFieldCard from './builder/FormFieldCard';
import { hasOptions } from './builder/FieldTypes';

const CreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: []
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const createField = (type) => ({
    id: uuidv4(),
    type,
    label: '',
    required: false,
    placeholder: '',
    options: hasOptions(type) ? [{ value: uuidv4(), label: 'Option 1' }] : undefined
  });

  const addField = (type) => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, createField(type)]
    }));
  };

  const addFieldAfter = (index, type) => {
    const newFields = [...formData.fields];
    newFields.splice(index + 1, 0, createField(type));
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const updateField = (id, data) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === id ? { ...f, ...data } : f)
    }));
  };

  const deleteField = (id) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== id)
    }));
  };

  const duplicateField = (id) => {
    const field = formData.fields.find(f => f.id === id);
    if (field) {
      const idx = formData.fields.findIndex(f => f.id === id);
      const newField = { ...field, id: uuidv4() };
      const newFields = [...formData.fields];
      newFields.splice(idx + 1, 0, newField);
      setFormData(prev => ({ ...prev, fields: newFields }));
    }
  };

  const moveField = (id, direction) => {
    const idx = formData.fields.findIndex(f => f.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= formData.fields.length) return;
    
    const newFields = [...formData.fields];
    [newFields[idx], newFields[newIdx]] = [newFields[newIdx], newFields[idx]];
    setFormData(prev => ({ ...prev, fields: newFields }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a form title');
      return;
    }
    if (formData.fields.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/forms', formData, {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save form');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Form Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="p-6">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Untitled Form"
            className="w-full text-2xl font-semibold text-gray-800 border-none outline-none placeholder-gray-400 mb-2"
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Form description (optional)"
            rows="2"
            className="w-full text-gray-600 border-none outline-none placeholder-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Fields Container */}
      <div className="min-h-[200px]">
        {formData.fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 opacity-50">📋</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No questions yet</h3>
            <p className="text-gray-500 mb-6">Click the button below to add your first question</p>
            <div className="flex justify-center">
              <AddFieldButton onAddField={addField} />
            </div>
          </div>
        ) : (
          <>
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
                onAddFieldAfter={addFieldAfter}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Form'}
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
