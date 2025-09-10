import axiosInstance from './axiosInstance';

const baseURL='/admin'

export const TAKE_USER_API = async (PAGE,LIMIT) => { 
        const response = await axiosInstance.get(`${baseURL}/users?limit=${LIMIT}&page=${PAGE}`);
        return response.data;
}
export const USER_BLOCK_API = async (userId,action) => {
        const response = await axiosInstance.patch(`${baseURL}/blockUsers?userId=${userId}&action=${action}`);
        return response.data;
}
export const USER_SEARCH_API = async (searchValue) => {
        const response = await axiosInstance.get(`${baseURL}/search/${searchValue}`);
        return response.data;
}
export const TAKE_USER_DETAILS=async (userId)=>{
        const response = await axiosInstance.get(`${baseURL}/userData/${userId}`);
        return response.data
}


