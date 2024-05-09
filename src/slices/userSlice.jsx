import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        status: Cookies.get("isAuth") === "true" || false,
    },
    reducers: {
        changeStatus: (state, newStatus) => {
            state.status = newStatus.payload;
            Cookies.set("isAuth", state.status)
        },
    },
})


export const { changeStatus } = userSlice.actions

export default userSlice.reducer