
import { collection, getDocs, DocumentData } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { Dispatch, SetStateAction } from 'react'

interface User {
    id: string
    data: DocumentData
}

export const getCollection = async (setUsers: Dispatch<SetStateAction<User[]>>, setErr: Dispatch<SetStateAction<boolean>>, setIsLoading: Dispatch<SetStateAction<boolean>>) => {
    let userList: { id: string; data: DocumentData }[] = []
    try {
        setIsLoading(true)
        setErr(false)
        const qSnapshot = await getDocs(collection(db, 'users'))

        qSnapshot.forEach(doc => {
            userList.push({ id: doc.id, data: doc.data() })
        })
        setErr(false)
        setIsLoading(false)
        return userList
    }
    catch (err) {
        setErr(err.message)
    }

}