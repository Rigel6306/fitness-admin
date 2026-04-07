'use client'

import useUserClientContext from "@/src/hooks/useUserClientContext";


const MemberDetails = () => {
  

    const data = useUserClientContext()

    console.log("user Data At member Details",data)
 
    return ( 

        <div className="container text-white">


        </div>
     );
}
 
export default MemberDetails;