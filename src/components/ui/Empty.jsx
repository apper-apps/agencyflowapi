import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item",
  actionText = "Create New",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-sm">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary px-6 py-3 text-base"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionText}
        </button>
      )}
    </div>
  )
}

export default Empty