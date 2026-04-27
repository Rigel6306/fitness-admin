'use client'

import { createContext, useEffect, useState } from "react";
import { getCollection } from "@/util/getCollection";

interface User {
  id: string
  data: any
}

export const UserContext = createContext<User[]>([]);

export const UserContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const getData = async () => {
    try {
      await getCollection(setUsers, setErr, setIsLoading);
    } catch {
      setErr("User list fetch unsuccessful");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UserContext.Provider value={users}>
      {children}
    </UserContext.Provider>
  );
};
