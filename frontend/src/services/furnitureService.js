import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/furniture';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const furnitureService = {
  // GET /furniture/displayall
  getAllRentals: async () => {
    const response = await apiClient.get('/displayall');
    return response.data;
  },

  // GET /furniture/displaybyid/{id}
  getRentalById: async (id) => {
    const response = await apiClient.get(`/displaybyid/${id}`);
    return response.data;
  },

  // POST /furniture/add
  createRental: async (rentalData) => {
    const response = await apiClient.post('/add', rentalData);
    return response.data;
  },

  // PUT /furniture/update/{id}
  updateRental: async (id, rentalData) => {
    const response = await apiClient.put(`/update/${id}`, rentalData);
    return response.data;
  },

  // DELETE /furniture/delete/{id}
  deleteRental: async (id) => {
    const response = await apiClient.delete(`/delete/${id}`);
    return response.data;
  },
};

export default furnitureService;
