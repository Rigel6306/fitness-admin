'use client'
import { use, useEffect, useState } from "react";
import { getCollection } from "@/util/getCollection";
import { FaFilter } from "react-icons/fa6";
import { RiSearch2Line } from "react-icons/ri";
import { CiMobile1,CiMail  } from "react-icons/ci";
import { PiDotsNineBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import useUserClientContext from "@/src/hooks/useUserClientContext";
const Members = () => {

    const [users, setUsers] = useState<any[]>([])
    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [filterdUsers,setFilterdUsers] = useState([])
    const userData = useUserClientContext();
    const getUserData = async () => {
       const  userData = await getCollection(setUsers, setErr, setIsLoading)
         setUsers(userData)
        setFilterdUsers(userData)
       

    }

    useEffect(() => {

        getUserData()

    }, [])

    // useEffect(()=>{
    // setFilterdUsers(userData)
    // },[userData])


    const handleChange = (e)=>{


     const filterdList = users.filter((user) =>user.data.name.toLowerCase().includes(e.target.value.toLowerCase()));
     setFilterdUsers(filterdList)

    }
    const router = useRouter()
    const handleClick = (id)=>{
        router.push(`/members/${id}`)
    }
    return (

        <div className=" flex flex-col h-[200vh] px-10 bg-[#07020b]">
            <div className="heading flex justify-between items-center  my-10">
                <div className="headingTextContainer flex flex-col">
                    <h1 className="text-3xl font-semibold text-[#E0E0E0]">Members</h1>
                    <p className="text-[#B0B0B0]">Manage your gym members and there memberships</p>
                </div>
                <div className="addMemberBtn hover:bg-gray-700  hover:scale-101 transition-colors cursor-pointer max-h-15 flex items-center justify-center max-w-50 bg-[#E0E0E0] rounded-2xl p-2">
                    <p className="font-bold ">+ Add Member</p>
                </div>
            </div>
            {/* Member Details list section */}
            <div className="flex flex-col  items-center justify-center ">
 
                <div className="flex h-20  gap-10 justify-center  items-center bg-[#2c2c2c93] w-full  p-4 rounded-md my-5">
                   
                    <div className="flex-5 gap-2  flex items-center p-1 bg-[#363738] rounded-md">
                        <RiSearch2Line className="m-1 " color="gray"/>
                         <input type="text" name="" id="" onChange={(e)=>handleChange(e)} className="text-gray-200 border-0 w-full" placeholder="Member name or mobile number" />
                    </div>
                    <div className="flex  px-2 items-center justify-between bg-gray-200 rounded-md ">
                        <FaFilter />
                        <select name="status"  id="" className="h-full-200 p-2 ">
                            <option value="all">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">inacvtive</option>
                        </select>
                    </div>

                </div>

                <div className="flex flex-col justify-center items-center bg-[#00000093] w-full  overflow-x-hidden overflow-y-auto pt-0 rounded-md ">
                    <div className="flex text-white  gap-10 items-center justify-start w-full px-14 backdrop-blur-md bg-gray-200/10 p-4   sticky top-0 ">
                        <p className="flex-1 text-xl font-semibold">Member</p>
                        <p className="flex-1 text-xl font-semibold">Contact</p>
                        <p className="flex-1 text-xl xl:flex-1 font-semibold">Membership</p>
                        <p className="flex-1 max-w-20 text-center text-xl font-semibold">Status</p>
                        <p className="flex-1 text-xl font-semibold">Join Data</p>
                        <p className=" text-xl text-end font-semibold">Action</p>
                    </div>

                    <div className="flex flex-col w-full h-100 ">
                   
                    {
                        !isLoading && filterdUsers ?
                            filterdUsers.map((user, i) => (
                                <div key={i} 
                                onClick={()=>{handleClick(user.data.membershipNumber)}}
                                className="flex m-2 rounded-md p-2  text-white gap-10 items-center justify-start  py-4 px-10 ">
                                    {/* Member details */}
                                    <div className="flex flex-1 items-center gap-4">
                                        <div className="avatar flex items-center justify-center h-10 w-10 rounded-full bg-gray-300">
                                            <p className="text-black font-semibold font-">{user.data.name.slice(0,2).toUpperCase()}</p>
                                        </div>
                                        <div className="info">
                                        <p className="flex-2 text-heading  text-[1rem] font-semibold">{user.data.name}</p>
                                        <p className="text-sub">{user.data.membershipNumber}</p>
                                        </div>
                                    </div> 
                                    {/* Contact */}
                                    <div className="flex flex-col flex-1 items-center ">
                                        <div className="mobile flex gap-2 items-center w-full">
                                            <CiMobile1 />
                                            <p className="text-heading ">{user.data.contactNumber}</p>
                                        </div>
                                        <div className="email flex items-center w-full gap-2">
                                            <CiMail />
                                            <p className="text-sub">{user.data.email}</p>
                                        </div>
                                    </div>
                                    <p className="flex-1 xl:flex-1">{user.data.packageName ? user.data.packageName : "Membership"}</p>
                                    <p className={`flex-1 max-w-20 text-center rounded-3xl ${user.data.status?"text-green-700 bg-green-200 ":'text-red-700 bg-red-200'}`}>{user.data.status? `${user.data.status?"Active":"Inactive"}` :"status"}</p>
                                    <p className="flex-1">{user.data.registerdAt.toDate().toLocaleDateString()}</p>
                                    <p className=" pe-2 text-end"><PiDotsNineBold  size={25}/></p>
                                </div>

                            ))
                            : <h1>Loading</h1>
                    }
                     </div>
                </div>

            </div>

        </div>
    );
}

export default Members;