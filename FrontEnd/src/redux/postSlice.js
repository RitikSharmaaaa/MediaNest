import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState:{
        post:[],
        selectedPost : null
    },
    reducers:{
        setPostUser:(state,action)=>{
            state.post = action.payload;
        },
        setSelectedPost:(state,action)=>{
            state.selectedPost = action.payload
        }
    }
})

export const {setPostUser,setSelectedPost} = postSlice.actions;

export default postSlice.reducer;