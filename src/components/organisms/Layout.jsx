import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  return (
<div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Sidebar />
      
      {/* Main content */}
<div className="flex flex-col flex-1 lg:pl-60 backdrop-blur-sm">
        <main className="flex-1 overflow-auto bg-gradient-to-b from-transparent to-slate-50/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout