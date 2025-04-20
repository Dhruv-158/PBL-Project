import { useSelector, useDispatch } from "react-redux"
import { NavLink } from "react-router-dom"
import { logout } from "../../State/authSlice"
import { toggleSidebar } from "../../State/uiSlice"

const Sidebar = ({ role }) => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: "home" },
    { name: "Complaints", path: "/admin/complaints", icon: "clipboard-list" },
    { name: "Access Requests", path: "/admin/access-requests", icon: "shield-check" },
    { name: "Supervisors", path: "/admin/supervisors", icon: "users" },
    { name: "Students", path: "/admin/students", icon: "academic-cap" },
    { name: "Reports", path: "/admin/reports", icon: "chart-bar" },
    { name: "Settings", path: "/admin/settings", icon: "cog" },
  ]

  const supervisorLinks = [
    { name: "Dashboard", path: "/supervisor", icon: "home" },
    { name: "Assigned Complaints", path: "/supervisor/complaints", icon: "clipboard-list" },
    { name: "Access Requests", path: "/supervisor/access-requests", icon: "shield-check" },
    { name: "Reports", path: "/supervisor/reports", icon: "chart-bar" },
    { name: "Settings", path: "/supervisor/settings", icon: "cog" },
  ]

  const studentLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "home" },
    { name: "My Complaints", path: "/complaints", icon: "clipboard-list" },
    { name: "New Complaint", path: "/complaints/new", icon: "plus-circle" },
    { name: "Settings", path: "/settings", icon: "cog" },
  ]

  const links = role === "admin" ? adminLinks : role === "supervisor" ? supervisorLinks : studentLinks

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        )
      case "clipboard-list":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        )
      case "shield-check":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        )
      case "users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )
      case "academic-cap":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
        )
      case "chart-bar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        )
      case "cog":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case "plus-circle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        )
    }
  }

  const getBgColor = () => {
    switch (role) {
      case "admin":
        return "bg-indigo-800"
      case "supervisor":
        return "bg-emerald-800"
      default:
        return "bg-blue-800"
    }
  }

  const getHoverColor = () => {
    switch (role) {
      case "admin":
        return "hover:bg-indigo-700"
      case "supervisor":
        return "hover:bg-emerald-700"
      default:
        return "hover:bg-blue-700"
    }
  }

  const getActiveColor = () => {
    switch (role) {
      case "admin":
        return "bg-indigo-900"
      case "supervisor":
        return "bg-emerald-900"
      default:
        return "bg-blue-900"
    }
  }

  return (
    <div
      className={`${getBgColor()} text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {role === "admin" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ) : role === "supervisor" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
          )}
          <span className="text-xl font-bold">
            {role === "admin" ? "Admin Portal" : role === "supervisor" ? "Supervisor" : "Student Portal"}
          </span>
        </div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden p-1 rounded-md hover:bg-white hover:bg-opacity-10 focus:outline-none"
        >
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

      <div className="px-4 py-2">
        <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-white text-opacity-70 truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? getActiveColor() : `text-white text-opacity-90 ${getHoverColor()}`
              }`
            }
          >
            <span className="mr-3">{renderIcon(link.icon)}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pt-4 border-t border-white border-opacity-20">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-white text-opacity-90 hover:bg-white hover:bg-opacity-10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Sidebar
