import { toast } from 'react-toastify'

const alertService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                 'product_id', 'type', 'threshold', 'current_level', 'triggered', 'acknowledged_at']
      }

      const response = await apperClient.fetchRecords('alert', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Failed to fetch alerts')
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                 'product_id', 'type', 'threshold', 'current_level', 'triggered', 'acknowledged_at']
      }

      const response = await apperClient.getRecordById('alert', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching alert with ID ${id}:`, error)
      toast.error('Failed to fetch alert')
      return null
    }
  },

  async getByProductId(productId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                 'product_id', 'type', 'threshold', 'current_level', 'triggered', 'acknowledged_at'],
        where: [{
          fieldName: 'product_id',
          operator: 'ExactMatch',
          values: [parseInt(productId)]
        }]
      }

      const response = await apperClient.fetchRecords('alert', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching alerts for product ${productId}:`, error)
      toast.error('Failed to fetch alerts')
      return []
    }
  },

  async create(alertData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: alertData.name || `Alert ${Date.now()}`,
          Tags: alertData.tags,
          Owner: alertData.owner,
          product_id: parseInt(alertData.productId),
          type: alertData.type,
          threshold: parseInt(alertData.threshold),
          current_level: parseInt(alertData.currentLevel),
          triggered: alertData.triggered,
          acknowledged_at: alertData.acknowledgedAt
        }]
      }

      const response = await apperClient.createRecord('alert', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} alert records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          return null
        }

        const successfulRecord = response.results.find(result => result.success)
        return successfulRecord ? successfulRecord.data : null
      }

      return null
    } catch (error) {
      console.error('Error creating alert:', error)
      toast.error('Failed to create alert')
      return null
    }
  },

  async update(id, alertData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields for update
      const params = {
        records: [{
          Id: parseInt(id),
          Name: alertData.name,
          Tags: alertData.tags,
          Owner: alertData.owner,
          product_id: parseInt(alertData.productId),
          type: alertData.type,
          threshold: parseInt(alertData.threshold),
          current_level: parseInt(alertData.currentLevel),
          triggered: alertData.triggered,
          acknowledged_at: alertData.acknowledgedAt
        }]
      }

      const response = await apperClient.updateRecord('alert', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} alert records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          return null
        }

        const successfulRecord = response.results.find(result => result.success)
        return successfulRecord ? successfulRecord.data : null
      }

      return null
    } catch (error) {
      console.error('Error updating alert:', error)
      toast.error('Failed to update alert')
      return null
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('alert', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} alert records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting alert:', error)
      toast.error('Failed to delete alert')
      return false
    }
  }
}

export default alertService