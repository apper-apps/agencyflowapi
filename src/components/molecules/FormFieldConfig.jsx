import React from "react"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FormFieldConfig = ({ field, form, onFieldUpdate, onFormUpdate, isTemplate = false }) => {
if (!field) {
    // Template/Form Settings
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isTemplate ? 'Template Name' : 'Form Name'}
          </label>
          <Input
            value={form?.name || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, name: e.target.value }))}
            placeholder={isTemplate ? "Enter template name" : "Enter form name"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={form?.description || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, description: e.target.value }))}
            placeholder={isTemplate ? "Template description" : "Optional form description"}
          />
        </div>

        {isTemplate && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select
                value={form?.category || "consulting"}
                onChange={(e) => onFormUpdate(prev => ({ ...prev, category: e.target.value }))}
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
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Palette" className="w-4 h-4 mr-2" />
                Branding & Layout
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form?.branding?.primaryColor || "#4F46E5"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <Input
                      value={form?.branding?.primaryColor || "#4F46E5"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      placeholder="#4F46E5"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={form?.branding?.secondaryColor || "#7C3AED"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      className="w-8 h-8 rounded border border-gray-300"
                    />
                    <Input
                      value={form?.branding?.secondaryColor || "#7C3AED"}
                      onChange={(e) => onFormUpdate(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      placeholder="#7C3AED"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <Select
                    value={form?.branding?.fontFamily || "Inter"}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, fontFamily: e.target.value }
                    }))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Position
                  </label>
                  <Select
                    value={form?.branding?.logoPosition || "top-left"}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, logoPosition: e.target.value }
                    }))}
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="center">Center</option>
                  </Select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="letterhead"
                    checked={form?.branding?.letterhead || false}
                    onChange={(e) => onFormUpdate(prev => ({
                      ...prev,
                      branding: { ...prev.branding, letterhead: e.target.checked }
                    }))}
                    className="mr-2 text-primary-500 rounded"
                  />
                  <label htmlFor="letterhead" className="text-sm text-gray-700">
                    Include company letterhead
                  </label>
                </div>
              </div>
            </div>

            {/* Content Placeholders */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Code" className="w-4 h-4 mr-2" />
                Content Placeholders
              </h4>
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-2">
                  Use these placeholders in your content that will be replaced when generating proposals:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[CLIENT_NAME]</div>
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[COMPANY_NAME]</div>
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[PROJECT_NAME]</div>
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[DATE]</div>
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[PROPOSAL_NUMBER]</div>
                  <div className="bg-gray-50 px-2 py-1 rounded font-mono">[TOTAL_AMOUNT]</div>
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isTemplate ? 'Accept Button Text' : 'Submit Button Text'}
          </label>
          <Input
            value={form?.settings?.submitText || (isTemplate ? "Accept Proposal" : "Submit")}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, submitText: e.target.value }
            }))}
            placeholder={isTemplate ? "Accept Proposal" : "Submit button text"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Success Message
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={form?.settings?.successMessage || ""}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, successMessage: e.target.value }
            }))}
            placeholder={isTemplate ? "Thank you! We'll be in touch soon." : "Message shown after successful submission"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <Select
            value={form?.settings?.theme || (isTemplate ? "professional" : "default")}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, theme: e.target.value }
            }))}
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="professional">Professional</option>
            <option value="elegant">Elegant</option>
          </Select>
        </div>

        {!isTemplate && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowMultiple"
              checked={form?.settings?.allowMultiple || false}
              onChange={(e) => onFormUpdate(prev => ({
                ...prev,
                settings: { ...prev.settings, allowMultiple: e.target.checked }
              }))}
              className="mr-2 text-primary-500 rounded"
            />
            <label htmlFor="allowMultiple" className="text-sm text-gray-700">
              Allow multiple submissions from same user
            </label>
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
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Settings" className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium text-gray-900 capitalize">
            {field.type} Field Settings
          </h4>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field Label
        </label>
        <Input
          value={field.label}
          onChange={(e) => updateField({ label: e.target.value })}
          placeholder="Enter field label"
        />
      </div>

      {field.type !== "checkbox" && field.type !== "radio" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholder Text
          </label>
          <Input
            value={field.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Help Text
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={2}
          value={field.helpText || ""}
          onChange={(e) => updateField({ helpText: e.target.value })}
          placeholder="Optional help text"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={field.required || false}
          onChange={(e) => updateField({ required: e.target.checked })}
          className="mr-2 text-primary-500 rounded"
        />
        <label htmlFor="required" className="text-sm text-gray-700">
          Required field
        </label>
      </div>

      {hasOptions && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            <Button
              size="sm"
              variant="ghost"
              onClick={addOption}
              icon="Plus"
            >
              Add Option
            </Button>
          </div>
          
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                  icon="Trash2"
                  className="text-red-500 hover:text-red-700"
                />
              </div>
            ))}
          </div>
          
          {(!field.options || field.options.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">
              No options added yet
            </p>
          )}
        </div>
      )}

      {field.type === "number" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Value
            </label>
            <Input
              type="number"
              value={field.min || ""}
              onChange={(e) => updateField({ min: e.target.value })}
              placeholder="Min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Value
            </label>
            <Input
              type="number"
              value={field.max || ""}
              onChange={(e) => updateField({ max: e.target.value })}
              placeholder="Max"
            />
          </div>
        </div>
      )}

      {field.type === "textarea" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rows
          </label>
          <Select
            value={field.rows || 3}
            onChange={(e) => updateField({ rows: parseInt(e.target.value) })}
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