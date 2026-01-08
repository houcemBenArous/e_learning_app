import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

// Create the Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    
    // Store token and user in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    return data;
  };

  // Register function
  const register = async (name, email, password) => {
    const data = await authAPI.register(name, email, password);
    return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}