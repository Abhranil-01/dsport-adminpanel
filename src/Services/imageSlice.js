import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    uploadedImages:[]
};
const imageSlice=createSlice({
    name:"image",
    initialState,
    reducers:{
    addUploadedImage: (state, action) => {
      state.uploadedImages.push(...action.payload);
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
    },
    }
})

export const {addUploadedImage, clearUploadedImages}=imageSlice.actions
export default imageSlice.reducer;