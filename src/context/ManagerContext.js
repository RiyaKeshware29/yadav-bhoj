// context/ManagerContext.js
import React, { createContext, useContext, useState } from "react";

const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
  const [manager, setManager] = useState(() => {
    const saved = localStorage.getItem("manager");
    return saved ? JSON.parse(saved) : {
      uid: "",
      isVerified: false,
      role: "",
    };
  });

  const updateManager = (data) => {
    const updated = { ...manager, ...data };
    setManager(updated);
    localStorage.setItem("manager", JSON.stringify(updated));
  };

  const logoutManager = () => {
    localStorage.removeItem("manager");
    setManager({
      uid: "",
      isVerified: false,
      role: "",
    });
  };

  return (
    <ManagerContext.Provider value={{ manager, updateManager, logoutManager }}>
      {children}
    </ManagerContext.Provider>
  );
};

export const useManager = () => useContext(ManagerContext);
