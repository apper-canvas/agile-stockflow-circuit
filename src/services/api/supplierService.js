import { toast } from 'react-toastify'

const supplierService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
                 'contact_name', 'email', 'phone', 'address', 'lead_time', 'created_at']
      }

      const response = await apperClient.fetchRecords('supplier', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast.error('Failed to fetch suppliers')
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
                 'contact_name', 'email', 'phone', 'address', 'lead_time', 'created_at']
      }

      const response = await apperClient.getRecordById('supplier', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error)
      toast.error('Failed to fetch supplier')
      return null
    }
  },

  async create(supplierData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: supplierData.name,
          Tags: supplierData.tags,
          Owner: supplierData.owner,
          contact_name: supplierData.contactName,
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          lead_time: parseInt(supplierData.leadTime),
          created_at: new Date().toISOString()
        }]
      }

      const response = await apperClient.createRecord('supplier', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} supplier records:${failedRecords}`)
          
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
      console.error('Error creating supplier:', error)
      toast.error('Failed to create supplier')
      return null
    }
  },

  async update(id, supplierData) {
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
          Name: supplierData.name,
          Tags: supplierData.tags,
          Owner: supplierData.owner,
          contact_name: supplierData.contactName,
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          lead_time: parseInt(supplierData.leadTime),
          created_at: supplierData.created_at || new Date().toISOString()
        }]
      }

      const response = await apperClient.updateRecord('supplier', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} supplier records:${failedRecords}`)
          
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
      console.error('Error updating supplier:', error)
      toast.error('Failed to update supplier')
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

      const response = await apperClient.deleteRecord('supplier', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} supplier records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting supplier:', error)
      toast.error('Failed to delete supplier')
      return false
    }
  }
}

export default supplierService