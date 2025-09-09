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
import { leadService } from "@/services/api/leadService"
import { clientService } from "@/services/api/clientService"

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "New",
    source: "Website Form",
    notes: ""
  })

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await leadService.getAll()
      setLeads(data)
      setFilteredLeads(data)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleSearch = (query) => {
    if (!query) {
      setFilteredLeads(leads)
      return
    }
    
    const filtered = leads.filter(lead =>
      lead.name.toLowerCase().includes(query.toLowerCase()) ||
      lead.company.toLowerCase().includes(query.toLowerCase()) ||
      lead.email.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredLeads(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingLead) {
        await leadService.update(editingLead.Id, formData)
        toast.success("Lead updated successfully")
      } else {
        await leadService.create(formData)
        toast.success("Lead created successfully")
      }
      setIsModalOpen(false)
      setEditingLead(null)
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "New",
        source: "Website Form",
        notes: ""
      })
      loadLeads()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (lead) => {
    setEditingLead(lead)
    setFormData({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      notes: lead.notes || ""
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (lead) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.delete(lead.Id)
        toast.success("Lead deleted successfully")
        loadLeads()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const handleConvertToClient = async (lead) => {
    if (window.confirm(`Convert ${lead.name} to client?`)) {
      try {
        const clientData = await leadService.convertToClient(lead.Id)
        await clientService.create(clientData)
        await leadService.update(lead.Id, { status: "Closed Won" })
        toast.success("Lead converted to client successfully")
        loadLeads()
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
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} type="lead" />
    },
    {
      key: "source",
      title: "Source",
      render: (value) => <span className="text-sm text-gray-500">{value}</span>
    },
    {
      key: "createdAt",
      title: "Created",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {format(new Date(value), "MMM d, yyyy")}
        </span>
      )
    }
  ]

  const actions = [
    {
      label: "Convert",
      icon: "ArrowRight",
      onClick: handleConvertToClient
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadLeads} />

return (
    <div className="h-full flex flex-col">
      <Header title="Leads" onSearch={handleSearch} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-8 flex justify-between items-start">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200/60 flex-1 mr-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
              Lead Management
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Manage your sales leads and convert them to clients
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingLead(null)
              setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                status: "New",
                source: "Website Form",
                notes: ""
              })
              setIsModalOpen(true)
            }}
            icon="Plus"
            className="px-6 py-4"
          >
            Add Lead
          </Button>
        </div>

        {filteredLeads.length === 0 ? (
          <Empty
            title="No leads found"
            description="Start building your sales pipeline by adding your first lead"
            actionText="Add Lead"
            icon="UserPlus"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
            <DataTable
              data={filteredLeads}
              columns={columns}
              actions={actions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage="No leads match your search"
            />
          </div>
        )}

        {/* Lead Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingLead ? "Edit Lead" : "Add New Lead"}
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
              form="lead-form"
            >
              {editingLead ? "Update Lead" : "Create Lead"}
            </Button>
          ]}
        >
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                  className="bg-white/80"
                />
              </div>
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Company
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                  className="bg-white/80"
                />
              </div>
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="bg-white/80"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </Select>
              </div>
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Source
                </label>
                <Select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="bg-white/80"
                >
                  <option value="Website Form">Website Form</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Trade Show">Trade Show</option>
                </Select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 resize-none shadow-sm"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this lead"
              />
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default Leads