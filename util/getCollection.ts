import { collection, onSnapshot, DocumentData,updateDoc } from "firebase/firestore"
import { db } from "@/services/firebase"
import { Dispatch, SetStateAction } from "react"

interface User {
  id: string
  data: DocumentData
}

export const subscribeToCollection = (
  setUsers: Dispatch<SetStateAction<User[]>>,
  setErr: Dispatch<SetStateAction<string | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  const colRef = collection(db, "users")

  setIsLoading(true)
  setErr(null)

  const unsubscribe = onSnapshot(
    colRef,
    snapshot => {
      const userList: User[] = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }))
      setUsers(userList)
      setIsLoading(false)
    },
    error => {
      setErr(error.message ?? "Unknown error")
      setIsLoading(false)
    }
  )


  return unsubscribe
}
