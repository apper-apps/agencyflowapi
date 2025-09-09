import taskData from "@/services/mockData/tasks.json"

let tasks = [...taskData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) throw new Error("Task not found")
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const newId = Math.max(...tasks.map(t => t.Id), 0) + 1
    const newTask = {
      ...taskData,
      Id: newId,
      createdAt: new Date().toISOString()
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(350)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    tasks[index] = { ...tasks[index], ...updateData }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    tasks.splice(index, 1)
    return true
  },

  async getByProjectId(projectId) {
    await delay(250)
    return tasks.filter(t => t.projectId === parseInt(projectId))
  },

  async markComplete(id) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    tasks[index] = { 
      ...tasks[index], 
      status: "Completed",
      completedAt: new Date().toISOString()
    }
    return { ...tasks[index] }
  }
}