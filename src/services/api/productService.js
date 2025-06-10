import { delay } from '../index';
import productsData from '../mockData/products.json';

let products = [...productsData];

const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { ...product };
  },

  async create(productData) {
    await delay(400);
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    products.push(newProduct);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(300);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    products[index] = { 
      ...products[index], 
      ...productData, 
      lastUpdated: new Date().toISOString() 
    };
    return { ...products[index] };
  },

  async delete(id) {
    await delay(300);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = products.splice(index, 1)[0];
    return { ...deletedProduct };
  }
};

export default productService;