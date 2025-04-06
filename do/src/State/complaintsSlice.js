import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API calls (replace with real API endpoints in production)
const fetchComplaintsAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "#eewwf",
          name: "John Doe",
          college: "ASOIT",
          department: "B-tech",
          contact: "9876543210",
          erno: "220203100014",
          status: "pending",
          date: "2025-03-15",
          description: "Issue with hostel room allocation. Requested single room but assigned shared accommodation without prior notice.",
          identityRequested: true
        },
        {
          id: "#klopoj",
          name: "Jane Smith",
          college: "SOCET",
          department: "B-tech",
          contact: "8765432109",
          erno: "220203100019",
          status: "forwarded",
          forwardedTo: "Hostel Administration",
          date: "2025-03-20",
          description: "Problems with Wi-Fi connectivity in Block B. Internet connection drops frequently making it difficult to attend online classes.",
          identityRequested: false
        },
        {
          id: "#poklnm",
          name: "Alex Johnson",
          college: "SOCCA",
          department: "BCA",
          contact: "7654321098",
          erno: "220203100018",
          status: "resolved",
          resolution: "Issue has been resolved. The student's fee structure has been updated as per the scholarship criteria.",
          date: "2025-03-10",
          description: "Scholarship amount not reflected in fee structure. Already submitted all required documents to the accounts department.",
          identityRequested: true,
          identityApproved: true
        }
      ]);
    }, 500);
  });
};

// Async thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async () => {
    const response = await fetchComplaintsAPI();
    return response;
  }
);

export const addComplaint = createAsyncThunk(
  'complaints/addComplaint',
  async (complaint) => {
    // Mock API call, would be real API in production
    return {
      id: `#${Math.random().toString(36).substr(2, 5)}`,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      identityRequested: false,
      ...complaint
    };
  }
);

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchTerm: '',
    dateFilter: '',
    statusFilter: 'all',
    currentComplaint: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setCurrentComplaint: (state, action) => {
      state.currentComplaint = action.payload;
    },
    updateComplaintStatus: (state, action) => {
      const { id, newStatus, additionalData } = action.payload;
      const complaint = state.items.find(c => c.id === id);
      if (complaint) {
        complaint.status = newStatus;
        if (additionalData) {
          Object.assign(complaint, additionalData);
        }
      }
    },
    approveIdentityRequest: (state, action) => {
      const complaint = state.items.find(c => c.id === action.payload);
      if (complaint) {
        complaint.identityApproved = true;
      }
    },
    denyIdentityRequest: (state, action) => {
      const complaint = state.items.find(c => c.id === action.payload);
      if (complaint) {
        complaint.identityRequested = false;
      }
    },
    requestIdentityInfo: (state, action) => {
      const complaint = state.items.find(c => c.id === action.payload);
      if (complaint) {
        complaint.identityRequested = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addComplaint.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

// Selectors
export const selectAllComplaints = (state) => state.complaints.items;

export const selectFilteredComplaints = (state) => {
  const { items, searchTerm, dateFilter, statusFilter } = state.complaints;
  
  return items.filter(complaint => {
    // Search filter
    const searchMatch = !searchTerm || 
                       (complaint.name && complaint.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                       complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (complaint.erno && complaint.erno.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    const dateMatch = !dateFilter || (complaint.date && complaint.date === dateFilter);
    
    // Status filter
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    
    return searchMatch && dateMatch && statusMatch;
  });
};

export const selectStats = (state) => {
  const items = state.complaints.items;
  return {
    total: items.length,
    pending: items.filter(c => c.status === 'pending').length,
    forwarded: items.filter(c => c.status === 'forwarded').length,
    resolved: items.filter(c => c.status === 'resolved').length,
    identityRequests: items.filter(c => c.identityRequested && !c.identityApproved).length
  };
};

export const selectCurrentComplaint = (state) => state.complaints.currentComplaint;

export const { 
  setSearchTerm, 
  setDateFilter, 
  setStatusFilter, 
  setCurrentComplaint,
  updateComplaintStatus,
  approveIdentityRequest,
  denyIdentityRequest,
  requestIdentityInfo
} = complaintsSlice.actions;

export default complaintsSlice.reducer;