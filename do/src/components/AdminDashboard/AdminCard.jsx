import React, { useState } from "react";
import "./AdminCard.css";

// Icon Components
const CloseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Button = ({ children, variant, onClick, className }) => (
  <button 
    className={`button ${variant === "outline" ? "button-outline" : "button-primary"} ${className || ""}`} 
    onClick={onClick}
  >
    {children}
  </button>
);

const ComplaintCard = ({ complaint, onStatusChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [status, setStatus] = useState(complaint.status || "pending");
  const [forwardTo, setForwardTo] = useState("");
  const [forwardNotes, setForwardNotes] = useState("");
  const [resolution, setResolution] = useState("");

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(complaint.id, newStatus);
    }
    setShowDetails(false);
  };

  // Handle forwarding
  const handleForward = () => {
    if (forwardTo.trim()) {
      setStatus("forwarded");
      if (onStatusChange) {
        onStatusChange(complaint.id, "forwarded", { 
          forwardedTo: forwardTo,
          forwardNotes: forwardNotes
        });
      }
      setShowForwardModal(false);
    }
  };

  // Handle resolution
  const handleResolve = () => {
    if (resolution.trim()) {
      setStatus("resolved");
      if (onStatusChange) {
        onStatusChange(complaint.id, "resolved", { resolution });
      }
      setShowDetails(false);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (status) {
      case "resolved":
        return "status-badge status-resolved";
      case "forwarded":
        return "status-badge status-forwarded";
      default:
        return "status-badge status-pending";
    }
  };

  return (
    <>
      <div className="card">
        <div className="event-layout">
          <div className="event-info">
            <div className="info-group">
              <div className="info-label">ID</div>
              <div className="info-value">{complaint.id}</div>
            </div>
            
            
            <div className="info-group">
              <div className="info-label">Name</div>
              <div className="info-value">{complaint.name}</div>
            </div>
            
            
            <div className="info-group">
              <div className="info-label">College</div>
              <div className="info-value">{complaint.Collage || complaint.College}</div>
            </div>
            
            
            <div className="info-group">
              <div className="info-label">Department</div>
              <div className="info-value">{complaint.Department}</div>
            </div>
            
            
            <div className="info-group">
              <div className="info-label">Contact</div>
              <div className="info-value">{complaint.Contect || complaint.Contact}</div>
            </div>
            
            
            <div className="info-group">
              <div className="info-label">ER No.</div>
              <div className="info-value">{complaint.Erno}</div>
            </div>
          
            
            <div className="info-group">
              <div className="info-label">Status</div>
              <div className={getStatusBadgeClass()}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="event-actions">
            <Button variant="outline" onClick={() => setShowDetails(true)}>
              View Details
            </Button>
            {status === "pending" && (
              <Button variant="primary" onClick={() => setShowForwardModal(true)}>
                Forward
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Details Modal */}
      {showDetails && (
        <div className="complaint-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Complaint Details</h3>
              <button className="close-button" onClick={() => setShowDetails(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="complaint-details">
              <div className="info-group">
                <div className="info-label">ID</div>
                <div className="info-value">{complaint.id}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Name</div>
                <div className="info-value">{complaint.name}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">College</div>
                <div className="info-value">{complaint.Collage || complaint.College}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Department</div>
                <div className="info-value">{complaint.Department}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Contact</div>
                <div className="info-value">{complaint.Contect || complaint.Contact}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">ER No.</div>
                <div className="info-value">{complaint.Erno}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Description</div>
                <div className="info-value">{complaint.description || "No description provided."}</div>
              </div>
              
              {status === "forwarded" && (
                <>
                  <div className="divider"></div>
                  <div className="info-group">
                    <div className="info-label">Forwarded To</div>
                    <div className="info-value">{complaint.forwardedTo || forwardTo}</div>
                  </div>
                  
                  {(complaint.forwardNotes || forwardNotes) && (
                    <>
                      <div className="divider"></div>
                      <div className="info-group">
                        <div className="info-label">Forward Notes</div>
                        <div className="info-value">{complaint.forwardNotes || forwardNotes}</div>
                      </div>
                    </>
                  )}
                </>
              )}
              
              {status === "resolved" && (
                <>
                  <div className="divider"></div>
                  <div className="info-group">
                    <div className="info-label">Resolution</div>
                    <div className="info-value">{complaint.resolution || resolution}</div>
                  </div>
                </>
              )}
              
              {status === "pending" && (
                <>
                  <div className="divider"></div>
                  <div className="info-group">
                    <div className="info-label">Resolution</div>
                    <textarea
                      placeholder="Enter resolution details..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #cbd5e1", marginTop: "0.5rem" }}
                      rows={4}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              
              {status === "pending" && (
                <Button variant="primary" onClick={handleResolve} disabled={!resolution.trim()}>
                  Resolve Complaint
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="complaint-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Forward Complaint</h3>
              <button className="close-button" onClick={() => setShowForwardModal(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="complaint-details">
              <div className="info-group">
                <div className="info-label">Complaint ID</div>
                <div className="info-value">{complaint.id}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Student Name</div>
                <div className="info-value">{complaint.name}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Description</div>
                <div className="info-value">{complaint.description || "No description provided."}</div>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Forward To</div>
                <select
                  value={forwardTo}
                  onChange={(e) => setForwardTo(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #cbd5e1", marginTop: "0.5rem" }}
                >
                  <option value="">Select department</option>
                  <option value="Academic Affairs">Academic Affairs</option>
                  <option value="Hostel Administration">Hostel Administration</option>
                  <option value="Examination Cell">Examination Cell</option>
                  <option value="Accounts Department">Accounts Department</option>
                  <option value="IT Support">IT Support</option>
                </select>
              </div>
              <div className="divider"></div>
              
              <div className="info-group">
                <div className="info-label">Additional Notes</div>
                <textarea
                  placeholder="Add any details or instructions for the receiving department..."
                  value={forwardNotes}
                  onChange={(e) => setForwardNotes(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid #cbd5e1", marginTop: "0.5rem" }}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowForwardModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleForward} disabled={!forwardTo}>
                Forward Complaint
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComplaintCard;