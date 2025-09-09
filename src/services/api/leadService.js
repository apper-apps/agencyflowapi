import leadData from "@/services/mockData/leads.json"

let leads = [...leadData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const leadService = {
  async getAll() {
    await delay(300)
    return [...leads]
  },

  async getById(id) {
    await delay(200)
    const lead = leads.find(l => l.Id === parseInt(id))
    if (!lead) throw new Error("Lead not found")
    return { ...lead }
  },

  async create(leadData) {
    await delay(400)
    const newId = Math.max(...leads.map(l => l.Id), 0) + 1
    const newLead = {
      ...leadData,
      Id: newId,
      createdAt: new Date().toISOString()
    }
    leads.push(newLead)
    return { ...newLead }
  },

  async update(id, updateData) {
    await delay(350)
    const index = leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("Lead not found")
    
    leads[index] = { ...leads[index], ...updateData }
    return { ...leads[index] }
  },

  async delete(id) {
    await delay(250)
    const index = leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("Lead not found")
    
    leads.splice(index, 1)
    return true
  },

  async convertToClient(id) {
    await delay(400)
    const lead = leads.find(l => l.Id === parseInt(id))
    if (!lead) throw new Error("Lead not found")
    
    return {
      Id: lead.Id,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: "Active",
      createdAt: new Date().toISOString(),
      projects: []
    }
  }
}