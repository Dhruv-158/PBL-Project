import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../config"
import { setLoading, setError, clearError } from "./uiSlice"

// Get all complaints
export const fetchComplaints = createAsyncThunk("complaints/fetchAll", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true))
    dispatch(clearError())

    const response = await axios.get(`${API_URL}/complaints`)

    dispatch(setLoading(false))
    return response.data
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = error.response?.data?.message || "Failed to fetch complaints"
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

// Get complaint by ID
export const fetchComplaintById = createAsyncThunk(
  "complaints/fetchById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.get(`${API_URL}/complaints/${id}`)

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to fetch complaint"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Create new complaint
export const createComplaint = createAsyncThunk(
  "complaints/create",
  async (complaintData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.post(`${API_URL}/complaints`, complaintData)

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to create complaint"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Update complaint
export const updateComplaint = createAsyncThunk(
  "complaints/update",
  async ({ id, complaintData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.put(`${API_URL}/complaints/${id}`, complaintData)

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to update complaint"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Add comment to complaint
export const addComment = createAsyncThunk(
  "complaints/addComment",
  async ({ id, text }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.post(`${API_URL}/complaints/${id}/comments`, { text })

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to add comment"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Assign complaint to supervisor (admin only)
export const assignComplaint = createAsyncThunk(
  "complaints/assign",
  async ({ id, supervisorId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.patch(`${API_URL}/complaints/${id}/assign`, { supervisorId })

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to assign complaint"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Delete complaint
export const deleteComplaint = createAsyncThunk("complaints/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true))
    dispatch(clearError())

    await axios.delete(`${API_URL}/complaints/${id}`)

    dispatch(setLoading(false))
    return id
  } catch (error) {
    dispatch(setLoading(false))
    const errorMessage = error.response?.data?.message || "Failed to delete complaint"
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

// Request access to student details (supervisor only)
export const requestAccess = createAsyncThunk(
  "complaints/requestAccess",
  async ({ complaintId, reason }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.post(`${API_URL}/access-requests/complaints/${complaintId}/request-access`, {
        reason,
      })

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to request access"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Get pending access requests (admin only)
export const fetchPendingAccessRequests = createAsyncThunk(
  "complaints/fetchPendingAccessRequests",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.get(`${API_URL}/access-requests/pending`)

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to fetch access requests"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

// Resolve access request (admin only)
export const resolveAccessRequest = createAsyncThunk(
  "complaints/resolveAccessRequest",
  async ({ requestId, status }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      dispatch(clearError())

      const response = await axios.patch(`${API_URL}/access-requests/${requestId}/resolve`, { status })

      dispatch(setLoading(false))
      return response.data
    } catch (error) {
      dispatch(setLoading(false))
      const errorMessage = error.response?.data?.message || "Failed to resolve access request"
      dispatch(setError(errorMessage))
      return rejectWithValue(errorMessage)
    }
  },
)

const initialState = {
  complaints: [],
  currentComplaint: null,
  accessRequests: [],
  pendingAccessRequests: [],
}

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all complaints
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload
      })

      // Fetch complaint by ID
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.currentComplaint = action.payload
      })

      // Create complaint
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.complaints.unshift(action.payload)
      })

      // Update complaint
      .addCase(updateComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex((c) => c._id === action.payload._id)
        if (index !== -1) {
          state.complaints[index] = action.payload
        }
        if (state.currentComplaint && state.currentComplaint._id === action.payload._id) {
          state.currentComplaint = action.payload
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.complaints.findIndex((c) => c._id === action.payload._id)
        if (index !== -1) {
          state.complaints[index] = action.payload
        }
        if (state.currentComplaint && state.currentComplaint._id === action.payload._id) {
          state.currentComplaint = action.payload
        }
      })

      // Assign complaint
      .addCase(assignComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex((c) => c._id === action.payload._id)
        if (index !== -1) {
          state.complaints[index] = action.payload
        }
        if (state.currentComplaint && state.currentComplaint._id === action.payload._id) {
          state.currentComplaint = action.payload
        }
      })

      // Delete complaint
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.complaints = state.complaints.filter((c) => c._id !== action.payload)
        if (state.currentComplaint && state.currentComplaint._id === action.payload) {
          state.currentComplaint = null
        }
      })

      // Fetch pending access requests
      .addCase(fetchPendingAccessRequests.fulfilled, (state, action) => {
        state.pendingAccessRequests = action.payload
      })

      // Request access
      .addCase(requestAccess.fulfilled, (state, action) => {
        // No state update needed, just UI notification
      })

      // Resolve access request
      .addCase(resolveAccessRequest.fulfilled, (state, action) => {
        state.pendingAccessRequests = state.pendingAccessRequests.filter(
          (req) => req._id !== action.payload.request._id,
        )
      })
  },
})

export const { clearCurrentComplaint } = complaintsSlice.actions

export default complaintsSlice.reducer
