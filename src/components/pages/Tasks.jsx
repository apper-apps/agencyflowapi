import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { format } from "date-fns"
import Header from "@/components/organisms/Header"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/organisms/Modal"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import StatusBadge from "@/components/molecules/StatusBadge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    projectId: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    status: "To Do"
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [taskData, projectData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(taskData)
      setProjects(projectData)
      setFilteredTasks(taskData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSearch = (query) => {
    if (!query) {
      setFilteredTasks(tasks)
      return
    }
    
    const filtered = tasks.filter(task => {
      const project = projects.find(p => p.Id === task.projectId)
      return (
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(query.toLowerCase()) ||
        project?.name.toLowerCase().includes(query.toLowerCase())
      )
    })
    setFilteredTasks(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const taskData = {
        ...formData,
        projectId: parseInt(formData.projectId)
      }
      
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData)
        toast.success("Task updated successfully")
      } else {
        await taskService.create(taskData)
        toast.success("Task created successfully")
      }
      setIsModalOpen(false)
      setEditingTask(null)
      setFormData({
        title: "",
        projectId: "",
        assignedTo: "",
        priority: "Medium",
        dueDate: "",
        status: "To Do"
      })
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      projectId: task.projectId.toString(),
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
      status: task.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (task) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(task.Id)
        toast.success("Task deleted successfully")
        loadData()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const handleMarkComplete = async (task) => {
    try {
      await taskService.markComplete(task.Id)
      toast.success("Task marked as completed")
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const columns = [
    {
      key: "title",
      title: "Task",
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: "projectId",
      title: "Project",
      render: (value) => {
        const project = projects.find(p => p.Id === value)
        return (
          <span className="text-gray-600">{project?.name || "Unknown"}</span>
        )
      }
    },
    {
      key: "assignedTo",
      title: "Assigned To",
      render: (value) => (
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-2">
            <ApperIcon name="User" className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-700">{value}</span>
        </div>
      )
    },
    {
      key: "priority",
      title: "Priority",
      render: (value) => {
        const colors = {
          High: "error",
          Medium: "warning",
          Low: "info"
        }
        return <StatusBadge status={value} type="priority" />
      }
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} type="task" />
    },
    {
      key: "dueDate",
      title: "Due Date",
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-gray-400">No due date</span>
        const dueDate = new Date(value)
        const isOverdue = dueDate < new Date() && value !== "Completed"
        return (
          <span className={`text-sm ${isOverdue ? "text-error-600 font-medium" : "text-gray-500"}`}>
            {format(dueDate, "MMM d, yyyy")}
          </span>
        )
      }
    }
  ]

  const actions = [
    {
      label: "Complete",
      icon: "CheckCircle",
      onClick: handleMarkComplete
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="h-full flex flex-col">
      <Header title="Tasks" onSearch={handleSearch} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Task Management
            </h2>
            <p className="text-gray-600">
              Assign tasks, track progress, and meet deadlines
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null)
              setFormData({
                title: "",
                projectId: "",
                assignedTo: "",
                priority: "Medium",
                dueDate: "",
                status: "To Do"
              })
              setIsModalOpen(true)
            }}
            icon="Plus"
          >
            Add Task
          </Button>
        </div>

        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description="Break down your projects into manageable tasks"
            actionText="Add Task"
            icon="CheckSquare"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable
            data={filteredTasks}
            columns={columns}
            actions={actions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No tasks match your search"
          />
        )}

        {/* Task Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTask ? "Edit Task" : "Add New Task"}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="submit"
              form="task-form"
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          ]}
        >
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <Select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.Id} value={project.Id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To *
                </label>
                <Select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select team member</option>
                  <option value="Development Team">Development Team</option>
                  <option value="Design Team">Design Team</option>
                  <option value="Marketing Team">Marketing Team</option>
                  <option value="Content Team">Content Team</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Tasks