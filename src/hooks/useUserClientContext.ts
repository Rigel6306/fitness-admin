import { useContext } from "react";
import { UserContext } from "../context/userContext";

const useUserClientContext = () => {
  const context = useContext(UserContext);

  
  if (!context) {
    throw new Error("useUserClientContext must be used within a UserContext.Provider");
  }

  console.log("Use Context",context)
  return context;
};

export default useUserClientContext;
