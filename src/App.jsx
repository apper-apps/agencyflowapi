import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Leads from "@/components/pages/Leads"
import Clients from "@/components/pages/Clients"
import Projects from "@/components/pages/Projects"
import Tasks from "@/components/pages/Tasks"
import ProposalTemplates from "@/components/pages/ProposalTemplates"
import Forms from "@/components/pages/Forms"

function App() {
  return (
    <BrowserRouter>
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
<Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="forms" element={<Forms />} />
            <Route path="templates" element={<ProposalTemplates />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App