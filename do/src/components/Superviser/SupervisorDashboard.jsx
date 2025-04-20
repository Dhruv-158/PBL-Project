"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchComplaints, requestAccess } from "../../State/complaintsSlice"
import { logout } from "../../State/authSlice"
import { toggleSidebar } from "../../State/uiSlice"
import axios from "axios"
import { API_URL } from "../../config"

const SupervisorDashboard = () => {
  const dispatch = useDispatch()
  const { complaints } = useSelector((state) => state.complaints)
  const { user } = useSelector((state) => state.auth)
  const { loading, sidebarOpen } = useSelector((state) => state.ui)

  const [filterStatus, setFilterStatus] = useState("all")
  const [accessRequests, setAccessRequests] = useState([])
  const [activeTab, setActiveTab] = useState("complaints")
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [accessReason, setAccessReason] = useState("")
  const [studentDetails, setStudentDetails] = useState(null)
  const [showAccessModal, setShowAccessModal] = useState(false)

  useEffect(() => {
    dispatch(fetchComplaints())
    fetchAccessRequests()
  }, [dispatch])

  const fetchAccessRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/access-requests/my-requests`)
      setAccessRequests(response.data)
    } catch (error) {
      console.error("Error fetching access requests:", error)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleStatusChange = async (complaintId, status) => {
    try {
      await axios.put(`${API_URL}/complaints/${complaintId}`, { status })
      dispatch(fetchComplaints())
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleAddComment = async (complaintId, text) => {
    try {
      await axios.post(`${API_URL}/complaints/${complaintId}/comments`, { text })
      dispatch(fetchComplaints())
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleRequestAccess = async (complaintId) => {
    setSelectedComplaint(complaintId)
    setShowAccessModal(true)
  }

  const submitAccessRequest = async () => {
    if (!accessReason.trim()) return

    try {
      await dispatch(
        requestAccess({
          complaintId: selectedComplaint,
          reason: accessReason,
        }),
      )
      setShowAccessModal(false)
      setAccessReason("")
      fetchAccessRequests()
    } catch (error) {
      console.error("Error requesting access:", error)
    }
  }

  const fetchStudentDetails = async (complaintId) => {
    try {
      const response = await axios.get(`${API_URL}/access-requests/complaints/${complaintId}/student-details`)
      setStudentDetails(response.data.studentDetails)
    } catch (error) {
      if (error.response?.data?.requestRequired) {
        handleRequestAccess(complaintId)
      }
      console.error("Error fetching student details:", error)
    }
  }

  const filteredComplaints = complaints.filter((complaint) => {
    if (filterStatus === "all") return true
    return complaint.status === filterStatus
  })

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-emerald-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
      >
        <div className="flex items-center space-x-2 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-extrabold">Supervisor</span>
        </div>

        <nav className="mt-10">
          <a
            className={`flex items-center py-2 px-4 rounded transition duration-200 ${activeTab === "complaints" ? "bg-emerald-700" : "hover:bg-emerald-700"}`}
            href="#"
            onClick={() => setActiveTab("complaints")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Complaints
          </a>

          <a
            className={`flex items-center py-2 px-4 rounded transition duration-200 ${activeTab === "access-requests" ? "bg-emerald-700" : "hover:bg-emerald-700"}`}
            href="#"
            onClick={() => setActiveTab("access-requests")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Access Requests
          </a>

          <a
            className="flex items-center py-2 px-4 rounded transition duration-200 hover:bg-emerald-700"
            href="#"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-md flex items-center justify-between p-4">
          <div className="flex items-center">
            <button onClick={() => dispatch(toggleSidebar())} className="text-gray-500 focus:outline-none md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold ml-4">
              {activeTab === "complaints" ? "Assigned Complaints" : "Access Requests"}
            </h1>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Welcome, {user?.name || "Supervisor"}</span>
            <button
              onClick={handleLogout}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {activeTab === "complaints" && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold">Assigned Complaints</h2>

                <div className="mt-3 md:mt-0 flex items-center">
                  <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
                    Filter by Status:
                  </label>
                  <select
                    id="status-filter"
                    className="border-gray-300 rounded-md shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <svg
                    className="animate-spin h-8 w-8 text-emerald-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No complaints assigned to you.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComplaints.map((complaint) => (
                    <div key={complaint._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.uniqueId}</h3>
                            <p className="text-sm text-gray-500 mb-2">Student: {complaint.studentName}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                complaint.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : complaint.status === "in-review"
                                    ? "bg-blue-100 text-blue-800"
                                    : complaint.status === "resolved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {complaint.status}
                            </span>
                            <span
                              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                complaint.priority === "low"
                                  ? "bg-green-100 text-green-800"
                                  : complaint.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : complaint.priority === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {complaint.priority}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div>
                            <label
                              htmlFor={`status-${complaint._id}`}
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Update Status
                            </label>
                            <select
                              id={`status-${complaint._id}`}
                              className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                              value={complaint.status}
                              onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-review">In Review</option>
                              <option value="resolved">Resolved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`comment-${complaint._id}`}
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Add Comment
                            </label>
                            <div className="flex">
                              <input
                                id={`comment-${complaint._id}`}
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 text-sm border-gray-300 rounded-l-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                              />
                              <button
                                onClick={() => {
                                  const commentText = document.getElementById(`comment-${complaint._id}`).value
                                  if (commentText.trim()) {
                                    handleAddComment(complaint._id, commentText)
                                    document.getElementById(`comment-${complaint._id}`).value = ""
                                  }
                                }}
                                className="bg-emerald-500 text-white px-3 py-1 rounded-r-md text-sm hover:bg-emerald-600"
                              >
                                Send
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => fetchStudentDetails(complaint._id)}
                            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600"
                          >
                            View Student Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "access-requests" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">My Access Requests</h2>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <svg
                    className="animate-spin h-8 w-8 text-emerald-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : accessRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No access requests found.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Complaint ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accessRequests.map((request) => (
                        <tr key={request._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.complaintId?.uniqueId || request.complaintId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Access Request Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Request Student Details Access</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason why you need access to the student's personal information.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-emerald-500 focus:border-emerald-500"
              rows="4"
              placeholder="Reason for access request..."
              value={accessReason}
              onChange={(e) => setAccessReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAccessModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAccessRequest}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {studentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Student Details</h3>
              <button onClick={() => setStudentDetails(null)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{studentDetails.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{studentDetails.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="text-sm text-gray-900">{studentDetails.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Enrollment ID</p>
                <p className="text-sm text-gray-900">{studentDetails.enrollmentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">College</p>
                <p className="text-sm text-gray-900">{studentDetails.college}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="text-sm text-gray-900">{studentDetails.department}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStudentDetails(null)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupervisorDashboard
