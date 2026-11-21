'use client'

import { useEffect } from "react";
import { getAnalyticalData } from "@/util/getAnalyticalData";
const Analytics = ({userId}:{userId:string}) => {

    useEffect(()=>{
        if (userId){
            getAnalyticalData(userId)  
        }
       

    },[userId])
    return ( 

        <p>Analytics</p>
     );
}
 
export default Analytics;