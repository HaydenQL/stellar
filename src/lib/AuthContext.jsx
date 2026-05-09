// This file has been replaced by src/contexts/AuthContext.jsx
// which uses Supabase for real authentication.
// This stub is kept to avoid import errors from any legacy code.

export const AuthProvider = ({ children }) => children
export const useAuth = () => ({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  logout: () => {},
  navigateToLogin: () => {},
})
