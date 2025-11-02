import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../api/axiosInstance.ts";

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading:false,
    error: null,
}


export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: {email: string, password: string}, { rejectWithValue }) => {
        try {
            const res = await api.post('/users/register', data)
            return res.data
        }catch(err: any){
            return rejectWithValue(err.response?.data?.message || "registration failed")
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: {email: string, password: string}, {rejectWithValue}) =>{
        try {
            const res = await api.post('auth/login', data)
            localStorage.setItem('token', res.data.access_token)
            return res.data
        }catch(err: any){
            return rejectWithValue(err.response?.data?.message || "login failed")
        }
    }
)


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        logout:(state) =>{
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        }
    },
    extraReducers:(builder) => {
        builder
            .addCase(registerUser.pending, (state)=>{
                state.loading = true;
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state)=>{
                state.loading = false
            })
            .addCase(registerUser.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                state.loading = false;
                state.token = action.payload.access_token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string;
            })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;