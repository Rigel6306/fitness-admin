

import MemberDetails from "./MemberDetails";
const UserDetails = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params
    console.log("User Id", id)
    return ( 
        <div className="container">
            <h1 className="text-white">Hello {id}</h1>
            <MemberDetails/>
        </div>
     );
}
 
export default UserDetails;