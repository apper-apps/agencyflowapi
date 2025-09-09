import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success-50 to-success-100 text-success-700 border border-success-200",
    warning: "bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border border-warning-200",
    error: "bg-gradient-to-r from-error-50 to-error-100 text-error-700 border border-error-200",
    info: "bg-gradient-to-r from-info-50 to-info-100 text-info-700 border border-info-200",
    primary: "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge