import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormPreview from "@/components/molecules/FormPreview";
import FormFieldConfig from "@/components/molecules/FormFieldConfig";
import EmbedCodeModal from "@/components/molecules/EmbedCodeModal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/organisms/Modal";
import formBuilderService from "@/services/api/formBuilderService";
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
  const [selectedSection, setSelectedSection] = useState(null)
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
      name: "Untitled Proposal Template",
      description: "",
      category: "consulting",
      sections: [
        { 
          id: 'cover', 
          name: 'Cover Page', 
          type: 'cover', 
          required: true,
          content: 'Professional proposal cover with your branding',
          order: 1
        },
        { 
          id: 'overview', 
          name: 'Project Overview', 
          type: 'content', 
          required: true,
          content: 'Brief description of the project and objectives',
          order: 2
        },
        { 
          id: 'investment', 
          name: 'Investment', 
          type: 'pricing', 
          required: true,
          content: 'Detailed pricing breakdown and payment terms',
          order: 3
        }
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
        date: '[DATE]',
        proposalNumber: '[PROPOSAL_NUMBER]',
        totalAmount: '[TOTAL_AMOUNT]'
      },
      settings: {
        submitText: "Accept Proposal",
        successMessage: "Thank you! We'll be in touch soon.",
        theme: "professional",
        allowComments: true,
        requireSignature: true
      }
    }
    setCurrentTemplate(newTemplate)
    setSelectedSection(null)
    setShowTemplateList(false)
    setShowTemplateLibrary(false)
  }

const createFromPrebuilt = (template) => {
    const newTemplate = {
      ...template,
      name: `${template.name} - Copy`,
      Id: null,
      placeholders: {
        clientName: '[CLIENT_NAME]',
        companyName: '[COMPANY_NAME]',
        projectName: '[PROJECT_NAME]',
        date: '[DATE]',
        proposalNumber: '[PROPOSAL_NUMBER]',
        totalAmount: '[TOTAL_AMOUNT]'
      },
      settings: {
        ...template.settings,
        allowComments: true,
        requireSignature: true
      }
    }
    setCurrentTemplate(newTemplate)
    setSelectedSection(null)
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
      setSelectedSection(null)
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

const addSection = (sectionType) => {
    if (!currentTemplate) return

    const newSection = {
      id: Date.now().toString(),
      name: `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`,
      type: sectionType,
      required: false,
      content: getSectionDefaultContent(sectionType),
      order: currentTemplate.sections.length + 1
    }

    setCurrentTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
    setSelectedSection(newSection)
  }

  const getSectionDefaultContent = (type) => {
    switch (type) {
      case 'cover':
        return 'Professional proposal cover with your branding'
      case 'content':
        return 'Add your content here'
      case 'pricing':
        return 'Detailed pricing breakdown and payment terms'
      case 'timeline':
        return 'Project timeline and milestones'
      case 'terms':
        return 'Terms and conditions'
      default:
        return 'Section content'
    }
  }

  const updateSection = (sectionId, updates) => {
    if (!currentTemplate) return

    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }))
  }

  const removeSection = (sectionId) => {
    if (!currentTemplate) return

    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }))
    setSelectedSection(null)
  }

  const reorderSections = (dragIndex, hoverIndex) => {
    if (!currentTemplate) return

    const dragSection = currentTemplate.sections[dragIndex]
    const newSections = [...currentTemplate.sections]
    newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, dragSection)

    // Update order values
    newSections.forEach((section, index) => {
      section.order = index + 1
    })

    setCurrentTemplate(prev => ({
      ...prev,
      sections: newSections
    }))
  }

  const filteredPrebuiltTemplates = selectedCategory === 'all' 
    ? PRE_BUILT_TEMPLATES 
    : PRE_BUILT_TEMPLATES.filter(t => t.category === selectedCategory)

useEffect(() => {
    loadTemplates()
  }, [])
return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 w-full">
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

        <div className="flex flex-1">
          {currentTemplate ? (
            <>
              {/* Left Panel - Section Management */}
              <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h3 className="text-lg font-bold text-gray-900">Template Sections</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage proposal sections</p>
                </div>
                
                <div className="p-4 border-b border-gray-200">
                  <Select
                    value=""
                    onChange={(e) => e.target.value && addSection(e.target.value)}
                    className="w-full"
                  >
                    <option value="">Add Section...</option>
                    <option value="cover">Cover Page</option>
                    <option value="content">Content Block</option>
                    <option value="pricing">Pricing Table</option>
                    <option value="timeline">Timeline</option>
                    <option value="terms">Terms & Conditions</option>
                  </Select>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {currentTemplate.sections.map((section, index) => (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSection(section)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedSection?.id === section.id ? 'bg-indigo-50 border-indigo-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{section.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{section.type} section</p>
                          {section.required && (
                            <span className="inline-block px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded mt-1">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (index > 0) reorderSections(index, index - 1)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={index === 0}
                          >
                            <ApperIcon name="ChevronUp" size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (index < currentTemplate.sections.length - 1) reorderSections(index, index + 1)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={index === currentTemplate.sections.length - 1}
                          >
                            <ApperIcon name="ChevronDown" size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(section.id)
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Template Preview/Editor */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentTemplate.name}
                      </h2>
                      {currentTemplate.description && (
                        <p className="text-gray-600">{currentTemplate.description}</p>
                      )}
                    </div>

                    <div className="space-y-8">
                      {currentTemplate.sections.map((section) => (
                        <div
                          key={section.id}
                          onClick={() => setSelectedSection(section)}
                          className={`border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-indigo-300 transition-colors ${
                            selectedSection?.id === section.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 capitalize">{section.type}</span>
                              {section.required && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-gray-600">
                            {section.content || `This is a ${section.type} section. Click to edit content.`}
                          </div>
                        </div>
                      ))}

                      {currentTemplate.sections.length === 0 && (
                        <div className="text-center py-12">
                          <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No sections added yet. Add sections from the left panel.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Section Configuration */}
              <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedSection ? "Section Settings" : "Template Settings"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedSection ? "Configure the selected section" : "Configure template options"}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedSection ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Name
                        </label>
                        <Input
                          value={selectedSection.name}
                          onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })}
                          placeholder="Section name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Type
                        </label>
                        <Select
                          value={selectedSection.type}
                          onChange={(e) => updateSection(selectedSection.id, { type: e.target.value })}
                        >
                          <option value="cover">Cover Page</option>
                          <option value="content">Content Block</option>
                          <option value="pricing">Pricing Table</option>
                          <option value="timeline">Timeline</option>
                          <option value="terms">Terms & Conditions</option>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={selectedSection.content}
                          onChange={(e) => updateSection(selectedSection.id, { content: e.target.value })}
                          placeholder="Section content"
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="required"
                          checked={selectedSection.required}
                          onChange={(e) => updateSection(selectedSection.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor="required" className="text-sm text-gray-700">
                          Required section
                        </label>
                      </div>
                    </div>
                  ) : (
                    <FormFieldConfig
                      form={currentTemplate}
                      onFormUpdate={setCurrentTemplate}
                      isTemplate={true}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            // Empty State
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
    </>
  )
}

export default ProposalTemplates