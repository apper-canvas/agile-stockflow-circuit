import { toast } from 'react-toastify'

const stockMovementService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                 'product_id', 'type', 'quantity', 'reason', 'notes', 'timestamp', 'user_id']
      }

      const response = await apperClient.fetchRecords('stock_movement', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching stock movements:', error)
      toast.error('Failed to fetch stock movements')
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
                 'product_id', 'type', 'quantity', 'reason', 'notes', 'timestamp', 'user_id']
      }

      const response = await apperClient.getRecordById('stock_movement', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching stock movement with ID ${id}:`, error)
      toast.error('Failed to fetch stock movement')
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
                 'product_id', 'type', 'quantity', 'reason', 'notes', 'timestamp', 'user_id'],
        where: [{
          fieldName: 'product_id',
          operator: 'ExactMatch',
          values: [parseInt(productId)]
        }]
      }

      const response = await apperClient.fetchRecords('stock_movement', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching stock movements for product ${productId}:`, error)
      toast.error('Failed to fetch stock movements')
      return []
    }
  },

  async create(movementData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: movementData.name || `Movement ${Date.now()}`,
          Tags: movementData.tags,
          Owner: movementData.owner,
          product_id: parseInt(movementData.productId),
          type: movementData.type,
          quantity: parseInt(movementData.quantity),
          reason: movementData.reason,
          notes: movementData.notes,
          timestamp: movementData.timestamp || new Date().toISOString(),
          user_id: parseInt(movementData.userId)
        }]
      }

      const response = await apperClient.createRecord('stock_movement', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} stock movement records:${failedRecords}`)
          
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
      console.error('Error creating stock movement:', error)
      toast.error('Failed to create stock movement')
      return null
    }
  },

  async update(id, movementData) {
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
          Name: movementData.name,
          Tags: movementData.tags,
          Owner: movementData.owner,
          product_id: parseInt(movementData.productId),
          type: movementData.type,
          quantity: parseInt(movementData.quantity),
          reason: movementData.reason,
          notes: movementData.notes,
          timestamp: movementData.timestamp,
          user_id: parseInt(movementData.userId)
        }]
      }

      const response = await apperClient.updateRecord('stock_movement', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} stock movement records:${failedRecords}`)
          
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
      console.error('Error updating stock movement:', error)
      toast.error('Failed to update stock movement')
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

      const response = await apperClient.deleteRecord('stock_movement', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} stock movement records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting stock movement:', error)
      toast.error('Failed to delete stock movement')
      return false
    }
  }
}

export default stockMovementService