import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/25">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-red-900 bg-clip-text text-transparent mb-3">Oops! Something went wrong</h3>
      <p className="text-slate-600 mb-8 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary px-6 py-3 text-base flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default Error