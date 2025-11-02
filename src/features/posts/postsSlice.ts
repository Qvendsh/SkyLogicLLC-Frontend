import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../../api/axiosInstance.ts";

export interface Post {
    _id: string;
    title: string;
    text: string;
    createdAt: string;
}

interface PostsState {
    items: Post[];
    loading: boolean;
    error: string | null;
}

const initialState: PostsState = {
    items: [],
    loading: false,
    error: null
}

export const fetchPosts = createAsyncThunk(
    'posts/fetch',
    async (_, {rejectWithValue})=>{
    try {
        const res = await api.get('/posts')
        return res.data
    }catch(err:any){
        return rejectWithValue(err.response?.data?.message || "Failed to load posts");
    }
})

export const createPost = createAsyncThunk(
    'posts/create',
    async (data: {title: string, text: string}, {rejectWithValue}) => {
        try {
            const res = await api.post('/posts', data);
            return res.data
        }catch (err: any){
            return rejectWithValue(err.response?.data?.message || "Failed to create post");
        }
    }
)

export const deletePost = createAsyncThunk(
    'posts/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/posts/${id}`)
            return id
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete post')
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p._id !== action.payload)
            })
    }
})


export default postsSlice.reducer