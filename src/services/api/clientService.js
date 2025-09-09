import clientData from "@/services/mockData/clients.json"

let clients = [...clientData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const clientService = {
  async getAll() {
    await delay(300)
    return [...clients]
  },

  async getById(id) {
    await delay(200)
    const client = clients.find(c => c.Id === parseInt(id))
    if (!client) throw new Error("Client not found")
    return { ...client }
  },

  async create(clientData) {
    await delay(400)
    const newId = Math.max(...clients.map(c => c.Id), 0) + 1
    const newClient = {
      ...clientData,
      Id: newId,
      createdAt: new Date().toISOString(),
      projects: []
    }
    clients.push(newClient)
    return { ...newClient }
  },

  async update(id, updateData) {
    await delay(350)
    const index = clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Client not found")
    
    clients[index] = { ...clients[index], ...updateData }
    return { ...clients[index] }
  },

  async delete(id) {
    await delay(250)
    const index = clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Client not found")
    
    clients.splice(index, 1)
    return true
  }
}