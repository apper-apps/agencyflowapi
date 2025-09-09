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
className={`relative group p-6 border-2 rounded-xl transition-all duration-200 cursor-pointer backdrop-blur-sm ${
          isSelected 
            ? "border-indigo-500 bg-gradient-to-br from-indigo-50/80 via-blue-50/60 to-purple-50/40 shadow-lg shadow-indigo-500/20" 
            : "border-slate-200 bg-white/80 hover:border-slate-300 hover:shadow-md hover:shadow-slate-300/20"
        }`}
        onClick={() => onFieldSelect(field)}
      >
        {/* Field Controls */}
        <div className={`absolute top-3 right-3 flex space-x-1.5 transition-all duration-200 ${
          isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Move field up
              if (index > 0) {
                onFieldsReorder(index, index - 1)
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
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
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            disabled={index === form.fields.length - 1}
          >
            <ApperIcon name="ChevronDown" size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFieldRemove(field.id)
            }}
            className="p-1.5 text-red-400 hover:text-red-600 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>

        {/* Field Preview */}
<div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 tracking-wide">
            {field.label}
            {field.required && <span className="text-red-500 ml-1 text-base">*</span>}
          </label>
          
          {renderFieldPreview(field)}
          
          {field.helpText && (
            <p className="text-xs text-slate-500 italic leading-relaxed">{field.helpText}</p>
          )}
        </div>
      </motion.div>
    )
  }

  const renderFieldPreview = (field) => {
const baseInputClass = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 bg-white/80 backdrop-blur-sm shadow-sm"

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
            className={baseInputClass + " resize-none"}
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
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  className="mr-3 text-indigo-500 w-4 h-4 transition-all duration-200"
                  disabled
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors duration-200">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case "checkbox":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  className="mr-3 text-indigo-500 w-4 h-4 rounded transition-all duration-200"
                  disabled
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors duration-200">{option}</span>
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
          <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl text-center text-slate-500 text-sm border border-slate-200/60">
            Unknown field type: {field.type}
          </div>
        )
    }
  }

  return (
<div
      ref={drop}
      className={`min-h-[600px] rounded-2xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm ${
        isOver 
          ? "border-indigo-500 bg-gradient-to-br from-indigo-50/80 via-blue-50/60 to-purple-50/40 shadow-lg shadow-indigo-500/20" 
          : "border-slate-300 bg-white/60 hover:bg-white/80 hover:border-slate-400"
      }`}
    >
{form.fields.length === 0 ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/10">
              <ApperIcon name="MousePointer2" className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">Start Building Your Form</h3>
            <p className="text-slate-500 mb-6 max-w-sm leading-relaxed">
              Drag form fields from the left panel to start creating your professional form
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6">
{/* Form Header */}
          <div className="mb-10 pb-8 border-b border-slate-200/60">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              {form.name}
            </h2>
            {form.description && (
              <p className="text-slate-600 leading-relaxed">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-10">
            {form.fields.map((field, index) => renderField(field, index))}
          </div>

          {/* Submit Button Preview */}
          <div className="pt-8 border-t border-slate-200/60 bg-gradient-to-r from-white/60 to-slate-50/40 rounded-xl p-6 -mx-6">
            <Button className="pointer-events-none shadow-lg shadow-indigo-500/20">
              {form.settings?.submitText || "Submit"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormCanvas