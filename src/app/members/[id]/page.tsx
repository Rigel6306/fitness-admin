import { IoIosArrowBack } from "react-icons/io";

import MemberDetails from "./MemberDetails";
const UserDetails = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params

    return ( 
        <div className="flex flex-col  pt-4 pb-10 px-10 bg-[#07020b] ">
          
            <MemberDetails id={id}/>
        </div>
     );
}
 
export default UserDetails;