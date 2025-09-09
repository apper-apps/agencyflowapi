import React, { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"

const DataTable = ({ 
  data = [], 
  columns = [], 
  actions = [],
  onEdit,
  onDelete,
  emptyMessage = "No data available"
}) => {
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredData = data.filter(item => {
    if (!filterStatus) return true
    return item.status === filterStatus
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    
    const aVal = a[sortField]
    const bVal = b[sortField]
    
    if (typeof aVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    return sortDirection === "asc" ? aVal - bVal : bVal - aVal
  })

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        >
          <option value="">All Status</option>
          {[...new Set(data.map(item => item.status))].map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
<thead className="bg-gradient-to-r from-slate-50 to-blue-50 backdrop-blur-sm">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-100 transition-all duration-200" : ""
                    }`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.title}</span>
                      {column.sortable && sortField === column.key && (
                        <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
                            className="w-3 h-3 text-white" 
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
{sortedData.map((item, index) => (
                <motion.tr
                  key={item.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200 border-b border-slate-100/60"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-700">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      {actions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          icon={action.icon}
                          onClick={() => action.onClick(item)}
                          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-lg"
                        >
                          {action.label}
                        </Button>
                      ))}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => onEdit(item)}
                          className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg"
                        />
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => onDelete(item)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50/60 rounded-lg"
                        />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataTable