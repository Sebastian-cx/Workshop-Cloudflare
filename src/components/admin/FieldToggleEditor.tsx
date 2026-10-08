import React, { useState } from 'react';
import { FieldConfig } from '../../types';
import { Save, Eye, EyeOff, AlertCircle, Sparkles, Check, X, Plus, Trash2, List } from 'lucide-react';

interface FieldToggleEditorProps {
  fields: FieldConfig[];
  onChange: (updatedFields: FieldConfig[]) => void;
  onSave: () => void;
  isSaving: boolean;
  isReadOnly?: boolean;
}

export const FieldToggleEditor: React.FC<FieldToggleEditorProps> = ({
  fields,
  onChange,
  onSave,
  isSaving,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'preview'>('matrix');
  const [newOptionInputs, setNewOptionInputs] = useState<Record<string, string>>({});

  const handleToggleEnabled = (fieldName: string) => {
    if (isReadOnly) return;
    const updated = fields.map((f) => {
      if (f.field_name === fieldName) {
        const nextEnabled = !f.enabled;
        return {
          ...f,
          enabled: nextEnabled,
          required: nextEnabled ? f.required : false,
        };
      }
      return f;
    });
    onChange(updated);
  };

  const handleToggleRequired = (fieldName: string) => {
    if (isReadOnly) return;
    const updated = fields.map((f) => {
      if (f.field_name === fieldName) {
        const nextRequired = !f.required;
        return {
          ...f,
          required: nextRequired,
          enabled: nextRequired ? true : f.enabled,
        };
      }
      return f;
    });
    onChange(updated);
  };

  const handleFieldChange = (fieldName: string, key: keyof FieldConfig, value: any) => {
    if (isReadOnly) return;
    const updated = fields.map((f) => (f.field_name === fieldName ? { ...f, [key]: value } : f));
    onChange(updated);
  };

  const handleAddOption = (fieldName: string) => {
    if (isReadOnly) return;
    const inputVal = (newOptionInputs[fieldName] || '').trim();
    if (!inputVal) return;

    const updated = fields.map((f) => {
      if (f.field_name === fieldName) {
        const existingOptions = f.options || [];
        if (!existingOptions.includes(inputVal)) {
          return { ...f, options: [...existingOptions, inputVal] };
        }
      }
      return f;
    });

    onChange(updated);
    setNewOptionInputs({ ...newOptionInputs, [fieldName]: '' });
  };

  const handleRemoveOption = (fieldName: string, optionToRemove: string) => {
    if (isReadOnly) return;
    const updated = fields.map((f) => {
      if (f.field_name === fieldName) {
        return {
          ...f,
          options: (f.options || []).filter((opt) => opt !== optionToRemove),
        };
      }
      return f;
    });
    onChange(updated);
  };

  const enabledCount = fields.filter((f) => f.enabled).length;
  const requiredCount = fields.filter((f) => f.enabled && f.required).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-slate-100 font-sans">
              Registration Field Configurator Matrix
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
              {enabledCount} Enabled ({requiredCount} Required)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Toggle fields, customize labels & dropdown options (Year of Study, Experience), and preview form in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center space-x-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'matrix' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Field Matrix
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
                activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Form Preview</span>
            </button>
          </div>

          {!isReadOnly && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:brightness-110 transition shadow-neon-cyan flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Matrix...' : 'Save Field Toggles'}</span>
            </button>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>Moderator Mode Notice: You have read-only permissions for field configuration.</span>
        </div>
      )}

      {activeTab === 'matrix' ? (
        /* Matrix Table / List */
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div
              key={field.field_name}
              className={`p-5 rounded-2xl border transition ${
                field.enabled
                  ? 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-slate-100 font-mono">{field.field_name}</span>
                    <span className="text-xs text-slate-400 block font-mono">
                      Type: <span className="text-cyan-400 uppercase">{field.field_type}</span>
                    </span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleToggleEnabled(field.field_name)}
                    disabled={isReadOnly}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition ${
                      field.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {field.enabled ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{field.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleRequired(field.field_name)}
                    disabled={!field.enabled || isReadOnly}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition ${
                      field.required && field.enabled
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 disabled:opacity-40'
                    }`}
                  >
                    <span>{field.required && field.enabled ? 'REQUIRED *' : 'OPTIONAL'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Label & Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-semibold">
                    Custom Field Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(field.field_name, 'label', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 font-semibold">
                    Custom Input Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(field.field_name, 'placeholder', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Select Options Manager for Dropdown fields like year_of_study */}
              {field.field_type === 'select' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold uppercase flex items-center space-x-1.5">
                      <List className="w-3.5 h-3.5" />
                      <span>Dropdown Choice Options ({field.options?.length || 0})</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((opt) => (
                      <span
                        key={opt}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-xs font-sans text-slate-200"
                      >
                        <span>{opt}</span>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(field.field_name, opt)}
                            className="text-slate-400 hover:text-rose-400 transition ml-1"
                            title="Remove Option"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {!isReadOnly && (
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        value={newOptionInputs[field.field_name] || ''}
                        onChange={(e) =>
                          setNewOptionInputs({ ...newOptionInputs, [field.field_name]: e.target.value })
                        }
                        placeholder="Add new option choice..."
                        className="flex-grow px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-sans"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOption(field.field_name);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddOption(field.field_name)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono font-bold flex items-center space-x-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        /* Live Form Preview Panel */
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-glass">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20 font-mono text-xs text-cyan-400">
            <span className="font-bold">// REAL-TIME LIVE PUBLIC FORM PREVIEW //</span>
            <span className="text-slate-400">Interactive Mock</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields
              .filter((f) => f.enabled)
              .sort((a, b) => a.order_index - b.order_index)
              .map((field) => (
                <div key={field.field_name} className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
                    {field.label}
                    {field.required && <span className="text-rose-400 ml-1 font-bold">*</span>}
                  </label>
                  {field.field_type === 'select' ? (
                    <select disabled className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-sm opacity-90">
                      <option>{field.placeholder || `Select ${field.label}`}</option>
                      {field.options?.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.field_type === 'textarea' ? (
                    <textarea disabled placeholder={field.placeholder} rows={2} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 text-sm opacity-80" />
                  ) : (
                    <input disabled type={field.field_type} placeholder={field.placeholder} className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 text-sm opacity-80" />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
