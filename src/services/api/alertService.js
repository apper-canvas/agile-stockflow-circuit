import { delay } from '../index';
import alertsData from '../mockData/alerts.json';

let alerts = [...alertsData];

const alertService = {
  async getAll() {
    await delay(300);
    return [...alerts];
  },

  async getById(id) {
    await delay(200);
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return { ...alert };
  },

  async getByProductId(productId) {
    await delay(300);
    return alerts.filter(a => a.productId === productId).map(a => ({ ...a }));
  },

  async create(alertData) {
    await delay(400);
    const newAlert = {
      ...alertData,
      id: Date.now().toString()
    };
    alerts.push(newAlert);
    return { ...newAlert };
  },

  async update(id, alertData) {
    await delay(300);
    const index = alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    alerts[index] = { ...alerts[index], ...alertData };
    return { ...alerts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = alerts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Alert not found');
    }
    const deletedAlert = alerts.splice(index, 1)[0];
    return { ...deletedAlert };
  }
};

export default alertService;