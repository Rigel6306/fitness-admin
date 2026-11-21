'use client'
import { getAnalyticalData } from "@/util/getAnalyticalData";
const useAnalyticalData = () => {

    const fetchAnalyticalData = async(userId:string)=>{

        try {
            await getAnalyticalData(userId)
            
        }catch(err){
            
        }
    }

    return fetchAnalyticalData ;
}
 
export default useAnalyticalData;