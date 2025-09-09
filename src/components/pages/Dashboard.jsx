import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import Header from "@/components/organisms/Header"
import QuickStats from "@/components/molecules/QuickStats"
import StatusBadge from "@/components/molecules/StatusBadge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { leadService } from "@/services/api/leadService"
import { clientService } from "@/services/api/clientService"
import { projectService } from "@/services/api/projectService"
import { taskService } from "@/services/api/taskService"

const Dashboard = () => {
  const [data, setData] = useState({
    leads: [],
    clients: [],
    projects: [],
    tasks: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [leads, clients, projects, tasks] = await Promise.all([
        leadService.getAll(),
        clientService.getAll(),
        projectService.getAll(),
        taskService.getAll()
      ])

      setData({ leads, clients, projects, tasks })
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  // Calculate statistics
  const stats = [
    {
      title: "Active Projects",
      value: data.projects.filter(p => p.status === "In Progress").length,
      change: 12,
      icon: "Briefcase",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      title: "New Leads",
      value: data.leads.filter(l => l.status === "New").length,
      change: 8,
      icon: "Users",
      gradient: "from-secondary-500 to-secondary-600"
    },
    {
      title: "Active Clients",
      value: data.clients.filter(c => c.status === "Active").length,
      change: 5,
      icon: "Building",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      title: "Overdue Tasks",
      value: data.tasks.filter(t => 
        t.status !== "Completed" && 
        new Date(t.dueDate) < new Date()
      ).length,
      change: -15,
      icon: "AlertTriangle",
      gradient: "from-error-500 to-error-600"
    }
  ]

  // Get recent activity
  const recentActivity = [
    ...data.leads.slice(0, 3).map(lead => ({
      type: "lead",
      title: `New lead: ${lead.name}`,
      subtitle: lead.company,
      time: lead.createdAt,
      status: lead.status
    })),
    ...data.tasks.slice(0, 3).map(task => ({
      type: "task",
      title: `Task updated: ${task.title}`,
      subtitle: task.assignedTo,
      time: task.createdAt,
      status: task.status
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6)

  // Get upcoming deadlines
  const upcomingDeadlines = data.tasks
    .filter(task => task.status !== "Completed" && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  return (
<div className="h-full flex flex-col">
      <Header title="Dashboard" />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-10">
          {/* Quick Stats */}
          <QuickStats stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Recent Activity</h2>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ApperIcon name="Activity" className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200 border border-transparent hover:border-slate-200/40">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                      activity.type === "lead" ? "from-purple-500 to-pink-600" : "from-blue-500 to-indigo-600"
                    } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <ApperIcon 
                        name={activity.type === "lead" ? "Users" : "CheckSquare"} 
                        className="w-5 h-5 text-white" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate mb-1">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-600 mb-2">{activity.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">
                          {format(new Date(activity.time), "MMM d, HH:mm")}
                        </p>
                        <StatusBadge status={activity.status} type={activity.type} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Upcoming Deadlines</h2>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <ApperIcon name="Clock" className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-4">
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="CheckCircle" className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-slate-500 font-medium">No upcoming deadlines</p>
                  </div>
                ) : (
                  upcomingDeadlines.map((task) => (
                    <div key={task.Id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100/60 hover:border-slate-200/60 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-blue-50/30 transition-all duration-200">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 mb-2">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">{task.assignedTo}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {format(new Date(task.dueDate), "MMM d")}
                        </p>
                        <StatusBadge status={task.priority} type="priority" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Project Status Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Project Overview</h2>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <ApperIcon name="BarChart3" className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {["Planning", "In Progress", "Review", "Completed"].map((status) => {
                const count = data.projects.filter(p => p.status === status).length
                const percentage = data.projects.length > 0 ? (count / data.projects.length) * 100 : 0
                
                return (
                  <div key={status} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 hover:from-slate-100 hover:to-blue-100 transition-all duration-200 border border-slate-200/40 hover:border-slate-300/60 hover:scale-105 group">
                    <div className="text-3xl font-bold text-slate-900 mb-2">{count}</div>
                    <div className="text-sm font-semibold text-slate-600 mb-4">{status}</div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 group-hover:scale-110"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard