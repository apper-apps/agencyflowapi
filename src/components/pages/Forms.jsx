import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import FormPreview from '@/components/molecules/FormPreview'
import FormFieldConfig from '@/components/molecules/FormFieldConfig'
import EmbedCodeModal from '@/components/molecules/EmbedCodeModal'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Modal from '@/components/organisms/Modal'
import formBuilderService from '@/services/api/formBuilderService'

const Forms = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [currentForm, setCurrentForm] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Form builder state
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [fields, setFields] = useState([])
  const [settings, setSettings] = useState({
    submitText: 'Submit',
    successMessage: 'Thank you for your submission!',
    theme: 'default',
    allowMultiple: true
  })

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const data = await formBuilderService.getAll()
      setForms(data)
    } catch (error) {
      toast.error('Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  const createNewForm = () => {
    setCurrentForm(null)
    setFormName('')
    setFormDescription('')
    setFields([])
    setSettings({
      submitText: 'Submit',
      successMessage: 'Thank you for your submission!',
      theme: 'default',
      allowMultiple: true
    })
    setShowFormBuilder(true)
  }

  const saveForm = async () => {
    if (!formName.trim()) {
      toast.error('Please enter a form name')
      return
    }

    if (fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    try {
      const formData = {
        name: formName,
        description: formDescription,
        fields,
        settings
      }

      if (currentForm?.Id) {
        await formBuilderService.update(currentForm.Id, formData)
        toast.success('Form updated successfully!')
      } else {
        await formBuilderService.create(formData)
        toast.success('Form created successfully!')
      }

      setShowFormBuilder(false)
      loadForms()
    } catch (error) {
      toast.error('Failed to save form')
    }
  }

  const loadForm = async (formId) => {
    try {
      const form = await formBuilderService.getById(formId)
      setCurrentForm(form)
      setFormName(form.name)
      setFormDescription(form.description)
      setFields(form.fields || [])
      setSettings(form.settings || {
        submitText: 'Submit',
        successMessage: 'Thank you for your submission!',
        theme: 'default',
        allowMultiple: true
      })
      setShowFormBuilder(true)
    } catch (error) {
      toast.error('Failed to load form')
    }
  }

  const deleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return
    }

    try {
      await formBuilderService.delete(formId)
      toast.success('Form deleted successfully!')
      loadForms()
    } catch (error) {
      toast.error('Failed to delete form')
    }
  }

  const addField = (fieldType) => {
    const newField = {
      id: Date.now().toString(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: `Enter ${fieldType}`,
      required: false,
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    }
    setFields([...fields, newField])
  }

  const updateField = (fieldId, updates) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }

  const removeField = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId))
  }

  const duplicateForm = async (form) => {
    try {
      const duplicatedForm = {
        ...form,
        name: `${form.name} - Copy`,
        Id: undefined
      }
      await formBuilderService.create(duplicatedForm)
      toast.success('Form duplicated successfully!')
      loadForms()
    } catch (error) {
      toast.error('Failed to duplicate form')
    }
  }

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && form.isActive) ||
                         (filterStatus === 'inactive' && !form.isActive)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600">Create and manage your forms</p>
        </div>
        <Button onClick={createNewForm} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Form
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => (
          <div key={form.Id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{form.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{form.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{form.submissions || 0} submissions</span>
                  <span className={`px-2 py-1 rounded-full ${form.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedForm(form)
                  setShowPreview(true)
                }}
                className="flex items-center gap-1"
              >
                <ApperIcon name="Eye" size={14} />
                Preview
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadForm(form.Id)}
                className="flex items-center gap-1"
              >
                <ApperIcon name="Edit" size={14} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => duplicateForm(form)}
                className="flex items-center gap-1"
              >
                <ApperIcon name="Copy" size={14} />
                Duplicate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedForm(form)
                  setShowEmbedModal(true)
                }}
                className="flex items-center gap-1"
              >
                <ApperIcon name="Code" size={14} />
                Embed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteForm(form.Id)}
                className="flex items-center gap-1 text-red-600 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <ApperIcon name="FileText" size={96} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first form'
            }
          </p>
          {(!searchQuery && filterStatus === 'all') && (
            <Button onClick={createNewForm}>
              Create Your First Form
            </Button>
          )}
        </div>
      )}

      {/* Form Builder Modal */}
      <Modal
        isOpen={showFormBuilder}
        onClose={() => setShowFormBuilder(false)}
        title={currentForm ? 'Edit Form' : 'Create New Form'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Form Details */}
          <div className="space-y-4">
            <Input
              label="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter form description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Form Fields</h3>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => addField('text')}>Add Text</Button>
                <Button size="sm" onClick={() => addField('email')}>Add Email</Button>
                <Button size="sm" onClick={() => addField('select')}>Add Select</Button>
                <Button size="sm" onClick={() => addField('textarea')}>Add Textarea</Button>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <FormFieldConfig
                  key={field.id}
                  field={field}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Submit Button Text"
                value={settings.submitText}
                onChange={(e) => setSettings({...settings, submitText: e.target.value})}
              />
              <Select
                label="Theme"
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
              >
                <option value="default">Default</option>
                <option value="professional">Professional</option>
                <option value="minimal">Minimal</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Message
              </label>
              <textarea
                value={settings.successMessage}
                onChange={(e) => setSettings({...settings, successMessage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowFormBuilder(false)}>
              Cancel
            </Button>
            <Button onClick={saveForm}>
              {currentForm ? 'Update Form' : 'Create Form'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Form Preview Modal */}
      <FormPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        form={selectedForm}
      />

      {/* Embed Code Modal */}
      <EmbedCodeModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        form={selectedForm}
      />
    </div>
  )
}

export default Forms