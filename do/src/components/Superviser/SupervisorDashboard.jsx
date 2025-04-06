import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SupervisorDashboard.css";

// Import actions and selectors from slices
import { 
  selectFilteredComplaints, 
  fetchComplaints, 
  setSearchTerm, 
  setDateFilter, 
  setStatusFilter,
  requestIdentityInfo,
  selectStats
} from "../../State/complaintsSlice";

import { 
  toggleFilterDropdown, 
  selectFilterDropdownState,
  addNotification 
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

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const RequestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const SupervisorDashboard = () => {
  const dispatch = useDispatch();
  
  // Use Redux selectors to get state
  const complaints = useSelector(selectFilteredComplaints);
  const stats = useSelector(selectStats);
  const showFilterDropdown = useSelector(selectFilterDropdownState);
  const searchTerm = useSelector(state => state.complaints.searchTerm);
  const dateFilter = useSelector(state => state.complaints.dateFilter);
  const statusFilter = useSelector(state => state.complaints.statusFilter);
  
  // Fetch complaints when component mounts
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);
  
  // Handle forwarding request
  const handleForwardingRequest = (id) => {
    // Dispatch action to update the complaint status in Redux
    dispatch(requestIdentityInfo(id));
    
    // Create notification
    dispatch(addNotification({
      message: `Identity forwarding request for complaint ${id} has been sent to the administrator.`,
      type: 'success'
    }));
  };

  return (
    <div className="supervisor-dashboard">
      <h2 className="dashboard-title">Supervisor Dashboard</h2>
      
      <div className="dashboard-subtitle">
        You can view anonymous complaints and request identity information when necessary.
      </div>
      
      {/* Stats Section */}
      <div className="complaints-stats">
        <div className="stat-card">
          <div className="stat-title">Total Complaints</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card stat-requested">
          <div className="stat-title">Identity Requested</div>
          <div className="stat-value">{stats.identityRequests}</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-title">Pending Complaints</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
      </div>
      
      <div className="dashboard-header">
        <div className="search-container">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search by ID or complaint content" 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
        
        <div className="header-actions">
          <div className="date-filter">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => dispatch(setDateFilter(e.target.value))}
            />
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={() => dispatch(toggleFilterDropdown())}
            >
              <FilterIcon />
              Identity Status: {
                statusFilter === 'all' ? 'All' : 
                statusFilter === 'requested' ? 'Requested' : 'Not Requested'
              }
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => {
                  dispatch(setStatusFilter('all'));
                  dispatch(toggleFilterDropdown(false));
                }}>
                  All
                </div>
                <div className="filter-option" onClick={() => {
                  dispatch(setStatusFilter('requested'));
                  dispatch(toggleFilterDropdown(false));
                }}>
                  Identity Requested
                </div>
                <div className="filter-option" onClick={() => {
                  dispatch(setStatusFilter('not-requested'));
                  dispatch(toggleFilterDropdown(false));
                }}>
                  Not Requested
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Cards View */}
      <div className="complaints-container">
        {complaints.length > 0 ? (
          <div className="complaints-list">
            {complaints.map(complaint => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <div className="complaint-id">{complaint.id}</div>
                  <div className="complaint-date">Submitted: {complaint.date}</div>
                </div>
                <div className="complaint-body">
                  <div className="complaint-description">{complaint.description}</div>
                </div>
                <div className="complaint-footer">
                  <div className={`request-status ${complaint.identityRequested ? 'requested' : 'not-requested'}`}>
                    {complaint.identityRequested ? (
                      <>
                        <LockIcon /> Identity Information Requested
                      </>
                    ) : (
                      'No identity information requested'
                    )}
                  </div>
                  <button 
                    className={`request-button ${complaint.identityRequested ? 'disabled' : ''}`}
                    onClick={() => !complaint.identityRequested && handleForwardingRequest(complaint.id)}
                    disabled={complaint.identityRequested}
                  >
                    <RequestIcon />
                    {complaint.identityRequested ? 'Request Sent' : 'Request Identity Information'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No complaints found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;