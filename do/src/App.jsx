"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { checkAuth } from "./State/authSlice"

// Auth Components
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup"

// Dashboard Components
import AdminDashboard from "./components/AdminDashboard/AdminDashboard"
import SupervisorDashboard from "./components/Superviser/SupervisorDashboard"
import ClientDashboard from "./components/client/ClientDashboard"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      return <Navigate to="/admin" />
    } else if (user.role === "supervisor") {
      return <Navigate to="/supervisor" />
    } else {
      return <Navigate to="/dashboard" />
    }
  }

  return children
}

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "admin" ? "/admin" : user?.role === "supervisor" ? "/supervisor" : "/dashboard"}
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "admin" ? "/admin" : user?.role === "supervisor" ? "/supervisor" : "/dashboard"}
                />
              ) : (
                <Signup />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect based on role or to login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "admin" ? "/admin" : user?.role === "supervisor" ? "/supervisor" : "/dashboard"}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
