import React, { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Modal from "@/components/organisms/Modal"
import ApperIcon from "@/components/ApperIcon"
import FormCanvas from "@/components/molecules/FormCanvas"
import FormFieldPanel from "@/components/molecules/FormFieldPanel"
import FormFieldConfig from "@/components/molecules/FormFieldConfig"
import FormPreview from "@/components/molecules/FormPreview"
import EmbedCodeModal from "@/components/molecules/EmbedCodeModal"
import { formBuilderService } from "@/services/api/formBuilderService"

const FormBuilder = () => {
  const [forms, setForms] = useState([])
  const [currentForm, setCurrentForm] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [showFormList, setShowFormList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      setLoading(true)
      const data = await formBuilderService.getAll()
      setForms(data)
    } catch (error) {
      toast.error("Failed to load forms")
    } finally {
      setLoading(false)
    }
  }

  const createNewForm = () => {
    const newForm = {
      name: "Untitled Form",
      description: "",
      fields: [],
      settings: {
        submitText: "Submit",
        successMessage: "Thank you for your submission!",
        theme: "default",
        allowMultiple: true
      }
    }
    setCurrentForm(newForm)
    setSelectedField(null)
    setShowFormList(false)
  }

  const saveForm = async () => {
    if (!currentForm || currentForm.fields.length === 0) {
      toast.error("Please add at least one field to save the form")
      return
    }

    try {
      setSaving(true)
      let savedForm
      if (currentForm.Id) {
        savedForm = await formBuilderService.update(currentForm.Id, currentForm)
        toast.success("Form updated successfully")
      } else {
        savedForm = await formBuilderService.create(currentForm)
        toast.success("Form created successfully")
      }
      setCurrentForm(savedForm)
      await loadForms()
    } catch (error) {
      toast.error("Failed to save form")
    } finally {
      setSaving(false)
    }
  }

  const loadForm = async (formId) => {
    try {
      const form = await formBuilderService.getById(formId)
      setCurrentForm(form)
      setSelectedField(null)
      setShowFormList(false)
    } catch (error) {
      toast.error("Failed to load form")
    }
  }

  const deleteForm = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return

    try {
      await formBuilderService.delete(formId)
      toast.success("Form deleted successfully")
      await loadForms()
      if (currentForm?.Id === formId) {
        setCurrentForm(null)
      }
    } catch (error) {
      toast.error("Failed to delete form")
    }
  }

  const updateFormField = (fieldId, updates) => {
    if (!currentForm) return

    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const removeFormField = (fieldId) => {
    if (!currentForm) return

    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    setSelectedField(null)
  }

  const addFormField = (fieldType) => {
    if (!currentForm) return

    const newField = {
      id: Date.now().toString(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: fieldType === "select" || fieldType === "radio" || fieldType === "checkbox" 
        ? ["Option 1", "Option 2", "Option 3"] : undefined
    }

    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const reorderFields = (dragIndex, hoverIndex) => {
    if (!currentForm) return

    const dragField = currentForm.fields[dragIndex]
    const newFields = [...currentForm.fields]
    newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, dragField)

    setCurrentForm(prev => ({
      ...prev,
      fields: newFields
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ApperIcon name="Loader2" className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-500">Loading forms...</p>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
              {currentForm && (
                <input
                  type="text"
                  value={currentForm.name}
                  onChange={(e) => setCurrentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-medium border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                  placeholder="Form name"
                />
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowFormList(true)}
                icon="FolderOpen"
              >
                My Forms ({forms.length})
              </Button>
              <Button
                variant="ghost"
                onClick={createNewForm}
                icon="Plus"
              >
                New Form
              </Button>
              {currentForm && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPreview(true)}
                    icon="Eye"
                  >
                    Preview
                  </Button>
                  <Button
                    variant="accent"
                    onClick={() => setShowEmbedCode(true)}
                    icon="Code"
                    disabled={!currentForm.Id}
                  >
                    Embed Code
                  </Button>
                  <Button
                    onClick={saveForm}
                    loading={saving}
                    icon="Save"
                  >
                    Save Form
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {currentForm ? (
            <>
              {/* Left Panel - Field Library */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Form Fields</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FormFieldPanel onAddField={addFormField} />
                </div>
              </div>

              {/* Center Panel - Form Canvas */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                  <FormCanvas
                    form={currentForm}
                    onFieldSelect={setSelectedField}
                    onFieldUpdate={updateFormField}
                    onFieldRemove={removeFormField}
                    onFieldsReorder={reorderFields}
                    selectedFieldId={selectedField?.id}
                  />
                </div>
              </div>

              {/* Right Panel - Field Configuration */}
              <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {selectedField ? "Field Settings" : "Form Settings"}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FormFieldConfig
                    field={selectedField}
                    form={currentForm}
                    onFieldUpdate={updateFormField}
                    onFormUpdate={setCurrentForm}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <ApperIcon name="FileText" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Form</h2>
                <p className="text-gray-500 mb-6 max-w-md">
                  Build professional forms with our drag-and-drop form builder. 
                  Perfect for lead generation, contact forms, surveys, and more.
                </p>
                <div className="space-x-3">
                  <Button onClick={createNewForm} icon="Plus">
                    Create New Form
                  </Button>
                  {forms.length > 0 && (
                    <Button variant="secondary" onClick={() => setShowFormList(true)}>
                      Browse Existing Forms
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <Modal
          isOpen={showFormList}
          onClose={() => setShowFormList(false)}
          title="My Forms"
        >
          <div className="space-y-3">
            {forms.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No forms created yet</p>
            ) : (
              forms.map((form) => (
                <div
                  key={form.Id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{form.name}</h4>
                    <p className="text-sm text-gray-500">
                      {form.fields.length} fields • Created {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => loadForm(form.Id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="error"
                      onClick={() => deleteForm(form.Id)}
                      icon="Trash2"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Modal>

        <FormPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          form={currentForm}
        />

        <EmbedCodeModal
          isOpen={showEmbedCode}
          onClose={() => setShowEmbedCode(false)}
          form={currentForm}
        />
      </div>
    </DndProvider>
  )
}

export default FormBuilder