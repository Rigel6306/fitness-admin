
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/services/firebase"

// Update specific fields in a document


export const updateDocument = async (docId:string,collectionName:string, updatedData:any) =>{

  try {

    const docRef = doc(db,collectionName,docId)
    await updateDoc(docRef,updatedData);
    console.log("Doc Updated Successfully")
  }
  catch(error){
    throw new Error("Error Occured")
  }
}