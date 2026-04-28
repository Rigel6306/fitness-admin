
import { doc, updateDoc ,arrayUnion} from "firebase/firestore"
import { db } from "@/services/firebase"

// Update specific fields in a document
export const updateScheduleData = async (userId: string, updatedData:any) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
        schedule:arrayUnion(updatedData)
    })
    console.log("User updated successfully")
  } catch (error: any) {
   throw new Error(error.message)
  }
}
