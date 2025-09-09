import React from "react"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FormFieldConfig = ({ field, form, onFieldUpdate, onFormUpdate }) => {
  if (!field) {
    // Form Settings
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name
          </label>
          <Input
            value={form?.name || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter form name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={form?.description || ""}
            onChange={(e) => onFormUpdate(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional form description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submit Button Text
          </label>
          <Input
            value={form?.settings?.submitText || "Submit"}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, submitText: e.target.value }
            }))}
            placeholder="Submit button text"
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
            placeholder="Message shown after successful submission"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Theme
          </label>
          <Select
            value={form?.settings?.theme || "default"}
            onChange={(e) => onFormUpdate(prev => ({
              ...prev,
              settings: { ...prev.settings, theme: e.target.value }
            }))}
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="professional">Professional</option>
          </Select>
        </div>

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