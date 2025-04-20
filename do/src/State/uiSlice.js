import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  loading: false,
  error: null,
  notification: null,
  sidebarOpen: true,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setNotification: (state, action) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { setLoading, setError, clearError, setNotification, clearNotification, toggleSidebar, setSidebarOpen } =
  uiSlice.actions

export default uiSlice.reducer
