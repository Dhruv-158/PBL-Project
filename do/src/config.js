// Environment variables
export const API_URL ="http://localhost:5000/api"
export const NODE_ENV ="development"

// App configuration
export const APP_NAME = "College Complaint System"
export const APP_VERSION = "1.0.0"

// API timeout in milliseconds
export const API_TIMEOUT = 30000

// Token refresh interval in milliseconds (29 minutes)
export const TOKEN_REFRESH_INTERVAL = 29 * 60 * 1000

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
}

// Status and priority options
export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-review", label: "In Review" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
]

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]
