import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  className,
  variant = "primary",
  size = "md",
  children,
  icon,
  loading = false,
  ...props 
}, ref) => {
  const variants = {
primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 ring-1 ring-white/20",
    secondary: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 shadow-md shadow-slate-200/50 hover:shadow-lg hover:shadow-slate-300/50",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:shadow-md hover:shadow-slate-200/50",
    accent: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30",
    success: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30",
    error: "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      className={cn(
"inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 backdrop-blur-sm",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      ) : icon ? (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button