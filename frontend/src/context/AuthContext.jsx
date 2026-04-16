import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // ✅ LOAD USER FROM LOCALSTORAGE (VERY IMPORTANT)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ LOGIN
  const login = (userData) => {
    console.log("Logged in:", userData);

    setUser(userData);

    // 🔥 SAVE IN LOCALSTORAGE
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);

    // 🔥 CLEAR STORAGE
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("hospitalId");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};