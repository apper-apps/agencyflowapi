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

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: 'Grid3X3' },
  { id: 'web-design', name: 'Web Design', icon: 'Monitor' },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp' },
  { id: 'consulting', name: 'Consulting', icon: 'Users' },
  { id: 'development', name: 'Development', icon: 'Code' },
  { id: 'branding', name: 'Branding', icon: 'Palette' },
  { id: 'seo', name: 'SEO Services', icon: 'Search' }
]

const PRE_BUILT_TEMPLATES = [
  {
    id: 'web-design-basic',
    name: 'Basic Website Design',
    category: 'web-design',
    description: 'Professional website design proposal with timeline and deliverables',
    preview: '/templates/web-design-basic.jpg',
    sections: [
      { id: 'cover', name: 'Cover Page', type: 'cover', required: true },
      { id: 'overview', name: 'Project Overview', type: 'content', required: true },
      { id: 'scope', name: 'Scope of Work', type: 'list', required: true },
      { id: 'timeline', name: 'Project Timeline', type: 'timeline', required: true },
      { id: 'investment', name: 'Investment', type: 'pricing', required: true },
      { id: 'terms', name: 'Terms & Conditions', type: 'content', required: false }
    ],
    branding: {
      primaryColor: '#4F46E5',
      secondaryColor: '#7C3AED',
      fontFamily: 'Inter',
      logoPosition: 'top-left'
    }
  },
  {
    id: 'marketing-campaign',
    name: 'Digital Marketing Campaign',
    category: 'marketing',
    description: 'Comprehensive digital marketing proposal with strategy and ROI projections',
    preview: '/templates/marketing-campaign.jpg',
    sections: [
      { id: 'cover', name: 'Cover Page', type: 'cover', required: true },
      { id: 'situation', name: 'Current Situation', type: 'content', required: true },
      { id: 'strategy', name: 'Marketing Strategy', type: 'content', required: true },
      { id: 'channels', name: 'Marketing Channels', type: 'grid', required: true },
      { id: 'timeline', name: 'Campaign Timeline', type: 'timeline', required: true },
      { id: 'roi', name: 'Expected ROI', type: 'metrics', required: true },
      { id: 'investment', name: 'Investment', type: 'pricing', required: true }
    ],
    branding: {
      primaryColor: '#F59E0B',
      secondaryColor: '#EF4444',
      fontFamily: 'Inter',
      logoPosition: 'center'
    }
  },
  {
    id: 'business-consulting',
    name: 'Business Consulting',
    category: 'consulting',
    description: 'Strategic business consulting proposal with analysis and recommendations',
    preview: '/templates/business-consulting.jpg',
    sections: [
      { id: 'cover', name: 'Cover Page', type: 'cover', required: true },
      { id: 'executive', name: 'Executive Summary', type: 'content', required: true },
      { id: 'analysis', name: 'Current State Analysis', type: 'content', required: true },
      { id: 'recommendations', name: 'Recommendations', type: 'list', required: true },
      { id: 'implementation', name: 'Implementation Plan', type: 'timeline', required: true },
      { id: 'investment', name: 'Investment', type: 'pricing', required: true }
    ],
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#0891B2',
      fontFamily: 'Inter',
      logoPosition: 'top-right'
    }
  }
]

