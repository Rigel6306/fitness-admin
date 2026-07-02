import { collection, addDoc, serverTimestamp,doc,setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { error } from "console";

type PaymentDataType = {
    user_id: string,
    order_id: string,
    payment_id: string,
    amount: string,
    status_message: string,
    payment_method: string,
    userName:string,
    email:string,
    phone:string
}

type CashPaymentDataType = {
    user_id?: string,
    payment_id: string,
    amount: string,
    status_message:string,
    payment_method?: string,
    userName?:string,
    email?:string,
    phone?:string
}


export const addNewPaymentDoc = async (paymentData: PaymentDataType) => {
    const documentData = {
        createdAt: serverTimestamp(),
        ...paymentData
    }

    try {
        const collRef = collection(db, "payment")
        const docRef=doc(collRef,paymentData.payment_id) 
        await setDoc(docRef,documentData)
        return { success: true };
    } catch (err:any) {
        throw new Error(err.message)
    }



}


export const addNewCashPaymentDoc = async (paymentData: CashPaymentDataType) => {
    const documentData = {
        createdAt: serverTimestamp(),
        ...paymentData
    }

    try {
        const collRef = collection(db, "payment")
        const docRef=doc(collRef,paymentData.payment_id) 
        await setDoc(docRef,documentData,{ merge: true } )
        return { success: true };
    } catch (err:any) {
        throw new Error(err.message)
    }



}

export const updatePaymentDoc = async (paymentData:CashPaymentDataType)=>{


}