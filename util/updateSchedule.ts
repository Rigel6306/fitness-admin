import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const updateSchedule = async (
  userId: string,
  scheduleId: string,
  updatedData: any
) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const scheduleRef = doc(userDocRef, "schedules", scheduleId);
    
    await updateDoc(scheduleRef, updatedData);
    console.log("Schedule updated successfully", scheduleId);
  } catch (err: any) {
    console.log(err.message);
    throw err;
  }
};
