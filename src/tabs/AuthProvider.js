import React, { useState, createContext, useContext } from 'react';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = (receivedToken) => {
    setIsAuthenticated(true);
    setToken(receivedToken);
    localStorage.setItem('authToken', receivedToken);
  };

  const value = {
    isAuthenticated,
    token,
    handleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth, AuthContext };
