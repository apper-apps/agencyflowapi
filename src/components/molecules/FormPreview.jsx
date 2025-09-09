import React, { useState } from "react"
import Modal from "@/components/organisms/Modal"
import Button from "@/components/atoms/Button"
import { toast } from "react-toastify"

const FormPreview = ({ isOpen, onClose, form }) => {
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => !formData[field.id])

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.map(f => f.label).join(", ")}`)
      setSubmitting(false)
      return
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(form.settings?.successMessage || "Form submitted successfully!")
      setFormData({})
    } catch (error) {
      toast.error("Failed to submit form")
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormField = (field) => {

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
          />
        )
      
      case "textarea":
        return (
          <textarea
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={baseInputClass}
            required={field.required}
          />
        )
      
      case "number":
        return (
          <input
            type="number"
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className={baseInputClass}
            required={field.required}
          />
        )
      
      case "select":
        return (
          <select
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClass}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mr-2 text-primary-500"
                  required={field.required}
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = formData[field.id] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option)
                    handleInputChange(field.id, newValues)
                  }}
                  className="mr-2 text-primary-500 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case "date":
        return (
          <input
            type="date"
            id={field.id}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClass}
            required={field.required}
          />
        )
      
      default:
        return (
          <div className="p-3 bg-gray-100 rounded-md text-center text-gray-500 text-sm">
            Unknown field type: {field.type}
          </div>
        )
    }
  }

  const getThemeClasses = () => {
    const theme = form?.settings?.theme || "default"
    
    switch (theme) {
      case "minimal":
        return {
          container: "space-y-4",
          field: "border-b border-gray-200 pb-2",
          label: "text-sm text-gray-600",
          input: "border-none border-b border-gray-200 rounded-none focus:ring-0 focus:border-gray-400"
        }
      case "modern":
        return {
          container: "space-y-6",
          field: "bg-gray-50 p-4 rounded-xl",
          label: "text-sm font-medium text-gray-800",
          input: "bg-transparent border-2 border-gray-200 focus:border-primary-400"
        }
      case "professional":
        return {
          container: "space-y-5",
          field: "border border-gray-200 p-4 rounded-lg bg-white shadow-sm",
          label: "text-sm font-semibold text-gray-700 uppercase tracking-wide",
          input: "border border-gray-300 focus:border-primary-500 shadow-sm"
        }
default:
        const baseInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        return {
          container: "space-y-6",
          field: "",
          label: "text-sm font-medium text-gray-700",
          input: baseInputClass
        }
    }
  }

  if (!form) return null

  const themeClasses = getThemeClasses()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Form Preview"
    >
      <div className="max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
            {form.description && (
              <p className="text-gray-600 mt-1">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className={themeClasses.container}>
            {form.fields.map((field) => (
              <div key={field.id} className={themeClasses.field}>
                <label 
                  htmlFor={field.id}
                  className={`block mb-2 ${themeClasses.label}`}
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderFormField(field)}
                
                {field.helpText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <Button
                type="submit"
                loading={submitting}
                disabled={form.fields.length === 0}
              >
                {form.settings?.submitText || "Submit"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormData({})}
              >
                Clear Form
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default FormPreview