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
import { clientService } from "@/services/api/clientService"

const Clients = () => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Active"
  })

  const loadClients = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await clientService.getAll()
      setClients(data)
      setFilteredClients(data)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleSearch = (query) => {
    if (!query) {
      setFilteredClients(clients)
      return
    }
    
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.company.toLowerCase().includes(query.toLowerCase()) ||
      client.email.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredClients(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingClient) {
        await clientService.update(editingClient.Id, formData)
        toast.success("Client updated successfully")
      } else {
        await clientService.create(formData)
        toast.success("Client created successfully")
      }
      setIsModalOpen(false)
      setEditingClient(null)
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Active"
      })
      loadClients()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (client) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientService.delete(client.Id)
        toast.success("Client deleted successfully")
        loadClients()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const columns = [
    {
      key: "name",
      title: "Name",
      sortable: true,
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: "company",
      title: "Company",
      sortable: true,
      render: (value) => <span className="text-gray-600">{value}</span>
    },
    {
      key: "email",
      title: "Email",
      render: (value) => (
        <a href={`mailto:${value}`} className="text-primary-600 hover:text-primary-800">
          {value}
        </a>
      )
    },
    {
      key: "phone",
      title: "Phone",
      render: (value) => (
        <a href={`tel:${value}`} className="text-gray-600 hover:text-gray-800">
          {value}
        </a>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} type="client" />
    },
    {
      key: "projects",
      title: "Projects",
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value?.length || 0} projects
        </span>
      )
    },
    {
      key: "createdAt",
      title: "Added",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {format(new Date(value), "MMM d, yyyy")}
        </span>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadClients} />

  return (
    <div className="h-full flex flex-col">
      <Header title="Clients" onSearch={handleSearch} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Client Management
            </h2>
            <p className="text-gray-600">
              Manage your client relationships and project assignments
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingClient(null)
              setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                status: "Active"
              })
              setIsModalOpen(true)
            }}
            icon="Plus"
          >
            Add Client
          </Button>
        </div>

        {filteredClients.length === 0 ? (
          <Empty
            title="No clients found"
            description="Start building your client base by adding your first client"
            actionText="Add Client"
            icon="Building"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable
            data={filteredClients}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No clients match your search"
          />
        )}

        {/* Client Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingClient ? "Edit Client" : "Add New Client"}
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
              form="client-form"
            >
              {editingClient ? "Update Client" : "Create Client"}
            </Button>
          ]}
        >
          <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Hold">On Hold</option>
              </Select>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Clients