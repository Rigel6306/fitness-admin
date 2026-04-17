
'use client'

import { createContext, useEffect, useState } from "react";
import { getCollection } from "@/util/getCollection";

export const UserContext = createContext<any[]>([]);



export const UserContextWrapper = ({children}: {children: React.ReactNode})=>{
    const [isLoading,setIsLoading] = useState(false)
    const [err,setErr] = useState(false)
    const [users,setUsers] = useState([])
 
    const getData = async ()=>{

        const userList = await getCollection(setUsers,setIsLoading,setErr)
        if(userList){

            setUsers(userList)
        }
        else {
            
            return Error("User List Fetch Uncessefull")
        }

    }


  
    useEffect(()=>{
        getData()


    },[])

    


    return (
        <UserContext.Provider value={users}>
            {children}
        </UserContext.Provider>
    )

}