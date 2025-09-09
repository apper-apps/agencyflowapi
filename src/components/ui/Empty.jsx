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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <ApperIcon name={icon} className="w-12 h-12 text-white relative z-10" />
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">{title}</h3>
      <p className="text-slate-600 mb-10 max-w-md leading-relaxed">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary px-8 py-4 text-base flex items-center space-x-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 rounded-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  )
}

export default Empty