import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-300/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input