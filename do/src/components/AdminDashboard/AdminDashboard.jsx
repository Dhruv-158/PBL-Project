"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchComplaints, fetchPendingAccessRequests, resolveAccessRequest } from "../../State/complaintsSlice"
import { logout } from "../../State/authSlice"
import { toggleSidebar } from "../../State/uiSlice"
import ComplaintCard from "./ComplaintCard"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { complaints } = useSelector((state) => state.complaints)
  const { pendingAccessRequests } = useSelector((state) => state.complaints)
  const { user } = useSelector((state) => state.auth)
  const { loading, sidebarOpen } = useSelector((state) => state.ui)

  const [activeTab, setActiveTab] = useState("complaints")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    dispatch(fetchComplaints())
    dispatch(fetchPendingAccessRequests())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const filteredComplaints = complaints.filter((complaint) => {
    if (filterStatus === "all") return true
    return complaint.status === filterStatus
  })

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
      >
        <div className="flex items-center space-x-2 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-extrabold">Admin Panel</span>
        </div>

        <nav className="mt-10">
          <a
            className={`flex items-center py-2 px-4 rounded transition duration-200 ${activeTab === "complaints" ? "bg-blue-700" : "hover:bg-blue-700"}`}
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
            className={`flex items-center py-2 px-4 rounded transition duration-200 ${activeTab === "access-requests" ? "bg-blue-700" : "hover:bg-blue-700"}`}
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
            {pendingAccessRequests.length > 0 && (
              <span className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {pendingAccessRequests.length}
              </span>
            )}
          </a>

          <a
            className="flex items-center py-2 px-4 rounded transition duration-200 hover:bg-blue-700"
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
              {activeTab === "complaints" ? "Manage Complaints" : "Access Requests"}
            </h1>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Welcome, {user?.name || "Admin"}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md"
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
                <h2 className="text-xl font-semibold">All Complaints</h2>

                <div className="mt-3 md:mt-0 flex items-center">
                  <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
                    Filter by Status:
                  </label>
                  <select
                    id="status-filter"
                    className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                    className="animate-spin h-8 w-8 text-blue-500"
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
                  <p className="text-gray-500">No complaints found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComplaints.map((complaint) => (
                    <ComplaintCard key={complaint._id} complaint={complaint} isAdmin={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "access-requests" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Access Requests</h2>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
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
              ) : pendingAccessRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No pending access requests.</p>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supervisor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Complaint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingAccessRequests.map((request) => (
                        <tr key={request._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.supervisorId?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.complaintId?.uniqueId || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                dispatch(resolveAccessRequest({ requestId: request._id, status: "approved" }))
                              }
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                dispatch(resolveAccessRequest({ requestId: request._id, status: "rejected" }))
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
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
    </div>
  )
}

export default AdminDashboard
