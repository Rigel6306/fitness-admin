import { onSnapshot, collection, doc } from "firebase/firestore";
import { db } from "@/services/firebase";

export const subscribeToUserSchedules = (
  userId: string,
  setSchedules: (schedules: any[]) => void,
  setIsLoading: (loading: boolean) => void,
  setErr: (err: string | null) => void
) => {
  try {
    setIsLoading(true);

    const userDocRef = doc(db, "users", userId);
    const scheduleCollRef = collection(userDocRef, "schedules");

    const unsubscribe = onSnapshot(
      scheduleCollRef,
      (snap) => {
        const schedules = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSchedules(schedules);
        setIsLoading(false);
        setErr(null);
      },
      (error) => {
        console.error("Error listening to schedules:", error);
        setErr(error.message);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error("Unexpected error setting up listener:", err);
    setErr(err.message ?? "Unknown error");
    setIsLoading(false);
    return () => {}; 
  }
};
