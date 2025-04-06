import React, { useState } from "react";
import "./ComplaintCard.css";

// Icon Components
const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const ComplaintCard = ({ complaint, onStatusChange, onApproveIdentityRequest, onDenyIdentityRequest }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [forwardTo, setForwardTo] = useState("");
  const [resolution, setResolution] = useState("");

  return (
    <div className="complaint-card">
      <div className="card-header">
        <div className="complaint-id">{complaint.id}</div>
        <div className={`complaint-status status-${complaint.status}`}>
          {complaint.status === "pending" && "Pending"}
          {complaint.status === "forwarded" && "In Progress"}
          {complaint.status === "resolved" && "Resolved"}
        </div>
      </div>
      
      <div className="card-body">
        <div className="student-info">
          <div className="student-name">{complaint.name}</div>
          <div className="student-details">
            <span>College: {complaint.College || complaint.Collage}</span>
            <span>Department: {complaint.Department}</span>
            <span>Contact: {complaint.Contact || complaint.Contect}</span>
            <span>ER No: {complaint.Erno}</span>
          </div>
        </div>
        
        <div className="complaint-content">
          {complaint.description}
        </div>
        
        {complaint.identityRequested && !complaint.identityApproved && (
          <div className="identity-request-alert">
            <NotificationIcon />
            <div className="identity-request-content">
              <p>Supervisor has requested student's identity information</p>
              <div className="identity-request-actions">
                <button 
                  className="approve-button"
                  onClick={() => onApproveIdentityRequest(complaint.id)}
                >
                  <CheckIcon />
                  Approve
                </button>
                <button 
                  className="deny-button"
                  onClick={() => onDenyIdentityRequest(complaint.id)}
                >
                  <CloseIcon />
                  Deny
                </button>
              </div>
            </div>
          </div>
        )}
        
        {complaint.status === "forwarded" && complaint.forwardedTo && (
          <div className="forwarded-info">
            <p>Forwarded to: <strong>{complaint.forwardedTo}</strong></p>
          </div>
        )}
        
        {complaint.status === "resolved" && complaint.resolution && (
          <div className="resolution-info">
            <p>Resolution: {complaint.resolution}</p>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="complaint-date">
          <CalendarIcon />
          <span style={{ marginLeft: '8px' }}>{complaint.date}</span>
        </div>
        
        <div className="status-change-container">
          <button 
            className="status-button"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            Change Status
          </button>
          
          {showStatusDropdown && (
            <div className="status-dropdown">
              {complaint.status !== "pending" && (
                <div 
                  className="status-option"
                  onClick={() => {
                    onStatusChange(complaint.id, "pending");
                    setShowStatusDropdown(false);
                  }}
                >
                  Mark as Pending
                </div>
              )}
              
              {complaint.status !== "forwarded" && (
                <div className="status-option-with-input">
                  <input
                    type="text"
                    placeholder="Forward to (Department)"
                    value={forwardTo}
                    onChange={(e) => setForwardTo(e.target.value)}
                  />
                  <button
                    className="small-button"
                    disabled={!forwardTo}
                    onClick={() => {
                      onStatusChange(complaint.id, "forwarded", { forwardedTo: forwardTo });
                      setShowStatusDropdown(false);
                      setForwardTo("");
                    }}
                  >
                    Forward Complaint
                  </button>
                </div>
              )}
              
              {complaint.status !== "resolved" && (
                <div className="status-option-with-input">
                  <input
                    type="text"
                    placeholder="Resolution details"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  />
                  <button
                    className="small-button"
                    disabled={!resolution}
                    onClick={() => {
                      onStatusChange(complaint.id, "resolved", { resolution });
                      setShowStatusDropdown(false);
                      setResolution("");
                    }}
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;