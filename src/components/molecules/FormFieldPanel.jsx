import React from "react"
import { useDrag } from "react-dnd"
import ApperIcon from "@/components/ApperIcon"

const FormFieldPanel = ({ onAddField }) => {
  const fieldTypes = [
    {
      type: "text",
      label: "Text Input",
      icon: "Type",
      description: "Single line text input"
    },
    {
      type: "textarea",
      label: "Textarea",
      icon: "AlignLeft",
      description: "Multi-line text input"
    },
    {
      type: "email",
      label: "Email",
      icon: "Mail",
      description: "Email address input"
    },
    {
      type: "phone",
      label: "Phone",
      icon: "Phone",
      description: "Phone number input"
    },
    {
      type: "number",
      label: "Number",
      icon: "Hash",
      description: "Numeric input"
    },
    {
      type: "select",
      label: "Select Dropdown",
      icon: "ChevronDown",
      description: "Dropdown selection"
    },
    {
      type: "radio",
      label: "Radio Buttons",
      icon: "Circle",
      description: "Single choice selection"
    },
    {
      type: "checkbox",
      label: "Checkboxes",
      icon: "Square",
      description: "Multiple choice selection"
    },
    {
      type: "date",
      label: "Date",
      icon: "Calendar",
      description: "Date picker"
    }
  ]

  const FieldItem = ({ fieldType }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "FORM_FIELD",
      item: { type: fieldType.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    })

    return (
<div
        ref={drag}
        onClick={() => onAddField(fieldType.type)}
        className={`p-4 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/20 cursor-pointer transition-all duration-200 group ${
          isDragging ? "opacity-50 scale-95" : ""
        }`}
      >
<div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-200 shadow-sm group-hover:shadow-md">
              <ApperIcon name={fieldType.icon} className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
<div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors duration-200">{fieldType.label}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{fieldType.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
<div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
        <div className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-4 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded mr-2"></div>
          Basic Fields
        </div>
        <div className="space-y-2">
          {fieldTypes.slice(0, 5).map((fieldType) => (
            <FieldItem key={fieldType.type} fieldType={fieldType} />
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/60">
        <div className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-4 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded mr-2"></div>
          Choice Fields
        </div>
        <div className="space-y-2">
          {fieldTypes.slice(5, 8).map((fieldType) => (
            <FieldItem key={fieldType.type} fieldType={fieldType} />
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/60">
        <div className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-4 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded mr-2"></div>
          Special Fields
        </div>
        <div className="space-y-2">
          {fieldTypes.slice(8).map((fieldType) => (
            <FieldItem key={fieldType.type} fieldType={fieldType} />
          ))}
        </div>
      </div>
      
<div className="mt-6 p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl border border-amber-200/60">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <ApperIcon name="Lightbulb" className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-amber-900 font-bold">Pro Tip</p>
            <p className="text-xs text-amber-700 mt-2 leading-relaxed">
              Click or drag fields to add them to your form. Customize each field in the settings panel to match your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormFieldPanel