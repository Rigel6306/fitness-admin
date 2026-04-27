import { collection, getDocs, DocumentData } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { Dispatch, SetStateAction } from 'react'

interface User {
  id: string
  data: DocumentData
}

export const getCollection = async (
  setUsers: Dispatch<SetStateAction<User[]>>,
  setErr: Dispatch<SetStateAction<string | null>>, // allow error messages
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true)
    setErr(null)

    const qSnapshot = await getDocs(collection(db, 'users'))

    const userList: User[] = qSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }))

    setUsers(userList)
  } catch (err: any) {
    setErr(err.message ?? 'Unknown error')
  } finally {
    setIsLoading(false)
  }
}
