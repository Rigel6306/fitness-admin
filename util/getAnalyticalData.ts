
import { db } from "@/services/firebase";
import { getDocs,collection,doc,query,orderBy } from "firebase/firestore";

export const getAnalyticalData = async (userId:string)=>{

    const collRef = collection(db,'users')
    const docRef = doc(collRef,userId)

    const analyticalCollRef = collection(docRef,'analyticalData')
     const q = query(analyticalCollRef,orderBy("date",'desc'))
    const analyticalDocs = await getDocs(q)
    console.log("AnalyticalDocs",analyticalDocs.docs)

}