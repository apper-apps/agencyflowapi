import formsData from "@/services/mockData/forms.json"

let forms = [...formsData]
let nextId = Math.max(...forms.map(f => f.Id), 0) + 1

export const formBuilderService = {
async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return forms.map(form => ({ ...form }))
  },

  async getById(id) {
    if (typeof id !== 'number') {
      throw new Error('ID must be a number')
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const form = forms.find(f => f.Id === id)
    if (!form) {
      throw new Error(`Template with ID ${id} not found`)
    }
    
    return { ...form }
  },

  async create(formData) {
    await new Promise(resolve => setTimeout(resolve, 500))
const newForm = {
      ...formData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: 0,
      isActive: true,
      fields: formData.fields || [],
      sections: formData.sections || [],
      settings: formData.settings || {
        submitText: 'Submit',
        successMessage: 'Thank you for your submission!',
        theme: 'default',
        allowMultiple: true
      }
    }
    
    forms.push(newForm)
    return { ...newForm }
  },

  async update(id, formData) {
    if (typeof id !== 'number') {
      throw new Error('ID must be a number')
    }
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = forms.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error(`Template with ID ${id} not found`)
    }
    
    const updatedForm = {
      ...forms[index],
      ...formData,
Id: parseInt(id), // Preserve original ID
      updatedAt: new Date().toISOString(),
      fields: formData.fields || forms[index].fields || [],
      sections: formData.sections || forms[index].sections || []
    }
    
    forms[index] = updatedForm
    return { ...updatedForm }
  },

  async delete(id) {
    if (typeof id !== 'number') {
      throw new Error('ID must be a number')
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = forms.findIndex(f => f.Id === id)
    if (index === -1) {
      throw new Error(`Template with ID ${id} not found`)
    }
    
    forms.splice(index, 1)
    return true
  },

  async submitForm(formId, submissionData) {
    if (typeof formId !== 'number') {
      throw new Error('Form ID must be a number')
    }
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const form = forms.find(f => f.Id === formId)
    if (!form) {
      throw new Error(`Form with ID ${formId} not found`)
    }
    
    // Increment submission count
    form.submissions = (form.submissions || 0) + 1
    form.updatedAt = new Date().toISOString()
    
    // In a real app, this would save to a submissions table
    const submission = {
      id: Date.now(),
      formId,
      data: submissionData,
      submittedAt: new Date().toISOString(),
      ipAddress: '127.0.0.1', // Simulated
      userAgent: navigator.userAgent
    }
    
    return submission
  },

  async getFormStats(formId) {
    if (typeof formId !== 'number') {
      throw new Error('Form ID must be a number')
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const form = forms.find(f => f.Id === formId)
    if (!form) {
      throw new Error(`Form with ID ${formId} not found`)
    }
    
    return {
      totalSubmissions: form.submissions || 0,
      lastSubmission: form.updatedAt,
      conversionRate: Math.random() * 15 + 5, // Simulated 5-20%
      averageCompletionTime: Math.floor(Math.random() * 120 + 30), // 30-150 seconds
      topExitField: (form.fields && form.fields.length > 0) 
        ? form.fields[Math.floor(Math.random() * form.fields.length)]?.label 
        : null
    }
  }
}

export default formBuilderService