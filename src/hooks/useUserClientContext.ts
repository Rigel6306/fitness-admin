import { useContext } from "react";
import { UserContext } from "../context/userContext";

const useUserClientContext = () => {
  const context = useContext(UserContext);

  
  if (!context) {
    throw new Error("useUserClientContext must be used within a UserContext.Provider");
  }


  return context;
};

export default useUserClientContext;
