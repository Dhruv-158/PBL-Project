"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchComplaints, createComplaint, deleteComplaint, addComment } from "../../State/complaintsSlice"
import { logout } from "../../State/authSlice"
import { toggleSidebar } from "../../State/uiSlice"

const ClientDashboard = () => {
  const dispatch = useDispatch()
  const { complaints } = useSelector((state) => state.complaints)
  const { user } = useSelector((state) => state.auth)
  const { loading, sidebarOpen } = useSelector((state) => state.ui)

  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    priority: "medium",
  })
  const [commentText, setCommentText] = useState("")
  const [selectedComplaintId, setSelectedComplaintId] = useState(null)

  useEffect(() => {
    dispatch(fetchComplaints())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleInputChange = (e) => {
    setNewComplaint({
      ...newComplaint,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmitComplaint = (e) => {
    e.preventDefault()
    dispatch(createComplaint(newComplaint))
    setNewComplaint({
      title: "",
      description: "",
      priority: "medium",
    })
    setShowNewComplaintForm(false)
  }

  const handleDeleteComplaint = (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      dispatch(deleteComplaint(id))
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (commentText.trim() && selectedComplaintId) {
      dispatch(
        addComment({
          id: selectedComplaintId,
          text: commentText,
        }),
      )
      setCommentText("")
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
        className={`bg-blue-600 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
      >
        <div className="flex items-center space-x-2 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-extrabold">Student Portal</span>
        </div>

        <nav className="mt-10">
          <a
            className="flex items-center py-2 px-4 rounded transition duration-200 bg-blue-700 hover:bg-blue-800"
            href="#"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            My Complaints
          </a>

          <a
            className="flex items-center py-2 px-4 rounded transition duration-200 hover:bg-blue-700"
            href="#"
            onClick={() => setShowNewComplaintForm(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Complaint
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
            <h1 className="text-xl font-bold ml-4">My Complaints</h1>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Welcome, {user?.name || "Student"}</span>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">My Complaints</h2>
              <button
                onClick={() => setShowNewComplaintForm(true)}
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Complaint
              </button>
            </div>

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

          {/* New Complaint Form */}
          {showNewComplaintForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Submit New Complaint</h3>
                <button onClick={() => setShowNewComplaintForm(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief title of your complaint"
                    value={newComplaint.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed description of your complaint"
                    value={newComplaint.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newComplaint.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewComplaintForm(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Complaints List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No complaints found. Click "New Complaint" to submit one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">ID: {complaint.uniqueId}</p>
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

                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{complaint.description}</p>

                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() =>
                          setSelectedComplaintId(selectedComplaintId === complaint._id ? null : complaint._id)
                        }
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedComplaintId === complaint._id ? "Hide Details" : "View Details"}
                      </button>

                      <div className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {selectedComplaintId === complaint._id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                        <p className="text-sm text-gray-600">{complaint.description}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
                        {complaint.comments && complaint.comments.length > 0 ? (
                          <div className="space-y-2">
                            {complaint.comments.map((comment, index) => (
                              <div key={index} className="bg-white p-2 rounded border border-gray-200">
                                <p className="text-sm text-gray-600">{comment.text}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs text-gray-500">By: {comment.author?.name || "Unknown"}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments yet.</p>
                        )}

                        <form onSubmit={handleAddComment} className="mt-3">
                          <div className="flex">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 text-sm border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                              type="submit"
                              className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm hover:bg-blue-600"
                            >
                              Send
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteComplaint(complaint._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ClientDashboard
