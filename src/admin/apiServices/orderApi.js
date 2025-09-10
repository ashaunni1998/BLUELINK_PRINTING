
import axiosInstance from './axiosInstance';

const baseURL = '/admin'

export const ALL_ORDER_API = async (limit, page, productSort) => {
        const response = await axiosInstance.get(`${baseURL}/orders?limit=${limit}&page=${page}&sort=${productSort}`);
        return response.data;
}

export const UPDATE_ORDER_STATUS_API = async (orderId, status) => {
        const response = await axiosInstance.put(`${baseURL}/order/status`, { orderId, status });
        return response.data;
}
export const GET_ORDER_DETAILS_API = async (orderId) => {
        const response = await axiosInstance.get(`${baseURL}/order/${orderId}`);
        return response.data;
}