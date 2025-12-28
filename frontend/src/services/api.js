import axios from 'axios';

const API_BASE_URL = 'https://travel-itinerary-app-ajjl.onrender.com/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateItinerary = async (data) => {
  try {
    const response = await api.post('/itinerary/generate', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate itinerary');
  }
};

export const getItinerary = async (id) => {
  try {
    const response = await api.get(`/itinerary/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch itinerary');
  }
};

export const getUserItineraries = async (userId) => {
  try {
    const response = await api.get(`/itinerary/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch itineraries');
  }
};

export const exportPDF = async (itineraryId) => {
  try {
    const response = await api.post('/itinerary/export-pdf', { itineraryId }, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `itinerary-${itineraryId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to export PDF');
  }
};

export default api;


