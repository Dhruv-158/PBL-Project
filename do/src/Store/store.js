import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../State/authSlice"
import complaintsReducer from "../State/complaintsSlice"
import uiReducer from "../State/uiSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintsReducer,
    ui: uiReducer,
  },
})

export default store

