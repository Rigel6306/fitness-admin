import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const deleteSchedule = async (userId: string, scheduleId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const scheduleRef = doc(userDocRef, "schedules", scheduleId);
    
    await deleteDoc(scheduleRef);
    console.log("Schedule deleted successfully", scheduleId);
  } catch (err: any) {
    console.log(err.message);
    throw err;
  }
};


export const deleteUser = async (userId:string) =>{
  try {
    const userRef = doc(db,"users",userId)

    await deleteDoc(userRef)
    console.log("User Deleted Successfully")

  }
  catch(err:any){
    throw err
  }
}