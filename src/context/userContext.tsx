
'use client'

import { createContext, useEffect, useState } from "react";
import { getCollection } from "@/util/getCollection";

export const UserContext = createContext(null);



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
            console.log("User List Fetch Uncessefull")
            return Error("User List Fetch Uncessefull")
        }

    }


  
    useEffect(()=>{
        getData()


    },[])

    console.log("User List", users)
    const userData:any = [];


    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    )

}