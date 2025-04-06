import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login, selectAuthError, selectAuthStatus } from "../../State/authSlice"
import { Link, useNavigate } from "react-router-dom"
import "./Auth.css"

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const resultAction = await dispatch(login(credentials))

    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin")
      } else if (user.role === "supervisor") {
        navigate("/supervisor")
      } else if (user.role === "student") {
        navigate("/dashboard")
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-footer">
            <button type="submit" className="auth-button" disabled={status === "loading"}>
              {status === "loading" ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>

        <div className="auth-demo">
          <h3>Demo Accounts:</h3>
          <ul>
            <li>
              <strong>Student:</strong> username: student, password: password
            </li>
            <li>
              <strong>Admin:</strong> username: admin, password: password
            </li>
            <li>
              <strong>Supervisor:</strong> username: supervisor, password: password
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login

