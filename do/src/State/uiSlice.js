import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showCreateModal: false,
    showViewModal: false,
    showFilterDropdown: false,
    showIdentityRequestModal: false,
    activeTab: 'all',
    notifications: []
  },
  reducers: {
    toggleCreateModal: (state, action) => {
      state.showCreateModal = action.payload !== undefined ? action.payload : !state.showCreateModal;
    },
    toggleViewModal: (state, action) => {
      state.showViewModal = action.payload !== undefined ? action.payload : !state.showViewModal;
    },
    toggleFilterDropdown: (state, action) => {
      state.showFilterDropdown = action.payload !== undefined ? action.payload : !state.showFilterDropdown;
    },
    toggleIdentityRequestModal: (state, action) => {
      state.showIdentityRequestModal = action.payload !== undefined ? action.payload : !state.showIdentityRequestModal;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info',
        timestamp: new Date().toISOString()
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

// Selectors
export const selectCreateModalState = (state) => state.ui.showCreateModal;
export const selectViewModalState = (state) => state.ui.showViewModal;
export const selectFilterDropdownState = (state) => state.ui.showFilterDropdown;
export const selectIdentityRequestModalState = (state) => state.ui.showIdentityRequestModal;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectNotifications = (state) => state.ui.notifications;

export const { 
  toggleCreateModal, 
  toggleViewModal, 
  toggleFilterDropdown, 
  toggleIdentityRequestModal,
  setActiveTab,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer;