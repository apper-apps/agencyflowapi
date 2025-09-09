import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"

const SearchBar = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const [query, setQuery] = useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
<div className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<ApperIcon name="Search" className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
onChange={handleSearch}
        className="pl-10 pr-4 h-11 bg-white/90 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-indigo-300 focus:ring-indigo-500/20 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-300/50"
      />
    </div>
  )
}

export default SearchBar