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
        <div className="space-y-8">
          {/* Quick Stats */}
          <QuickStats stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                      activity.type === "lead" ? "from-secondary-500 to-secondary-600" : "from-primary-500 to-primary-600"
                    } flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon 
                        name={activity.type === "lead" ? "User" : "CheckSquare"} 
                        className="w-4 h-4 text-white" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.subtitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
                <ApperIcon name="Clock" className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                ) : (
                  upcomingDeadlines.map((task) => (
                    <div key={task.Id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">{task.assignedTo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
              <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Planning", "In Progress", "Review", "Completed"].map((status) => {
                const count = data.projects.filter(p => p.status === status).length
                const percentage = data.projects.length > 0 ? (count / data.projects.length) * 100 : 0
                
                return (
                  <div key={status} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm text-gray-600 mb-2">{status}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
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