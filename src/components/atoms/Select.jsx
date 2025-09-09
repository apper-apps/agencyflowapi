import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-300/50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = "Select"

export default Select