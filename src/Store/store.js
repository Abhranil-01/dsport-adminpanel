import { configureStore } from "@reduxjs/toolkit";
import { fetchDataFromApi } from "../Services/fetchDataFromApi.js";
import imageSlice from "../Services/imageSlice.js";

const store = configureStore({
  reducer: {
    [fetchDataFromApi.reducerPath]: fetchDataFromApi.reducer,
    image: imageSlice,
  },
  middleware: (prevMiddleWare) =>
    prevMiddleWare().concat(fetchDataFromApi.middleware),
});

export { store };
