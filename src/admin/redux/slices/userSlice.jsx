import { createSlice } from '@reduxjs/toolkit';

// Get admin data from localStorage if exists
const storedAdmin = localStorage.getItem('adminData');
const initialState = storedAdmin ? JSON.parse(storedAdmin) : null;

const adminSlice = createSlice({
    name: 'adminData',
    initialState,
    reducers: {
        logIn: (_, action) => {
            const adminData = action.payload.payload;

            localStorage.setItem('adminData', JSON.stringify(adminData));
            return adminData;
        },
        logOut: () => {
            localStorage.removeItem('adminData');
            return null;
        },
        updateData: (state, action) => {
            const updates = action.payload; // fields to update

            

            if (!state) return state;

            const updatedAdmin = {
                adminId: updates.adminId,
                adminName: updates.name,
                email: updates.email,
            };

            localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
            return updatedAdmin;

        }
    }
});

export const { logIn, logOut, updateData } = adminSlice.actions;

export default adminSlice.reducer;
