import axiosInstance from './axiosInstance';

const baseURL='/admin'

export const LOGIN_API = async (loginData) => {
        const response = await axiosInstance.post(`${baseURL}/login`, loginData);
        return response.data;
}
export const LOGOUT_API = async () => {
        const response = await axiosInstance.post(`${baseURL}/logout`);
        return response.data;
}

