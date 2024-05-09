import { createSlice } from '@reduxjs/toolkit'


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        status:  localStorage.getItem("isAuth") === "true" || false,
    },
    reducers: {
        changeStatus: (state, newStatus) => {
            state.status = newStatus.payload;
            localStorage.setItem("isAuth", state.status)
        },
    },
})


export const { changeStatus } = userSlice.actions

export default userSlice.reducer