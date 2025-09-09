import React from "react"

const Loading = ({ className = "" }) => {
  return (
<div className={`animate-pulse space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
            <div className="h-5 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 rounded-xl w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 rounded-lg"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 rounded-lg w-5/6"></div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="h-8 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 rounded-full w-24"></div>
              <div className="h-10 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 rounded-xl w-28"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading