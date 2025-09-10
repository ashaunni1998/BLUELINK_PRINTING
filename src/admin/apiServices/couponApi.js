
import axiosInstance from './axiosInstance';

const baseURL = '/admin'

export const CREATE_COUPON = async (data) => {
    const response = await axiosInstance.post(`${baseURL}/create-coupon`, data);
    return response.data;
}
export const GET_ALL_COUPONS = async () => {    
    const response = await axiosInstance.get(`${baseURL}/coupons`);
    return response.data;
}
export const DELETE_COUPON = async (couponId) => {
    const response = await axiosInstance.delete(`${baseURL}/delete-coupon/${couponId}`);
    return response.data;
}
export const UPDATE_COUPON = async (couponId, data) => {
    const response = await axiosInstance.put(`${baseURL}/update-coupon/${couponId}`, data);
    return response.data;
}