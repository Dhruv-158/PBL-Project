import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../config"
import { setLoading, setError, clearError } from "./uiSlice"

// Helper to set auth tokens
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
    localStorage.setItem("refreshToken", token)
  } else {
    delete axios.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  }
}

// Register user
export const register = createAsyncThunk("auth/register", async (userData, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true))
    dispatch(clearError())

    const response = await axios.post(`${API_URL}/auth/register`, userData)

    // Set token in axios headers and localStorage
    setAuthToken(response.data.tokens.accessToken)
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken)

    dispatch(setLoading(false))
    return response.data
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = error.response?.data?.error || "Registration failed"
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

// Login user
export const login = createAsyncThunk("auth/login", async (credentials, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true))
    dispatch(clearError())

    const response = await axios.post(`${API_URL}/auth/login`, credentials)

    // Set token in axios headers and localStorage
    setAuthToken(response.data.tokens.accessToken)
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken)

    dispatch(setLoading(false))
    return response.data
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = error.response?.data?.error || "Login failed"
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

// Refresh token
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { dispatch, rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      return rejectWithValue("No refresh token available")
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken })

    // Set new token in axios headers and localStorage
    setAuthToken(response.data.tokens.accessToken)
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken)

    return response.data
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Token refresh failed"
    return rejectWithValue(errorMessage)
  }
})

// Check if user is authenticated
export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { dispatch }) => {
  const token = localStorage.getItem("token")
  if (token) {
    setAuthToken(token)
    try {
      // Try to refresh the token to validate it
      await dispatch(refreshToken())
      return true
    } catch (error) {
      // If refresh fails, clear auth state
      dispatch(logout())
      return false
    }
  }
  return false
})

// Logout user
export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  setAuthToken(null)
  return true
})

const initialState = {
  isAuthenticated: false,
  user: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.tokens = action.payload.tokens
      })
      .addCase(register.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = { accessToken: null, refreshToken: null }
      })

      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.user = action.payload.user
        state.tokens = action.payload.tokens
      })
      .addCase(login.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = { accessToken: null, refreshToken: null }
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload.tokens
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = { accessToken: null, refreshToken: null }
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.tokens = { accessToken: null, refreshToken: null }
      })
  },
})

export default authSlice.reducer
