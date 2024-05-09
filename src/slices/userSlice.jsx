import { createSlice } from '@reduxjs/toolkit'
import {getCookie, setCookie} from "../functions";


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        status:  getCookie("isAuth") === "true" || false,
    },
    reducers: {
        changeStatus: (state, newStatus) => {
            state.status = newStatus.payload;
            setCookie("isAuth", state.status, 7)
        },
    },
})


export const { changeStatus } = userSlice.actions

export default userSlice.reducer