import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./AdminDashboard.css";
import ComplaintCard from "./ComplaintCard";

// Import actions and selectors
import { 
  fetchComplaints, 
  selectFilteredComplaints, 
  selectStats,
  setSearchTerm,
  setDateFilter,
  setStatusFilter,
  updateComplaintStatus,
  approveIdentityRequest,
  denyIdentityRequest
} from "../../State/complaintsSlice";

import {
  toggleFilterDropdown,
  selectFilterDropdownState
} from "../../State/uiSlice";

// Icon Components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const filteredComplaints = useSelector(selectFilteredComplaints);
  const stats = useSelector(selectStats);
  const showFilterDropdown = useSelector(selectFilterDropdownState);
  
  // Get search and filter values
  const searchTerm = useSelector(state => state.complaints.searchTerm);
  const dateFilter = useSelector(state => state.complaints.dateFilter);
  const statusFilter = useSelector(state => state.complaints.statusFilter);

  // Fetch complaints on component mount
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // Handle status change
  const handleStatusChange = (id, newStatus, additionalData = {}) => {
    dispatch(updateComplaintStatus({ id, newStatus, additionalData }));
  };

  // Handle identity request approval
  const handleApproveIdentityRequest = (id) => {
    dispatch(approveIdentityRequest(id));
    
    // Show a notification (in a real app, you'd use a toast component)
    alert(`Identity information for complaint ${id} has been approved and shared with the supervisor.`);
  };

  // Handle identity request denial
  const handleDenyIdentityRequest = (id) => {
    dispatch(denyIdentityRequest(id));
    
    // Show a notification
    alert(`Identity information request for complaint ${id} has been denied.`);
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      
      {/* Stats Section */}
      <div className="complaints-stats">
        <div className="stat-card">
          <div className="stat-title">Total Complaints</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">In Progress</div>
          <div className="stat-value">{stats.forwarded}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Resolved</div>
          <div className="stat-value">{stats.resolved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Identity Requests</div>
          <div className="stat-value">{stats.identityRequests}</div>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-bar">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search by name, ID or ER number" 
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        
        <div className="filter-container">
          <button 
            className="filter-button"
            onClick={() => dispatch(toggleFilterDropdown())}
          >
            <FilterIcon />
            Filter
          </button>
          
          {showFilterDropdown && (
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="forwarded">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => dispatch(setDateFilter(e.target.value))}
                />
              </div>
              
              <button 
                className="clear-filter-button"
                onClick={() => {
                  dispatch(setStatusFilter('all'));
                  dispatch(setDateFilter(''));
                  dispatch(toggleFilterDropdown(false));
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="complaints-list">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <ComplaintCard 
              key={complaint.id}
              complaint={complaint}
              onStatusChange={handleStatusChange}
              onApproveIdentityRequest={handleApproveIdentityRequest}
              onDenyIdentityRequest={handleDenyIdentityRequest}
            />
          ))
        ) : (
          <div className="no-complaints-message">
            <p>No complaints match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;