const ProposalTemplates = () => {
const [templates, setTemplates] = useState([])
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [showTemplateList, setShowTemplateList] = useState(false)
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await formBuilderService.getAll()
      setTemplates(data)
    } catch (error) {
      toast.error("Failed to load templates")
    } finally {
      setLoading(false)
    }
  }

  const createNewTemplate = () => {
    const newTemplate = {
      name: "Untitled Proposal",
      description: "",
      category: "consulting",
      fields: [],
      sections: [
        { id: 'cover', name: 'Cover Page', type: 'cover', required: true },
        { id: 'overview', name: 'Project Overview', type: 'content', required: true },
        { id: 'investment', name: 'Investment', type: 'pricing', required: true }
      ],
      branding: {
        primaryColor: '#4F46E5',
        secondaryColor: '#7C3AED',
        fontFamily: 'Inter',
        logoPosition: 'top-left',
        logo: null,
        letterhead: true
      },
      placeholders: {
        clientName: '[CLIENT_NAME]',
        companyName: '[COMPANY_NAME]',
        projectName: '[PROJECT_NAME]',
        date: '[DATE]'
      },
      settings: {
        submitText: "Accept Proposal",
        successMessage: "Thank you! We'll be in touch soon.",
        theme: "professional",
        allowMultiple: false
      }
    }
    setCurrentTemplate(newTemplate)
    setSelectedField(null)
    setShowTemplateList(false)
    setShowTemplateLibrary(false)
  }

  const createFromPrebuilt = (template) => {
    const newTemplate = {
      ...template,
      name: `${template.name} - Copy`,
      Id: null,
      fields: [],
      placeholders: {
        clientName: '[CLIENT_NAME]',
        companyName: '[COMPANY_NAME]',
        projectName: '[PROJECT_NAME]',
        date: '[DATE]',
        proposalNumber: '[PROPOSAL_NUMBER]'
      }
    }
    setCurrentTemplate(newTemplate)
    setSelectedField(null)
    setShowTemplateLibrary(false)
    toast.success(`Created new template from ${template.name}`)
  }

  const saveTemplate = async () => {
    if (!currentTemplate || currentTemplate.sections.length === 0) {
      toast.error("Please add at least one section to save the template")
      return
    }

    try {
      setSaving(true)
      let savedTemplate
      if (currentTemplate.Id) {
        savedTemplate = await formBuilderService.update(currentTemplate.Id, currentTemplate)
        toast.success("Template updated successfully")
      } else {
        savedTemplate = await formBuilderService.create(currentTemplate)
        toast.success("Template created successfully")
      }
      setCurrentTemplate(savedTemplate)
      await loadTemplates()
    } catch (error) {
      toast.error("Failed to save template")
    } finally {
      setSaving(false)
    }
  }

  const loadTemplate = async (templateId) => {
    try {
      const template = await formBuilderService.getById(templateId)
      setCurrentTemplate(template)
      setSelectedField(null)
      setShowTemplateList(false)
    } catch (error) {
      toast.error("Failed to load template")
    }
  }

  const deleteTemplate = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return

    try {
      await formBuilderService.delete(templateId)
      toast.success("Template deleted successfully")
      await loadTemplates()
      if (currentTemplate?.Id === templateId) {
        setCurrentTemplate(null)
      }
    } catch (error) {
      toast.error("Failed to delete template")
    }
  }

  const updateTemplateField = (fieldId, updates) => {
    if (!currentTemplate) return

    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
  }

  const removeTemplateField = (fieldId) => {
    if (!currentTemplate) return

    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    setSelectedField(null)
  }

  const addTemplateField = (fieldType) => {
    if (!currentTemplate) return

    const newField = {
      id: Date.now().toString(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: fieldType === "select" || fieldType === "radio" || fieldType === "checkbox" 
        ? ["Option 1", "Option 2", "Option 3"] : undefined
    }

    setCurrentTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const reorderFields = (dragIndex, hoverIndex) => {
    if (!currentTemplate) return

    const dragField = currentTemplate.fields[dragIndex]
    const newFields = [...currentTemplate.fields]
    newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, dragField)

    setCurrentTemplate(prev => ({
      ...prev,
      fields: newFields
    }))
  }

  const filteredPrebuiltTemplates = selectedCategory === 'all' 
    ? PRE_BUILT_TEMPLATES 
    : PRE_BUILT_TEMPLATES.filter(t => t.category === selectedCategory)
useEffect(() => {
    loadTemplates()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Proposal Templates</h1>
              {currentTemplate && (
                <input
                  type="text"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-medium border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                  placeholder="Template name"
                />
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowTemplateLibrary(true)}
                icon="Library"
              >
                Template Library
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowTemplateList(true)}
                icon="FolderOpen"
              >
                My Templates ({templates.length})
              </Button>
              <Button
                variant="ghost"
                onClick={createNewTemplate}
                icon="Plus"
              >
                New Template
              </Button>
              {currentTemplate && (
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
                    disabled={!currentTemplate.Id}
                  >
                    Share Template
                  </Button>
                  <Button
                    onClick={saveTemplate}
                    loading={saving}
                    icon="Save"
                  >
                    Save Template
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {currentTemplate ? (
            <>
              {/* Left Panel - Field Library */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Content Elements</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FormFieldPanel onAddField={addTemplateField} />
                </div>
              </div>

              {/* Center Panel - Template Canvas */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                  <FormCanvas
                    form={currentTemplate}
                    onFieldSelect={setSelectedField}
                    onFieldUpdate={updateTemplateField}
                    onFieldRemove={removeTemplateField}
                    onFieldsReorder={reorderFields}
                    selectedFieldId={selectedField?.id}
                  />
                </div>
              </div>

              {/* Right Panel - Configuration */}
              <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {selectedField ? "Element Settings" : "Template Settings"}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FormFieldConfig
                    field={selectedField}
                    form={currentTemplate}
                    onFieldUpdate={updateTemplateField}
                    onFormUpdate={setCurrentTemplate}
                    isTemplate={true}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <ApperIcon name="FileTemplate" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Proposal Template</h2>
                <p className="text-gray-500 mb-6 max-w-md">
                  Design professional proposal templates with customizable layouts, branding, 
                  and content placeholders for your services.
                </p>
                <div className="space-x-3">
                  <Button onClick={createNewTemplate} icon="Plus">
                    Create New Template
                  </Button>
                  <Button variant="secondary" onClick={() => setShowTemplateLibrary(true)}>
                    Browse Template Library
                  </Button>
                  {templates.length > 0 && (
                    <Button variant="ghost" onClick={() => setShowTemplateList(true)}>
                      My Templates
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <Modal
          isOpen={showTemplateLibrary}
          onClose={() => setShowTemplateLibrary(false)}
          title="Template Library"
        >
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  variant={selectedCategory === category.id ? "primary" : "ghost"}
                  onClick={() => setSelectedCategory(category.id)}
                  icon={category.icon}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrebuiltTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                  onClick={() => createFromPrebuilt(template)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
                    <ApperIcon name="FileTemplate" className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{template.category.replace('-', ' ')}</span>
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: template.branding.primaryColor }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300" 
                        style={{ backgroundColor: template.branding.secondaryColor }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showTemplateList}
          onClose={() => setShowTemplateList(false)}
          title="My Templates"
        >
          <div className="space-y-3">
            {templates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No templates created yet</p>
            ) : (
              templates.map((template) => (
                <div
                  key={template.Id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-500">
                      {template.sections?.length || 0} sections • Created {new Date(template.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => loadTemplate(template.Id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="error"
                      onClick={() => deleteTemplate(template.Id)}
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
          form={currentTemplate}
        />

        <EmbedCodeModal
          isOpen={showEmbedCode}
          onClose={() => setShowEmbedCode(false)}
          form={currentTemplate}
        />
      </div>
    </DndProvider>
  )
}

export default ProposalTemplates