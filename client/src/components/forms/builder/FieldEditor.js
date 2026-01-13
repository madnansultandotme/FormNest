import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { hasOptions, hasPlaceholder } from './FieldTypes';

const FieldEditor = ({ field, onChange, onSave, onCancel }) => {
  const updateField = (key, value) => onChange({ ...field, [key]: value });

  const addOption = () => {
    updateField('options', [...(field.options || []), { value: uuidv4(), label: '' }]);
  };

  const updateOption = (index, label) => {
    const newOptions = [...field.options];
    newOptions[index] = { ...newOptions[index], label };
    updateField('options', newOptions);
  };

  const removeOption = (index) => {
    updateField('options', field.options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField('label', e.target.value)}
          placeholder="Enter your question"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          autoFocus
        />
      </div>

      {hasPlaceholder(field.type) && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Placeholder</label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => updateField('placeholder', e.target.value)}
            placeholder="Placeholder text (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      )}

      {hasOptions(field.type) && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Options</label>
          <div className="space-y-2">
            {(field.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  disabled={field.options.length <= 1}
                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="w-full py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={field.required || false}
          onChange={(e) => updateField('required', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Required field</span>
      </label>

      <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;
