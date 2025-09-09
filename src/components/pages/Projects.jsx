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
import { projectService } from "@/services/api/projectService"
import { clientService } from "@/services/api/clientService"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    description: "",
    status: "Planning",
    startDate: "",
    dueDate: ""
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectData, clientData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll()
      ])
      setProjects(projectData)
      setClients(clientData)
      setFilteredProjects(projectData)
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
      setFilteredProjects(projects)
      return
    }
    
    const filtered = projects.filter(project => {
      const client = clients.find(c => c.Id === project.clientId)
      return (
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        client?.company.toLowerCase().includes(query.toLowerCase())
      )
    })
    setFilteredProjects(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        clientId: parseInt(formData.clientId)
      }
      
      if (editingProject) {
        await projectService.update(editingProject.Id, projectData)
        toast.success("Project updated successfully")
      } else {
        await projectService.create(projectData)
        toast.success("Project created successfully")
      }
      setIsModalOpen(false)
      setEditingProject(null)
      setFormData({
        name: "",
        clientId: "",
        description: "",
        status: "Planning",
        startDate: "",
        dueDate: ""
      })
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      clientId: project.clientId.toString(),
      description: project.description,
      status: project.status,
      startDate: project.startDate ? format(new Date(project.startDate), "yyyy-MM-dd") : "",
      dueDate: project.dueDate ? format(new Date(project.dueDate), "yyyy-MM-dd") : ""
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (project) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.delete(project.Id)
        toast.success("Project deleted successfully")
        loadData()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const columns = [
    {
      key: "name",
      title: "Project",
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: "clientId",
      title: "Client",
      render: (value) => {
        const client = clients.find(c => c.Id === value)
        return (
          <div>
            <span className="text-gray-900">{client?.company || "Unknown"}</span>
            <p className="text-sm text-gray-500">{client?.name}</p>
          </div>
        )
      }
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} type="project" />
    },
    {
      key: "startDate",
      title: "Start Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? format(new Date(value), "MMM d, yyyy") : "Not set"}
        </span>
      )
    },
    {
      key: "dueDate",
      title: "Due Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? format(new Date(value), "MMM d, yyyy") : "Not set"}
        </span>
      )
    },
    {
      key: "tasks",
      title: "Tasks",
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value?.length || 0} tasks
        </span>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="h-full flex flex-col">
      <Header title="Projects" onSearch={handleSearch} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Project Management
            </h2>
            <p className="text-gray-600">
              Track project progress and manage deliverables
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingProject(null)
              setFormData({
                name: "",
                clientId: "",
                description: "",
                status: "Planning",
                startDate: "",
                dueDate: ""
              })
              setIsModalOpen(true)
            }}
            icon="Plus"
          >
            Add Project
          </Button>
        </div>

        {filteredProjects.length === 0 ? (
          <Empty
            title="No projects found"
            description="Start managing your work by creating your first project"
            actionText="Add Project"
            icon="Briefcase"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable
            data={filteredProjects}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No projects match your search"
          />
        )}

        {/* Project Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProject ? "Edit Project" : "Add New Project"}
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
              form="project-form"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          ]}
        >
          <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client *
              </label>
              <Select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.Id} value={client.Id}>
                    {client.company} - {client.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description and scope"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
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
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Projects