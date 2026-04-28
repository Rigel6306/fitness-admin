'use client'

import { createContext, useEffect, useState } from "react";
import { subscribeToCollection } from "@/util/getCollection";
interface User {
  id: string
  data: any
}

export const UserContext = createContext<User[]>([]);

export const UserContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
  const unsubscribe = subscribeToCollection(setUsers, setErr, setIsLoading)

  return () => unsubscribe() 
}, [])



  return (
    <UserContext.Provider value={users}>
      {children}
    </UserContext.Provider>
  );
};
