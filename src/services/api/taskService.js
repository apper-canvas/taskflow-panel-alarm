import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

export const taskService = {
  // Get all tasks
  async getAll() {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      }

      const response = await apperClient.fetchRecords('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  },

  // Get task by ID
  async getById(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}}
        ]
      }

      const response = await apperClient.getRecordById('task_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data || null
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  // Create new task
  async create(taskData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Name: taskData.title_c,
          title_c: taskData.title_c,
          description_c: taskData.description_c || "",
          priority_c: taskData.priority_c,
          due_date_c: taskData.due_date_c,
          completed_c: false,
          completed_at_c: null
        }]
      }

      const response = await apperClient.createRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      return null
    }
  },

  // Update task
  async update(id, updates) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updates
        }]
      }

      const response = await apperClient.updateRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      return null
    }
  },

  // Delete task
  async delete(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      return false
    }
  },

  // Toggle task completion
  async toggleComplete(id) {
    try {
      // Get current task first
      const currentTask = await this.getById(id)
      if (!currentTask) {
        throw new Error("Task not found")
      }

      const newCompleted = !currentTask.completed_c
      const updates = {
        completed_c: newCompleted,
        completed_at_c: newCompleted ? new Date().toISOString() : null
      }

      return await this.update(id, updates)
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error)
      return null
    }
  }
}