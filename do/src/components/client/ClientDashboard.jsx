import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ClientDashboard.css";

// Import actions and selectors
import { 
  fetchComplaints, 
  selectFilteredComplaints,
  setCurrentComplaint,
  addComplaint
} from "../../State/complaintsSlice";

import {
  toggleCreateModal,
  toggleViewModal,
  setActiveTab,
  selectActiveTab,
  selectCreateModalState,
  selectViewModalState
} from "../../State/uiSlice";

import { selectCurrentUser } from "../../State/authSlice";

// Icon Components
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const ClientDashboard = () => {
  const dispatch = useDispatch();

  // Get user information from auth slice
  const currentUser = useSelector(selectCurrentUser);

  // Get UI state
  const activeTab = useSelector(selectActiveTab);
  const showCreateModal = useSelector(selectCreateModalState);
  const showViewModal = useSelector(selectViewModalState);
  
  // Get complaint data
  const filteredComplaints = useSelector(state => {
    const complaints = selectFilteredComplaints(state);
    // Filter for current user's complaints only
    return complaints.filter(c => c.erNumber === currentUser?.erNumber || c.erno === currentUser?.erNumber);
  });
  
  const currentComplaint = useSelector(state => state.complaints.currentComplaint);
  
  // Local state for the new complaint form
  const [newComplaint, setNewComplaint] = React.useState({
    subject: "",
    department: "",
    description: ""
  });

  // Fetch complaints on component mount
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // Handle complaint submission
  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    
    // Create new complaint object with user data
    const complaintToSubmit = {
      subject: newComplaint.subject,
      description: newComplaint.description,
      department: newComplaint.department,
      studentName: currentUser.name,
      erNumber: currentUser.erNumber,
      college: currentUser.college,
      contact: currentUser.contact
    };
    
    // Dispatch action to add complaint
    dispatch(addComplaint(complaintToSubmit));
    
    // Reset form and close modal
    setNewComplaint({
      subject: "",
      department: "",
      description: ""
    });
    dispatch(toggleCreateModal(false));
  };

  // Handle viewing complaint details
  const handleViewComplaint = (complaint) => {
    dispatch(setCurrentComplaint(complaint));
    dispatch(toggleViewModal(true));
  };

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">My Complaints</h2>
        <button className="create-button" onClick={() => dispatch(toggleCreateModal(true))}>
          <PlusIcon />
          New Complaint
        </button>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("all"))}
        >
          All Complaints
        </div>
        <div 
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("pending"))}
        >
          Pending
        </div>
        <div 
          className={`tab ${activeTab === "forwarded" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("forwarded"))}
        >
          In Progress
        </div>
        <div 
          className={`tab ${activeTab === "resolved" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("resolved"))}
        >
          Resolved
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="complaints-container">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(complaint => (
            <div className="complaint-card" key={complaint.id}>
              <div className="complaint-header">
                <div className="complaint-id">{complaint.id}</div>
                <div className={`complaint-status status-${complaint.status}`}>
                  {complaint.status === "pending" && "Pending"}
                  {complaint.status === "forwarded" && "In Progress"}
                  {complaint.status === "resolved" && "Resolved"}
                </div>
              </div>
              
              <div className="complaint-body">
                <div className="complaint-subject">{complaint.subject}</div>
                <div className="complaint-description">
                  {complaint.description.length > 150 
                    ? `${complaint.description.substring(0, 150)}...` 
                    : complaint.description}
                </div>
                
                <div className="complaint-meta">
                  <div className="complaint-date">
                    <CalendarIcon />
                    Submitted on {complaint.date}
                  </div>
                  <div className="complaint-action" onClick={() => handleViewComplaint(complaint)}>
                    <EyeIcon />
                    View Details
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ClipboardIcon />
            </div>
            <h3 className="empty-state-title">No complaints found</h3>
            <p className="empty-state-description">
              {activeTab === "all" 
                ? "You haven't submitted any complaints yet." 
                : `You don't have any ${activeTab} complaints.`}
            </p>
            <button className="button button-primary" onClick={() => dispatch(toggleCreateModal(true))}>
              Submit a Complaint
            </button>
          </div>
        )}
      </div>
      
      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Submit New Complaint</h3>
              <button className="close-button" onClick={() => dispatch(toggleCreateModal(false))}>
                <CloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleSubmitComplaint}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    className="form-input"
                    placeholder="Brief title for your complaint"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department</label>
                  <select
                    id="department"
                    className="form-input"
                    value={newComplaint.department}
                    onChange={(e) => setNewComplaint({...newComplaint, department: e.target.value})}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Academic Affairs">Academic Affairs</option>
                    <option value="Hostel Administration">Hostel Administration</option>
                    <option value="Examination Cell">Examination Cell</option>
                    <option value="Accounts Department">Accounts Department</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-textarea"
                    placeholder="Detailed description of your complaint..."
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="button button-secondary"
                  onClick={() => dispatch(toggleCreateModal(false))}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button button-primary"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Complaint Modal */}
      {showViewModal && currentComplaint && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Complaint Details</h3>
              <button className="close-button" onClick={() => dispatch(toggleViewModal(false))}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">ID</label>
                <div className="form-input">{currentComplaint.id}</div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject</label>
                <div className="form-input">{currentComplaint.subject}</div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Department</label>
                <div className="form-input">{currentComplaint.department}</div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <div className="form-textarea">{currentComplaint.description}</div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Status</label>
                <div className={`complaint-status status-${currentComplaint.status}`}>
                  {currentComplaint.status === "pending" && "Pending"}
                  {currentComplaint.status === "forwarded" && "In Progress"}
                  {currentComplaint.status === "resolved" && "Resolved"}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Submitted On</label>
                <div className="form-input">{currentComplaint.date}</div>
              </div>
              
              {currentComplaint.status === "forwarded" && (
                <div className="form-group">
                  <label className="form-label">Forwarded To</label>
                  <div className="form-input">{currentComplaint.forwardedTo}</div>
                </div>
              )}
              
              {currentComplaint.status === "resolved" && (
                <div className="form-group">
                  <label className="form-label">Resolution</label>
                  <div className="form-textarea">{currentComplaint.resolution}</div>
                </div>
              )}
              
              {currentComplaint.response && (
                <div className="response-section">
                  <h4 className="response-title">Response from {currentComplaint.forwardedTo || "Administration"}</h4>
                  <div className="response-content">{currentComplaint.response.content}</div>
                  <div className="response-meta">
                    <div>Responded by: {currentComplaint.response.by}</div>
                    <div>Date: {currentComplaint.response.date}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="button button-secondary"
                onClick={() => dispatch(toggleViewModal(false))}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;