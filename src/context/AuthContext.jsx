// AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    
  }, []);

  return (
    <AuthContext.Provider value={ {isLoggedIn, setIsLoggedIn }}> 
      {children}
    </AuthContext.Provider>
  );
}
