import React from "react"
import SearchBar from "@/components/molecules/SearchBar"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ title, onSearch }) => {
  return (
<header className="bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-white/20 px-6 py-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
<h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearch && (
            <SearchBar
              onSearch={onSearch}
              placeholder="Search..."
              className="w-64"
            />
          )}
          
          <div className="flex items-center space-x-2">
<button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:scale-105 border border-transparent hover:border-white/60">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:scale-105 border border-transparent hover:border-white/60">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-white/50 hover:scale-105 transition-transform duration-200">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header