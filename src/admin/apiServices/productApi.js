
import axiosInstance from './axiosInstance';

const baseURL='/admin'

export const ALL_PRODUCT_API = async (limit,page,productSort) => {
        const response = await axiosInstance.get(`${baseURL}/products?limit=${limit}&page=${page}&stock=${productSort}`);
        return response.data;
}
export const TAKE_PRODUCT_CATEGORY = async () => {
       const response = await axiosInstance.get(`${baseURL}/productCategory`);
        return response.data;
} 
export const SUBMIT_NEW_PRODUCT = async (formData) => {
       const response = await axiosInstance.post(`${baseURL}/addProduct`,formData);
        return response.data;
} 
export const UPDATE_PRODUCT_DATA = async (formData) => {
       const response = await axiosInstance.put(`${baseURL}/product/update`,formData);
        return response.data;
}
export const UPDATE_PRODUCT_IMAGE = async (formData) => {
       const response = await axiosInstance.put(`${baseURL}/product/updateImage`,formData);
        return response.data;
} 
export const UPDATE_PRODUCT_LISTING=async (productId,list)=>{
        const response = await axiosInstance.patch(`${baseURL}/product/listing?id=${productId}&list=${list}`);
        return response.data
}
export const DELETE_PRODUCT=async (productId)=>{
        const response = await axiosInstance.delete(`${baseURL}/product/delete/${productId}`);
        return response.data
}
export const SEARCH_PRODUCT=async (value)=>{
        const response = await axiosInstance.get(`${baseURL}/product/search/${value}`);
        return response.data
}
export const UPDATE_PRODUCT_DETAILS=async(data)=>{
        const response = await axiosInstance.patch(`${baseURL}/product/updataDetails`,data);
        return response.data
}
 