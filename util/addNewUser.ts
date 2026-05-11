
import {doc,collection,addDoc,serverTimestamp} from 'firebase/firestore'
import { db } from '@/services/firebase'

export const addNewUser = async (userData:any)=>{

    const scheduleData =   {
            title: 'Basic Schedule',
            frequency: 'day after day',
            workoutsCount: 10,
            createdAt:serverTimestamp(),
            workouts: [
                {
                    day: 1,
                    schedule:
                        [{ id: 1, name: "Leg Extension", reps: [10, 8, 6] },
                        { id: 2, name: "Barbell Shoulder Press", reps: [10, 8, 6] },
                        { id: 3, name: "Dumbbell Side Lateral", reps: [10, 8, 6] },
                        { id: 4, name: "Bent-Over Side Lateral", reps: ["10-12", "10-12", "10-12"] },
                        { id: 5, name: "Flat Bench Press", reps: [10, 8, 6] },
                        { id: 6, name: "Straight-Arm Pullover", reps: [12, 12, 12] },
                        { id: 7, name: "Lat Pulldown", reps: [12, 10, 8] },
                        { id: 8, name: "Barbell Curl", reps: [10, 8, 6] },
                        { id: 9, name: "Triceps Extension", reps: [10, 8, 6] },
                        { id: 10, name: "Forearm Exercise", reps: [15, 15, 15] }]
                }

            ],
            duration: 3,
            focus: ["Balanced full-body workout with emphasis on chest", "Shoulders", "Arms", "Basic strength"]
        }
    
    try {
        const userRef = await addDoc(collection(db,"users"),userData)
        
        const scheduleRef = collection(userRef,'schedules') 
        await addDoc(scheduleRef,scheduleData)

    }catch(err){

    }



}