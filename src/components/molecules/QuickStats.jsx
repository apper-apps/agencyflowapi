import React from "react"
import ApperIcon from "@/components/ApperIcon"

const QuickStats = ({ stats }) => {
  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-300/50 hover:border-slate-300/60 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600 mb-3 tracking-wide">{stat.title}</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                {stat.value}
              </p>
              {stat.change && (
<div className={`text-sm font-medium ${stat.change >= 0 ? "text-emerald-600" : "text-red-600"} flex items-center`}>
                  <div className={`w-5 h-5 rounded-full ${stat.change >= 0 ? "bg-emerald-100" : "bg-red-100"} flex items-center justify-center mr-2`}>
                    <ApperIcon 
                      name={stat.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                      className="w-3 h-3" 
                    />
                  </div>
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-200`}>
              <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats