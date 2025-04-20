"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateComplaint, assignComplaint, deleteComplaint, addComment } from "../../State/complaintsSlice"

const ComplaintCard = ({ complaint, isAdmin = false }) => {
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)
  const [comment, setComment] = useState("")
  const [supervisorId, setSupervisorId] = useState("")

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-review":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (e) => {
    dispatch(
      updateComplaint({
        id: complaint._id,
        complaintData: { status: e.target.value },
      }),
    )
  }

  const handlePriorityChange = (e) => {
    dispatch(
      updateComplaint({
        id: complaint._id,
        complaintData: { priority: e.target.value },
      }),
    )
  }

  const handleAssign = () => {
    if (supervisorId) {
      dispatch(
        assignComplaint({
          id: complaint._id,
          supervisorId,
        }),
      )
      setSupervisorId("")
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      dispatch(deleteComplaint(complaint._id))
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      dispatch(
        addComment({
          id: complaint._id,
          text: comment,
        }),
      )
      setComment("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.title}</h3>
            <p className="text-sm text-gray-500 mb-2">ID: {complaint.uniqueId}</p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(complaint.status)}`}
            >
              {complaint.status}
            </span>
            <span
              className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(complaint.priority)}`}
            >
              {complaint.priority}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{complaint.description}</p>

        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setShowDetails(!showDetails)} className="text-sm text-blue-600 hover:text-blue-800">
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          <div className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
            <p className="text-sm text-gray-600">{complaint.description}</p>
          </div>

          {isAdmin && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`status-${complaint._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id={`status-${complaint._id}`}
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={complaint.status}
                    onChange={handleStatusChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={`priority-${complaint._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id={`priority-${complaint._id}`}
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={complaint.priority}
                    onChange={handlePriorityChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={`assign-${complaint._id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Assign to Supervisor
                </label>
                <div className="flex">
                  <input
                    id={`assign-${complaint._id}`}
                    type="text"
                    placeholder="Supervisor ID"
                    className="flex-1 text-sm border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={supervisorId}
                    onChange={(e) => setSupervisorId(e.target.value)}
                  />
                  <button
                    onClick={handleAssign}
                    className="bg-blue-500 text-white px-3 py-1 rounded-r-md text-sm hover:bg-blue-600"
                  >
                    Assign
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Comments:</h4>
            {complaint.comments && complaint.comments.length > 0 ? (
              <div className="space-y-2">
                {complaint.comments.map((comment, index) => (
                  <div key={index} className="bg-white p-2 rounded border border-gray-200">
                    <p className="text-sm text-gray-600">{comment.text}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">By: {comment.author?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
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
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
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
        </div>
      )}
    </div>
  )
}

export default ComplaintCard
