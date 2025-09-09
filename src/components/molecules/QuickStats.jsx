import React from "react"
import ApperIcon from "@/components/ApperIcon"

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {stat.value}
              </p>
              {stat.change && (
                <p className={`text-sm ${stat.change >= 0 ? "text-success-600" : "text-error-600"} flex items-center mt-1`}>
                  <ApperIcon 
                    name={stat.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                    className="w-4 h-4 mr-1" 
                  />
                  {Math.abs(stat.change)}%
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
              <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats