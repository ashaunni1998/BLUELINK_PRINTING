
import axiosInstance from './axiosInstance';

const baseURL = '/admin'

export const TAKE_CATEGORY_DATA = async (limit, page,sort) => {
    const response = await axiosInstance.get(`${baseURL}/category?limit=${limit}&page=${page}&sort=${sort}`);
    return response.data;
}
export const ADD_CATEGORY = async (data) => {
    const response = await axiosInstance.post(`${baseURL}/addCategory`, data);
    return response.data;
}
export const EDIT_CATEGORY = async (data) => {
    const response = await axiosInstance.put(`${baseURL}/category/update`, data);
    return response.data;
}
export const DELETE_CATEGORY = async (categoryId) => {
    const response = await axiosInstance.delete(`${baseURL}/category/delete/${categoryId}`);
    return response.data;
}
export const UPDATE_CATEGORY_STATUS = async (categoryId, action) => {
    const response = await axiosInstance.patch(`${baseURL}/category/listing?id=${categoryId}&list=${action}`);
    return response.data;
}
export const SEARCH_CATEGORY = async (value) => {
    const response = await axiosInstance.get(`${baseURL}/category/${value}`);
    return response.data;
}
