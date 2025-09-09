import React, { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Leads", href: "/leads", icon: "Users" },
    { name: "Clients", href: "/clients", icon: "Building" },
    { name: "Projects", href: "/projects", icon: "Briefcase" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Forms", href: "/forms", icon: "FileText" },
    { name: "Templates", href: "/templates", icon: "FileTemplate" }
  ]

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  // Desktop Sidebar
  const DesktopSidebar = () => (
<div className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 z-30">
      <div className="flex flex-col flex-grow bg-gradient-to-b from-white via-slate-50 to-white border-r border-slate-200/60 pt-6 pb-4 overflow-y-auto shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
        <div className="flex items-center flex-shrink-0 px-6 mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/25 ring-2 ring-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <ApperIcon name="Zap" className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                AgencyFlow
              </h1>
              <p className="text-xs text-indigo-600 font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-0.5 rounded-full inline-block">Pro</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
<nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-indigo-700 shadow-lg shadow-indigo-500/10 border border-indigo-200/50 backdrop-blur-sm"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                  )}
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 h-5 w-5 transition-all duration-200 ${
                      isActive ? "text-indigo-600 scale-110" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-105"
                    }`}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileOpen && (
<>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-md"
            onClick={toggleMobile}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white via-slate-50 to-white shadow-2xl shadow-slate-900/20 border-r border-slate-200"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between flex-shrink-0 px-6 py-6 border-b border-slate-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/25 ring-2 ring-white/50">
                    <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                      AgencyFlow
                    </h1>
                    <p className="text-xs text-indigo-600 font-medium bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-0.5 rounded-full inline-block">Pro</p>
                  </div>
                </div>
                <button
                  onClick={toggleMobile}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
              
<nav className="flex-1 px-4 pb-4 space-y-2 pt-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={toggleMobile}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-indigo-700 shadow-lg shadow-indigo-500/10 border border-indigo-200/50"
                          : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-900 hover:shadow-md hover:shadow-slate-200/50"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                      )}
                      <ApperIcon
                        name={item.icon}
                        className={`mr-3 h-5 w-5 transition-all duration-200 ${
                          isActive ? "text-indigo-600 scale-110" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {item.name}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
      
      {/* Mobile menu button */}
<div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleMobile}
          className="bg-white/80 backdrop-blur-xl p-3 rounded-xl shadow-lg shadow-slate-900/10 border border-white/60 text-slate-600 hover:text-slate-900 hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Menu" className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}

export default Sidebar