import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import store from "./Store/store";
import ClientDashboard from "./components/client/ClientDashboard";
import SupervisorDashboard from "./components/Superviser/SupervisorDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import LoginForm from "./components/Auth/Login.jsx"; // Assuming your login component is here
import { selectUserRole, selectCurrentUser } from "./State/authSlice";

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'supervisor') {
      return <Navigate to="/supervisor" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// App container component
const AppContainer = () => {
  const user = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);

  // Redirect based on user role
  const getDashboardPath = () => {
    if (!user) return '/login';
    
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'supervisor':
        return '/supervisor';
      case 'student':
        return '/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to={getDashboardPath()} replace /> : <LoginForm />
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ClientDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/supervisor" element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect to appropriate dashboard or login page */}
        <Route path="/" element={<Navigate to={getDashboardPath()} replace />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={getDashboardPath()} replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

export default App;