import axios from 'axios';
import endpoints from '../../APIendpoints';
import { logOut } from '../redux/slices/userSlice';
import store from '../redux/store';

const axiosInstance = axios.create({
  baseURL: endpoints,
  withCredentials: true,
});

// Optional: Add token from localStorage
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// Optional: Handle global errors
axiosInstance.interceptors.response.use( 
  (res) => res,
  
  
  (error) => {
    // console.log(error)
    if (error.response?.status === 422) {
      const message = error.response?.data?.message || "Validation failed.";
      
      alert(`Error 422: ${message}`);
      store.dispatch(logOut());
      // logout(); // Clear tokens / localStorage etc.
      window.location.href = '/admin/login'; // Redirect to login or desired route
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
