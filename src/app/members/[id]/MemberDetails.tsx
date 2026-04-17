'use client'
import { IoIosArrowBack } from "react-icons/io";
import useUserClientContext from "@/src/hooks/useUserClientContext";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FcPackage } from "react-icons/fc";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { CgCalendarToday } from "react-icons/cg";
import { FaSackDollar } from "react-icons/fa6";
import { FaChalkboardUser } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";

import OverviewCard from "@/src/components/members/OverviewCard";
import Analytics from "@/src/components/members/Analytics";
import WorkoutSchedule from "@/src/components/members/WorkoutSchedule";


const MemberDetails = ({ id }) => {

    

    const  [type,setType] = useState("overview")

    const data = useUserClientContext()



    const handleNavClick = (type:string)=>{
        
        setType(type)


    }


    const userData = data.find(item => item.data.membershipNumber === id)
    console.log("user Data", userData)

    return (

        <div className=" flex flex-col   text-white ">

            {/* Header */}
            <div className="flex justify-between">
                <div className="flex items-center gap-10">
                    <Link href={"/members"} className="bckBtn flex items-center justify-center bg-[#4d4d4e44] rounded-md p-2 h-10 cursor-pointer">
                        <IoIosArrowBack color="white" size={24} />
                    </Link >
                    <div className="memberHeadingContainer">
                        <div className="memberHeading text-2xl font-semibold">{userData.data.name}</div>
                        <div className="subHeading text-[#B0B0B0]"  >Mebership Number {userData.data.membershipNumber}</div>
                    </div>
                </div>

                <div className="actionBtns flex gap-4">
                    <div className="edit gap-2 flex cursor-pointer items-center justify-center bg-[#4d4d4e44] px-4 h-10 rounded-sm">
                        <BiSolidEdit />
                        <p className="font-semibold">Edit</p>
                    </div>
                    <div className="delete cursor-pointer   gap-2 flex items-center justify-center bg-[#313b4542] px-4 h-10 rounded-sm">
                        <MdDelete color='crimson' />
                        <p className="text-[#d67e7f] font-semibold">Delete</p>
                    </div>
                </div>

            </div>
        {/* Cards at heading  */}
            <div className="flex  gap-20 mt-10  ">
                <div className="flex items-center justify-start p-4 gap-6 flex-1 rounded-md bg-[#36373879] h-30">
                    <FaChalkboardUser size={50}/>
                    <div className="flex flex-col">
                        <div className="heading text-xl md:text-2xl font-semibold">
                            <p>Membership</p>
                        </div>
                        <div className="subheading">
                            <p>{userData.data.packageName}</p>
                        </div>
                    </div>
                </div>
               <div className="flex items-center justify-start p-4 gap-6 flex-1 rounded-md bg-[#36373879] h-30">
                   <MdOutlineSportsGymnastics size={50} className="text-[#4cddbbb2]"/>
                    <div className="flex flex-col">
                        <div className="heading text-xl md:text-2xl font-semibold">
                            <p>Active Status</p>
                        </div>
                        <div className="subheading">
                            <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">Active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-start p-4 gap-6 flex-1 rounded-md bg-[#36373879] h-30">
                    <CgCalendarToday size={50}/>
                    <div className="flex flex-col">
                        <div className="heading text-xl md:text-2xl font-semibold">
                            <p>Join Date</p>
                        </div>
                        <div className="subheading">
                            <p>{userData.data.registerdAt.toDate().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-start p-4 gap-6 flex-1 rounded-md bg-[#36373879] h-30">
                   <FaSackDollar size={40} />
                    <div className="flex flex-col">
                        <div className="heading text-xl md:text-2xl font-semibold">
                            <p>Payment</p>
                        </div>
                        <div className="subheading">
                            <p className="bg-[#4cddbbb2] text-sm w-fit px-1 font-semibold text-[#fbfdfc] text-center rounded-sm">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* btnList */}

            <div className="btnCOntainer flex gap-2 bg-[#4d4d4e44]  rounded-4xl py-2  w-fit px-2 mt-10 justify-center">
                <div 
                onClick={()=>{handleNavClick("overview")}}
                className={` btn p-2 rounded-4xl ${ type==="overview"?"bg-[#bec5cb44]":'' } cursor-pointer font-semibold`}>
                    <p>Overview</p>
                </div>
                <div
                 onClick={()=>{handleNavClick("workout")}}
                className={`btn p-2 rounded-4xl  ${ type==="workout"?"bg-[#bec5cb44]":'' }  cursor-pointer font-semibold`}>
                    <p>Workout Schedule</p>
                </div>
                <div
                 onClick={()=>{handleNavClick("analytics")}}
                 className={`btn p-2 rounded-4xl  ${ type==="analytics"?"bg-[#bec5cb44]":'' } cursor-pointer font-semibold`}>
                    <p>Analytics</p>
                </div>
            </div>
            {/* Main Content section */}

              
           {type === "overview" && <OverviewCard userInfo={userData.data}/>}
           {type === "workout" && <WorkoutSchedule/>}
           {type === "analytics" && <Analytics/>}

            
        </div>
    );
}

export default MemberDetails;