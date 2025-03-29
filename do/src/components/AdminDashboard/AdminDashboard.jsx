import React, { useState } from "react";
import "./AdminDashboard.css";
import ComplaintCard from "./AdminCard";

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

const ComplaintDashboard = () => {
  // Initial complaints data with status
  const [complaints, setComplaints] = useState([
    {
      id: "#eewwf",
      name: "John Doe",
      Collage: "ASOIT",
      Department: "B-tech",
      Contect: "9876543210",
      Erno: "220203100014",
      status: "pending",
      date: "2025-03-15",
      description: "Issue with hostel room allocation. Requested single room but assigned shared accommodation without prior notice."
    },
    {
      id: "#klopoj",
      name: "Jane Smith",
      College: "SOCET",
      Department: "B-tech",
      Contact: "8765432109",
      Erno: "220203100019",
      status: "forwarded",
      forwardedTo: "Hostel Administration",
      date: "2025-03-20",
      description: "Problems with Wi-Fi connectivity in Block B. Internet connection drops frequently making it difficult to attend online classes."
    },
    {
      id: "#poklnm",
      name: "Alex Johnson",
      College: "SOCCA",
      Department: "BCA",
      Contact: "7654321098",
      Erno: "220203100018",
      status: "resolved",
      resolution: "Issue has been resolved. The student's fee structure has been updated as per the scholarship criteria.",
      date: "2025-03-10",
      description: "Scholarship amount not reflected in fee structure. Already submitted all required documents to the accounts department."
    }
  ]);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Handle status change
  const handleStatusChange = (id, newStatus, additionalData = {}) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id 
        ? { ...complaint, status: newStatus, ...additionalData } 
        : complaint
    ));
  };

  // Filter complaints based on search, date, and status
  const filteredComplaints = complaints.filter(complaint => {
    // Search filter
    const searchMatch = complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (complaint.Erno && complaint.Erno.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Date filter
    const dateMatch = !dateFilter || (complaint.date && complaint.date === dateFilter);
    
    // Status filter
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    
    return searchMatch && dateMatch && statusMatch;
  });

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    forwarded: complaints.filter(c => c.status === 'forwarded').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="complaint-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      
      {/* Stats Section */}
      <div className="complaints-stats">
        <div className="stat-card">
          <div className="stat-title">Total Complaints</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-title">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card stat-forwarded">
          <div className="stat-title">Forwarded</div>
          <div className="stat-value">{stats.forwarded}</div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-title">Resolved</div>
          <div className="stat-value">{stats.resolved}</div>
        </div>
      </div>
      
      <div className="dashboard-header">
        <div className="search-container">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search by name, ID, or ER number" 
            className="search-input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="header-actions">
          <div className="date-filter">
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FilterIcon />
              Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => {
                  setStatusFilter('all');
                  setShowFilterDropdown(false);
                }}>
                  All
                </div>
                <div className="filter-option" onClick={() => {
                  setStatusFilter('pending');
                  setShowFilterDropdown(false);
                }}>
                  Pending
                </div>
                <div className="filter-option" onClick={() => {
                  setStatusFilter('forwarded');
                  setShowFilterDropdown(false);
                }}>
                  Forwarded
                </div>
                <div className="filter-option" onClick={() => {
                  setStatusFilter('resolved');
                  setShowFilterDropdown(false);
                }}>
                  Resolved
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Cards View */}
      <div className="complaints-container">
        {filteredComplaints.length > 0 ? (
          <div className="complaints-list">
            {filteredComplaints.map(complaint => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint} 
                onStatusChange={handleStatusChange}
              />
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

export default ComplaintDashboard;