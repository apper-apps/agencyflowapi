import React from "react"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FormFieldConfig = ({ field, form, onFieldUpdate, onFormUpdate, isTemplate = false }) => {
if (!field) {
    // Template/Form Settings
    return (
<div className="space-y-8">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            {isTemplate ? 'Template Name' : 'Form Name'}
          </label>
          <Input
            value={form?.name || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, name: e.target.value }))}
            placeholder={isTemplate ? "Enter template name" : "Enter form name"}
            className="bg-white/80"
          />
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 shadow-sm resize-none"
            rows={4}
            value={form?.description || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, description: e.target.value }))}
            placeholder={isTemplate ? "Template description" : "Optional form description"}
          />
        </div>

        {isTemplate && (
          <>
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Category
              </label>
              <Select
                value={form?.category || "consulting"}
                onChange={(e) => onFormUpdate(prev => ({ ...prev, category: e.target.value }))}
                className="bg-white/80"
              >
                <option value="web-design">Web Design</option>
                <option value="marketing">Marketing</option>
                <option value="consulting">Consulting</option>
                <option value="development">Development</option>
                <option value="branding">Branding</option>
                <option value="seo">SEO Services</option>
              </Select>
            </div>

            {/* Branding Section */}
<div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200/60">
              <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
                  <ApperIcon name="Palette" className="w-4 h-4 text-white" />
                </div>
                Branding & Layout
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={form?.branding?.primaryColor || "#4F46E5"}
                        onChange={(e) => onFormUpdate(prev => ({
                          ...prev,
                          branding: { ...prev.branding, primaryColor: e.target.value }
                        }))}
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-lg cursor-pointer"
                      />
                    </div>
                    <Input
                      value={form?.branding?.primaryColor || "#4F46E5"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      placeholder="#4F46E5"
                      className="flex-1 bg-white/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={form?.branding?.secondaryColor || "#7C3AED"}
                        onChange={(e) => onFormUpdate(prev => ({
                          ...prev,
                          branding: { ...prev.branding, secondaryColor: e.target.value }
                        }))}
                        className="w-10 h-10 rounded-xl border-2 border-white shadow-lg cursor-pointer"
                      />
                    </div>
                    <Input
                      value={form?.branding?.secondaryColor || "#7C3AED"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      placeholder="#7C3AED"
                      className="flex-1 bg-white/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Font Family
                  </label>
                  <Select
                    value={form?.branding?.fontFamily || "Inter"}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, fontFamily: e.target.value }
                    }))}
                    className="bg-white/80"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Lato">Lato</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Logo Position
                  </label>
                  <Select
                    value={form?.branding?.logoPosition || "top-left"}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, logoPosition: e.target.value }
                    }))}
                    className="bg-white/80"
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="center">Center</option>
                  </Select>
                </div>

                <div className="flex items-center bg-white/60 rounded-lg p-4 border border-white/40">
                  <input
                    type="checkbox"
                    id="letterhead"
                    checked={form?.branding?.letterhead || false}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, letterhead: e.target.checked }
                    }))}
                    className="mr-3 text-indigo-500 w-4 h-4 rounded focus:ring-indigo-500/20"
                  />
                  <label htmlFor="letterhead" className="text-sm font-medium text-slate-700">
                    Include company letterhead
                  </label>
                </div>
              </div>
            </div>

{/* Content Placeholders */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200/60">
              <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/20">
                  <ApperIcon name="Code" className="w-4 h-4 text-white" />
                </div>
                Content Placeholders
              </h4>
              <div className="space-y-4">
                <div className="text-sm text-slate-600 leading-relaxed">
                  Use these placeholders in your content that will be replaced when generating proposals:
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[CLIENT_NAME]</div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[COMPANY_NAME]</div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[PROJECT_NAME]</div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[DATE]</div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[PROPOSAL_NUMBER]</div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-mono border border-emerald-200/40 shadow-sm">[TOTAL_AMOUNT]</div>
                </div>
              </div>
            </div>
          </>
        )}

<div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            {isTemplate ? 'Accept Button Text' : 'Submit Button Text'}
          </label>
          <Input
            value={form?.settings?.submitText || (isTemplate ? "Accept Proposal" : "Submit")}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, submitText: e.target.value }
            }))}
            placeholder={isTemplate ? "Accept Proposal" : "Submit button text"}
            className="bg-white/80"
          />
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Success Message
          </label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 shadow-sm resize-none"
            rows={4}
            value={form?.settings?.successMessage || ""}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, successMessage: e.target.value }
            }))}
            placeholder={isTemplate ? "Thank you! We'll be in touch soon." : "Message shown after successful submission"}
          />
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Theme
          </label>
          <Select
            value={form?.settings?.theme || (isTemplate ? "professional" : "default")}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, theme: e.target.value }
            }))}
            className="bg-white/80"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="professional">Professional</option>
            <option value="elegant">Elegant</option>
          </Select>
        </div>

{!isTemplate && (
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowMultiple"
                checked={form?.settings?.allowMultiple || false}
                onChange={(e) => onFormUpdate(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allowMultiple: e.target.checked }
                }))}
                className="mr-3 text-indigo-500 w-4 h-4 rounded focus:ring-indigo-500/20"
              />
              <label htmlFor="allowMultiple" className="text-sm font-medium text-slate-700">
                Allow multiple submissions from same user
              </label>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Field Settings
  const updateField = (updates) => {
    onFieldUpdate(field.id, updates)
  }

  const addOption = () => {
    const currentOptions = field.options || []
    updateField({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    })
  }

  const updateOption = (index, value) => {
    const newOptions = [...(field.options || [])]
    newOptions[index] = value
    updateField({ options: newOptions })
  }

  const removeOption = (index) => {
    const newOptions = [...(field.options || [])]
    newOptions.splice(index, 1)
    updateField({ options: newOptions })
  }

  const hasOptions = ["select", "radio", "checkbox"].includes(field.type)

  return (
<div className="space-y-6">
      <div className="pb-6 border-b border-slate-200/60 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ApperIcon name="Settings" className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-bold text-slate-900 capitalize text-lg">
            {field.type} Field Settings
          </h4>
        </div>
      </div>

<div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Field Label
        </label>
        <Input
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
          placeholder="Enter field label"
          className="bg-white/80"
        />
      </div>

      {field.type !== "checkbox" && field.type !== "radio" && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Placeholder Text
          </label>
          <Input
            value={field.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="bg-white/80"
          />
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Help Text
        </label>
        <textarea
          className="w-full px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 shadow-sm resize-none"
          rows={3}
          value={field.helpText || ""}
          onChange={(e) => updateField({ helpText: e.target.value })}
          placeholder="Optional help text"
        />
      </div>

<div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={field.required || false}
            onChange={(e) => updateField({ required: e.target.checked })}
            className="mr-3 text-indigo-500 w-4 h-4 rounded focus:ring-indigo-500/20"
          />
          <label htmlFor="required" className="text-sm font-medium text-slate-700">
            Required field
          </label>
        </div>
      </div>

{hasOptions && (
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-6 border border-amber-200/60">
          <div className="flex items-center justify-between mb-6">
            <label className="block text-sm font-bold text-slate-700 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                <ApperIcon name="List" className="w-3 h-3 text-white" />
              </div>
              Options
            </label>
            <Button
              size="sm"
              variant="secondary"
              onClick={addOption}
              icon="Plus"
              className="bg-white/80 hover:bg-white border-amber-200/60"
            >
              Add Option
            </Button>
          </div>
          
          <div className="space-y-3">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/60 rounded-lg p-3 border border-white/40">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="bg-white/80 flex-1"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  icon="Trash2"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                />
              </div>
            ))}
          </div>
          
          {(!field.options || field.options.length === 0) && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Plus" className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm text-slate-500">
                No options added yet
              </p>
            </div>
          )}
        </div>
      )}

{field.type === "number" && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Minimum Value
              </label>
              <Input
                type="number"
                value={field.min || ""}
                onChange={(e) => updateField({ min: e.target.value })}
                placeholder="Min"
                className="bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Maximum Value
              </label>
              <Input
                type="number"
                value={field.max || ""}
                onChange={(e) => updateField({ max: e.target.value })}
                placeholder="Max"
                className="bg-white/80"
              />
            </div>
          </div>
        </div>
      )}

{field.type === "textarea" && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/60">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Rows
          </label>
          <Select
            value={field.rows || 3}
            onChange={(e) => updateField({ rows: parseInt(e.target.value) })}
            className="bg-white/80"
          >
            <option value={2}>2 rows</option>
            <option value={3}>3 rows</option>
            <option value={4}>4 rows</option>
            <option value={5}>5 rows</option>
            <option value={6}>6 rows</option>
          </Select>
        </div>
      )}
    </div>
  )
}

export default FormFieldConfig