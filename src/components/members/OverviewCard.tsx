

import { BiUser } from "react-icons/bi";
import { PiCalendarStarFill } from "react-icons/pi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import { FaRegIdCard } from "react-icons/fa6";
import { BsGenderAmbiguous } from "react-icons/bs";
import { RiLineHeight } from "react-icons/ri";
import { LuWeight } from "react-icons/lu";
import { FaChalkboardUser } from "react-icons/fa6";
import { MdOutlineSportsGymnastics } from "react-icons/md";
const OverviewCard = ({ userInfo }) => {

    console.log('At Overview Card', userInfo)
    return (

        <div className="flex flex-col mt-10 gap-10">


            <div className="cardContainer  flex  gap-10 h-full w-full ">
                <div className="flex flex-col flex-1 rounded-2xl p-4 bg-[#bec5cb12]  ">
                    {/* Heading */}
                    {/* <p className="text-heading text-md">Member Details</p>
                    <hr className=" bg-gray border- " /> */}

                    {/* user Info 1st card*/}
                    <div className="flex items-center mx-10 mt-4 gap-4">
                        <BiUser size={24} />
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">User Name</p>
                            <p className="text-sub">{userInfo.name}</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                        <PiCalendarStarFill size={24} />
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Age</p>
                            <p className="text-sub">{userInfo.age}</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                        <MdOutlineAlternateEmail size={24}/>
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">E-mail</p>
                            <p className="text-sub">{userInfo.email}</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                        <CiMobile1 size={24}/>
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Contact Number</p>
                            <p className="text-sub">{userInfo.contactNumber}</p>
                        </div>
                    </div>
                     <div className="flex mx-10  items-center mt-4 gap-4">
                        <FaRegIdCard size={24}/>
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Membership Number</p>
                            <p className="text-sub">{userInfo.membershipNumber}</p>
                        </div>
                    </div>


                </div>
            {/* User info 2nd card */}
                <div className="flex-col flex-1 rounded-2xl p-4 bg-[#bec5cb12] ">
                    <div className="flex items-center mx-10 mt-4 gap-4">
                        <BsGenderAmbiguous size={24} />
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Gender</p>
                            <p className="text-sub">{userInfo.gender}</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                       <RiLineHeight size={24} />

                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Height</p>
                            <p className="text-sub">{userInfo.height} CM</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                        <LuWeight size={24} />
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Weight</p>
                            <p className="text-sub">{userInfo.weight} KG</p>
                        </div>
                    </div>

                    <div className="flex mx-10  items-center mt-4 gap-4">
                        <FaChalkboardUser size={24}/>
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Contact Number</p>
                            <p className="text-sub">{userInfo.packageName}</p>
                        </div>
                    </div>
                     <div className="flex mx-10  items-center mt-4 gap-4">
                         <MdOutlineSportsGymnastics size={24} className=""/>
                        <div className="flex flex-col">
                            <p className="text-heading text-sm">Status</p>
                            <p className="text-sub">{`${userInfo.packageName?"Active":"Inactive"}`}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="goal h-10 bg-[#bec5cb12]">

            </div>
        </div>
    );
}

export default OverviewCard;