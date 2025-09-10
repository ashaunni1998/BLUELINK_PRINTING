import axiosInstance from './axiosInstance';

const baseURL = '/admin'

export const UPDATE_ADMIN_DATA = async (data) => {
    const response = await axiosInstance.post(`${baseURL}/profile-update`, data);
    return response.data;
}

export const UPDATE_ADMIN_PASSWORD=async (data)=>{
    const response = await axiosInstance.post(`${baseURL}/profile/update-password`, data);
    return response.data;

}

export const TAKE_TOP_DATA=async ()=>{
    const response = await axiosInstance.get(`${baseURL}/dashboard-top`);
    return response.data;
}