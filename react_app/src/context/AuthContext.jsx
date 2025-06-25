import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/users/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const login = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const logout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}