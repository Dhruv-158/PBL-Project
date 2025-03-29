import React, { useState, useEffect } from "react";
import "./ClientDashboard.css";

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
  // State variables
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    department: "",
    description: ""
  });
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [complaints, setComplaints] = useState([
    {
      id: "COMP-001",
      subject: "Wi-Fi not working in dormitory",
      description: "I'm unable to connect to the Wi-Fi network in my dormitory room (Room 302, Block B) since yesterday evening. I've tried restarting my devices but the issue persists.",
      department: "IT Support",
      status: "pending",
      date: "2025-03-25",
      studentName: "John Smith",
      erNumber: "220203100027",
      college: "ASOIT",
      department: "Computer Science",
      contact: "9876543210"
    },
    {
      id: "COMP-002",
      subject: "Incorrect marks in midterm assessment",
      description: "My midterm assessment for Advanced Algorithms (CS-401) shows incorrect marks. I scored 42/50 as per the answer key but the system shows only 35/50.",
      department: "Examination Cell",
      status: "forwarded",
      forwardedTo: "Examination Cell",
      date: "2025-03-20",
      studentName: "John Smith",
      erNumber: "220203100027",
      college: "ASOIT", 
      department: "Computer Science",
      contact: "9876543210",
      response: {
        content: "We have forwarded your complaint to the concerned faculty. Your marks will be rechecked and updated within 48 hours.",
        date: "2025-03-21",
        by: "Examination Cell Coordinator"
      }
    },
    {
      id: "COMP-003",
      subject: "Refund for cancelled workshop",
      description: "I had registered for the Cloud Computing workshop scheduled for March 15th which was cancelled. I have not received my refund of Rs. 1500 yet.",
      department: "Accounts Department",
      status: "resolved",
      date: "2025-03-10",
      studentName: "John Smith",
      erNumber: "220203100027",
      college: "ASOIT",
      department: "Computer Science",
      contact: "9876543210",
      resolution: "Refund has been processed and will be credited to your account within 3-5 business days.",
      response: {
        content: "Your refund of Rs. 1500 has been processed (Transaction ID: REF-78945). The amount will be credited to your registered bank account within 3-5 business days.",
        date: "2025-03-12",
        by: "Accounts Department"
      }
    }
  ]);

  // Filter complaints based on active tab
  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === "all") return true;
    return complaint.status === activeTab;
  });

  // Handle complaint submission
  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    
    // Create new complaint object
    const newComplaintObj = {
      id: `COMP-${complaints.length + 1}`.padStart(7, '0'),
      subject: newComplaint.subject,
      description: newComplaint.description,
      department: newComplaint.department,
      status: "pending",
      date: new Date().toISOString().split('T')[0],
      studentName: "John Smith", // Mock data - would come from logged in user
      erNumber: "220203100027",  // Mock data - would come from logged in user
      college: "ASOIT",          // Mock data - would come from logged in user
      contact: "9876543210"      // Mock data - would come from logged in user
    };
    
    // Add to complaints array
    setComplaints([newComplaintObj, ...complaints]);
    
    // Reset form and close modal
    setNewComplaint({
      subject: "",
      department: "",
      description: ""
    });
    setShowCreateModal(false);
  };

  // Handle viewing complaint details
  const handleViewComplaint = (complaint) => {
    setCurrentComplaint(complaint);
    setShowViewModal(true);
  };

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">My Complaints</h2>
        <button className="create-button" onClick={() => setShowCreateModal(true)}>
          <PlusIcon />
          New Complaint
        </button>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Complaints
        </div>
        <div 
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </div>
        <div 
          className={`tab ${activeTab === "forwarded" ? "active" : ""}`}
          onClick={() => setActiveTab("forwarded")}
        >
          In Progress
        </div>
        <div 
          className={`tab ${activeTab === "resolved" ? "active" : ""}`}
          onClick={() => setActiveTab("resolved")}
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
            <button className="button button-primary" onClick={() => setShowCreateModal(true)}>
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
              <button className="close-button" onClick={() => setShowCreateModal(false)}>
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
                  onClick={() => setShowCreateModal(false)}
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
              <button className="close-button" onClick={() => setShowViewModal(false)}>
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
                onClick={() => setShowViewModal(false)}
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