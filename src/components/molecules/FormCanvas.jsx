import React from "react"
import { useDrop } from "react-dnd"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const FormCanvas = ({ 
  form, 
  onFieldSelect, 
  onFieldUpdate, 
  onFieldRemove, 
  onFieldsReorder, 
  selectedFieldId 
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_FIELD",
    drop: (item) => {
      // Handle field dropping logic if needed
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const renderField = (field, index) => {
    const isSelected = selectedFieldId === field.id

    return (
      <motion.div
        key={field.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative group p-4 border-2 rounded-lg transition-all cursor-pointer ${
          isSelected 
            ? "border-primary-500 bg-primary-50" 
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
        onClick={() => onFieldSelect(field)}
      >
        {/* Field Controls */}
        <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Move field up
              if (index > 0) {
                onFieldsReorder(index, index - 1)
              }
            }}
            className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded shadow-sm"
            disabled={index === 0}
          >
            <ApperIcon name="ChevronUp" size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Move field down
              if (index < form.fields.length - 1) {
                onFieldsReorder(index, index + 1)
              }
            }}
            className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded shadow-sm"
            disabled={index === form.fields.length - 1}
          >
            <ApperIcon name="ChevronDown" size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFieldRemove(field.id)
            }}
            className="p-1 text-red-400 hover:text-red-600 bg-white rounded shadow-sm"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>

        {/* Field Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {renderFieldPreview(field)}
          
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      </motion.div>
    )
  }

  const renderFieldPreview = (field) => {
    const baseInputClass = "w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={baseInputClass}
            disabled
          />
        )
      
      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            rows={3}
            className={baseInputClass}
            disabled
          />
        )
      
      case "select":
        return (
          <select className={baseInputClass} disabled>
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
                  className="mr-2 text-primary-500"
                  disabled
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
                  className="mr-2 text-primary-500 rounded"
                  disabled
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
            className={baseInputClass}
            disabled
          />
        )
      
      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className={baseInputClass}
            disabled
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

  return (
    <div
      ref={drop}
      className={`min-h-96 rounded-lg border-2 border-dashed transition-colors ${
        isOver 
          ? "border-primary-500 bg-primary-50" 
          : "border-gray-300 bg-white"
      }`}
    >
      {form.fields.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <ApperIcon name="MousePointer2" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
            <p className="text-gray-500 mb-4">
              Drag form fields from the left panel to start creating your form
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Form Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {form.name}
            </h2>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-8">
            {form.fields.map((field, index) => renderField(field, index))}
          </div>

          {/* Submit Button Preview */}
          <div className="pt-6 border-t border-gray-200">
            <Button className="pointer-events-none">
              {form.settings?.submitText || "Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormCanvas