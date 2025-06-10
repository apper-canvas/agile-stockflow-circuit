import { toast } from 'react-toastify'

const productService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                 'sku', 'description', 'category', 'cost_price', 'sale_price', 'current_stock', 
                 'min_stock', 'max_stock', 'unit', 'last_updated', 'supplier_id']
      }

      const response = await apperClient.fetchRecords('product', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
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
                 'sku', 'description', 'category', 'cost_price', 'sale_price', 'current_stock', 
                 'min_stock', 'max_stock', 'unit', 'last_updated', 'supplier_id']
      }

      const response = await apperClient.getRecordById('product', id, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      toast.error('Failed to fetch product')
      return null
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: productData.name,
          Tags: productData.tags,
          Owner: productData.owner,
          sku: productData.sku,
          description: productData.description,
          category: productData.category,
          cost_price: parseFloat(productData.costPrice),
          sale_price: parseFloat(productData.salePrice),
          current_stock: parseInt(productData.currentStock),
          min_stock: parseInt(productData.minStock),
          max_stock: parseInt(productData.maxStock),
          unit: productData.unit,
          last_updated: new Date().toISOString(),
          supplier_id: parseInt(productData.supplierId)
        }]
      }

      const response = await apperClient.createRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} product records:${failedRecords}`)
          
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
      console.error('Error creating product:', error)
      toast.error('Failed to create product')
      return null
    }
  },

  async update(id, productData) {
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
          Name: productData.name,
          Tags: productData.tags,
          Owner: productData.owner,
          sku: productData.sku,
          description: productData.description,
          category: productData.category,
          cost_price: parseFloat(productData.costPrice),
          sale_price: parseFloat(productData.salePrice),
          current_stock: parseInt(productData.currentStock),
          min_stock: parseInt(productData.minStock),
          max_stock: parseInt(productData.maxStock),
          unit: productData.unit,
          last_updated: new Date().toISOString(),
          supplier_id: parseInt(productData.supplierId)
        }]
      }

      const response = await apperClient.updateRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} product records:${failedRecords}`)
          
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
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
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

      const response = await apperClient.deleteRecord('product', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} product records:${failedRecords}`)
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
      return false
    }
  }
}

export default productService