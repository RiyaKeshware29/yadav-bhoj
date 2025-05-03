import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
// eslint-disable-next-line
import { auth } from "../firebase"; // Update the path if necessary
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    phone: "",
    uid: "", // Initially empty
    isVerified: false,
    tableNumber: null,
    order: [],
    totalPrice: 0,
    paymentStatus: 0,
    selectedItems: [],
    selectedCategoryId: "all",
  });

  const navigate = useNavigate();
  const authInstance = getAuth();

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (firebaseUser) {
        console.log("User authenticated:", firebaseUser);

        // If API UID is already set, do not overwrite it with Firebase UID
        setUser((prev) => ({
          ...prev,
          // Only update Firebase UID if the context UID is empty
          uid: prev.uid || firebaseUser.uid,
          phone: firebaseUser.phoneNumber || "",
          isVerified: true,
        }));

        // Automatically refresh the token every 5 minutes (for example)
        const refreshInterval = setInterval(() => {
          refreshUserToken(firebaseUser);
        }, 5 * 60 * 1000); // Refresh every 5 minutes

        // Clean up the interval when the user logs out or unmounts
        return () => clearInterval(refreshInterval);
      } else {
        console.log("User logged out");

        // Reset user context when Firebase user logs out
        setUser((prev) => ({
          ...prev,
          uid: "",
          phone: "",
          isVerified: false,
        }));
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Function to refresh user token
  const refreshUserToken = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken(true); // Force refresh
      console.log("Token refreshed:", token);
      // Optionally, you can store the new token in local storage or state
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
