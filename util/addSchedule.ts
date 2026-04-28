import { collection,doc,addDoc,setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const addScheduleDoc = async (userId:string,scheduleData:any)=>{

    try{
            const userDocRef = doc(db,"users",userId)

            const sheduleRef = collection(userDocRef,"schedules")

            const newScheduleRef = await addDoc(sheduleRef,scheduleData)
            console.log("Schedule added successfully", newScheduleRef.id)
    }
    catch(err){
        console.log(err.message)
    }
}