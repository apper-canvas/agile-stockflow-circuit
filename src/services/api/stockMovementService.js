import { delay } from '../index';
import stockMovementsData from '../mockData/stockMovements.json';

let stockMovements = [...stockMovementsData];

const stockMovementService = {
  async getAll() {
    await delay(300);
    return [...stockMovements];
  },

  async getById(id) {
    await delay(200);
    const movement = stockMovements.find(m => m.id === id);
    if (!movement) {
      throw new Error('Stock movement not found');
    }
    return { ...movement };
  },

  async getByProductId(productId) {
    await delay(300);
    return stockMovements.filter(m => m.productId === productId).map(m => ({ ...m }));
  },

  async create(movementData) {
    await delay(400);
    const newMovement = {
      ...movementData,
      id: Date.now().toString(),
      timestamp: movementData.timestamp || new Date().toISOString()
    };
    stockMovements.push(newMovement);
    return { ...newMovement };
  },

  async update(id, movementData) {
    await delay(300);
    const index = stockMovements.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Stock movement not found');
    }
    stockMovements[index] = { ...stockMovements[index], ...movementData };
    return { ...stockMovements[index] };
  },

  async delete(id) {
    await delay(300);
    const index = stockMovements.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Stock movement not found');
    }
    const deletedMovement = stockMovements.splice(index, 1)[0];
    return { ...deletedMovement };
  }
};

export default stockMovementService;