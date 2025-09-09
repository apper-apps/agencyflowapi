import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-60">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout