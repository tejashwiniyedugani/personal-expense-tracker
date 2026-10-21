import axios from 'axios';

// Base API configuration connecting to Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const expenseService = {
  // Fetch all expenses with optional search and filters
  async getExpenses(filters = {}) {
    const params = {};
    if (filters.category && filters.category !== 'ALL') {
      params.category = filters.category;
    }
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  // Fetch single expense by ID
  async getExpenseById(id) {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  // Create a new expense
  async createExpense(expenseData) {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  // Update existing expense
  async updateExpense(id, expenseData) {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete an expense
  async deleteExpense(id) {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },

  // Fetch summary analytics and category breakdown
  async getSummary() {
    const response = await apiClient.get('/expenses/summary');
    return response.data;
  },

  // Fetch dropdown metadata (categories, payment methods)
  async getMetadata() {
    const response = await apiClient.get('/expenses/meta');
    return response.data;
  },

  // Reset / seed sample data for testing or exam demonstration
  async seedSampleData() {
    const response = await apiClient.post('/expenses/seed');
    return response.data;
  },

  // Health check to verify if backend is reachable
  async checkHealth() {
    try {
      await apiClient.get('/expenses/summary');
      return true;
    } catch {
      return false;
    }
  }
};

export default expenseService;
