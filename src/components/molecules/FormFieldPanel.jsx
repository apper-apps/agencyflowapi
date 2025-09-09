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
        className={`p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-primary-300 cursor-pointer transition-all group ${
          isDragging ? "opacity-50 scale-95" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <ApperIcon name={fieldType.icon} className="w-4 h-4 text-primary-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">{fieldType.label}</h4>
            <p className="text-xs text-gray-500 mt-1">{fieldType.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">
        Basic Fields
      </div>
      
      {fieldTypes.slice(0, 5).map((fieldType) => (
        <FieldItem key={fieldType.type} fieldType={fieldType} />
      ))}
      
      <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3 mt-6">
        Choice Fields
      </div>
      
      {fieldTypes.slice(5, 8).map((fieldType) => (
        <FieldItem key={fieldType.type} fieldType={fieldType} />
      ))}
      
      <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3 mt-6">
        Special Fields
      </div>
      
      {fieldTypes.slice(8).map((fieldType) => (
        <FieldItem key={fieldType.type} fieldType={fieldType} />
      ))}
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <ApperIcon name="Info" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-700 font-medium">Pro Tip</p>
            <p className="text-xs text-blue-600 mt-1">
              Click or drag fields to add them to your form. Customize each field in the settings panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormFieldPanel