import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:"post",
    initialState:{
        post:[],
    },
    reducers:{
        setPostUser:(state,action)=>{
            state.post = action.payload;
        }
    }
})

export const {setPostUser} = postSlice.actions;

export default postSlice.reducer;