import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API calls
const loginAPI = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock authentication logic (replace with real auth)
      if (credentials.username === "student" && credentials.password === "password") {
        resolve({
          id: "1",
          name: "John Smith",
          role: "student",
          erNumber: "220203100027",
          college: "ASOIT",
          department: "Computer Science",
          contact: "9876543210",
        })
      } else if (credentials.username === "admin" && credentials.password === "password") {
        resolve({
          id: "2",
          name: "Admin User",
          role: "admin",
        })
      } else if (credentials.username === "supervisor" && credentials.password === "password") {
        resolve({
          id: "3",
          name: "Supervisor User",
          role: "supervisor",
          department: "Hostel Administration",
        })
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 500)
  })
}

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const user = await loginAPI(credentials)
    // Save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(user))
    return user
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      localStorage.removeItem("user")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error
export const selectUserRole = (state) => state.auth.user?.role

export const { logout } = authSlice.actions

export default authSlice.reducer

