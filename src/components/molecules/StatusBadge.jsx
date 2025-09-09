import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StatusBadge = ({ status, type = "default" }) => {
  const getStatusConfig = (status, type) => {
    const configs = {
      lead: {
        New: { variant: "info", icon: "Plus", text: "New" },
        Contacted: { variant: "warning", icon: "Phone", text: "Contacted" },
        "Proposal Sent": { variant: "primary", icon: "Send", text: "Proposal Sent" },
        "Closed Won": { variant: "success", icon: "CheckCircle", text: "Won" },
        "Closed Lost": { variant: "error", icon: "XCircle", text: "Lost" }
      },
      client: {
        Active: { variant: "success", icon: "CheckCircle", text: "Active" },
        Inactive: { variant: "error", icon: "XCircle", text: "Inactive" },
        "On Hold": { variant: "warning", icon: "Pause", text: "On Hold" }
      },
      project: {
        Planning: { variant: "info", icon: "Calendar", text: "Planning" },
        "In Progress": { variant: "warning", icon: "Clock", text: "In Progress" },
        Review: { variant: "primary", icon: "Eye", text: "Review" },
        Completed: { variant: "success", icon: "CheckCircle", text: "Completed" }
      },
      task: {
        "To Do": { variant: "info", icon: "Circle", text: "To Do" },
        "In Progress": { variant: "warning", icon: "Clock", text: "In Progress" },
        Completed: { variant: "success", icon: "CheckCircle", text: "Completed" }
      }
    }

    return configs[type]?.[status] || { variant: "default", icon: "Circle", text: status }
  }

  const config = getStatusConfig(status, type)

  return (
    <Badge variant={config.variant} className="inline-flex items-center">
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.text}
    </Badge>
  )
}

export default StatusBadge