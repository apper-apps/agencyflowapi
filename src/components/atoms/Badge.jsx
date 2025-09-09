import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
default: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-sm",
    success: "bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 text-emerald-700 border border-emerald-200/60 shadow-sm shadow-emerald-500/10",
    warning: "bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 text-amber-700 border border-amber-200/60 shadow-sm shadow-amber-500/10",
    error: "bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 text-red-700 border border-red-200/60 shadow-sm shadow-red-500/10",
    info: "bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 text-blue-700 border border-blue-200/60 shadow-sm shadow-blue-500/10",
    primary: "bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 text-indigo-700 border border-indigo-200/60 shadow-sm shadow-indigo-500/10"
  }

  return (
    <span
className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ring-1 ring-white/20",
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