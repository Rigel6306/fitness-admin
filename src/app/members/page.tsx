'use client'
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { RiSearch2Line } from "react-icons/ri";
import { CiMobile1, CiMail } from "react-icons/ci";
import { PiDotsNineBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import useUserClientContext from "@/src/hooks/useUserClientContext";
import AddNewMemberModal from "./addNewMemberModal";
import AnimatedContainer from "@/src/components/ui/animatedContainer";
import GlassLiquidButton from "@/src/components/ui/liquidBtn";
const Members = () => {
    const [filterdUsers, setFilterdUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userData = useUserClientContext();

    const getUserData = async () => {
        setFilterdUsers(userData || []);
    };

    useEffect(() => {
        getUserData();
    }, [userData]);

    const handleChange = (e) => {
        if (!userData) return;
        const filterdList = userData.filter((user) => 
            user?.data?.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            user?.data?.contactNumber?.includes(e.target.value)
        );
        setFilterdUsers(filterdList);
    };

    const router = useRouter();

    const handleClick = (id) => {
        router.push(`/members/${id}`);
    };

    return (
      
        <div className="flex flex-col h-[calc(100vh-4rem)] px-4 sm:px-10 pb-6 text-white overflow-hidden">
            
            {/* Header Section */}
            <div className="heading flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6 shrink-0">
                <div className="headingTextContainer flex flex-col">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-[#E0E0E0]">Members</h1>
                    <p className="text-sm text-[#B0B0B0]">Manage your gym members and their memberships</p>
                </div>
                <GlassLiquidButton
                    onClick={() => setIsModalOpen(true)}
                    bubbleGradient="from-white/10 to-white/3"
                    
                >
                    <p className="font-bold text-sm sm:text-base">+ Add Member</p>
                </GlassLiquidButton>
            </div>

            {/* Main Interactive Workstation Area */}
            <div className="flex flex-col flex-1 min-h-0 w-full gap-4">
                
                {/* Search & Filter Component Wrapper */}
               
<AnimatedContainer className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center bg-black/10 backdrop-blur-md shadow-md shadow-white/5 w-full p-4 rounded-xl shrink-0 border border-white/5">
    
    {/* Search Input Container */}
    <div className="flex items-center w-full sm:flex-1 gap-2 p-2 bg-[#3f404046] rounded-md border border-white/5">
        <RiSearch2Line className="shrink-0" color="gray" size={18} />
        <input 
            type="text" 
            onChange={handleChange} 
            className="text-gray-200 bg-transparent border-0 outline-none w-full text-sm placeholder:text-gray-500" 
            placeholder="Member name or mobile number" 
        />
    </div>


    <div className="flex w-full sm:w-auto px-3 items-center gap-2 bg-[#3f404046] rounded-md border border-white/5 text-gray-300 shrink-0">
        <FaFilter className="text-gray-400" size={13} />
        <select 
            name="status" 
            className="bg-transparent font-medium p-2 text-sm outline-none cursor-pointer w-full sm:w-auto text-gray-200 appearance-none pr-4"
            style={{
              
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%239ca3af' stroke-width='2' viewBox='0 0 24 24'><path d='M6 9l6 6 6-6'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right center',
            }}
        >
        
            <option value="all" className="bg-[#1e1f20] text-gray-200">All status</option>
            <option value="active" className="bg-[#1e1f20] text-gray-200">Active</option>
            <option value="inactive" className="bg-[#1e1f20] text-gray-200">Inactive</option>
        </select>
    </div>

</AnimatedContainer>
                {/* Main Table Wrapper Component */}
                <AnimatedContainer className="flex flex-col flex-1 min-h-0 bg-black/10 backdrop-blur-md shadow-md shadow-white/5 w-full rounded-xl border border-white/5 overflow-hidden">
                    
             
                    <div className="flex flex-col w-full h-full overflow-x-auto">
                        <div className="min-w-[800px] flex flex-col h-full">
                            
                            {/* Sticky Table Header */}
                            <div className="flex text-white gap-6 items-center justify-start w-full px-6 bg-white/5 backdrop-blur-md border-b border-white/10 py-3 shrink-0 sticky top-0 z-10">
                                <p className="flex-[1.5] text-sm font-semibold tracking-wide text-gray-300">Member</p>
                                <p className="flex-1 text-sm font-semibold tracking-wide text-gray-300">Contact</p>
                                <p className="flex-1 text-sm font-semibold tracking-wide text-gray-300">Membership</p>
                                <p className="w-24 text-center text-sm font-semibold tracking-wide text-gray-300">Status</p>
                                <p className="flex-1 text-sm font-semibold tracking-wide text-gray-300">Join Date</p>
                                <p className="w-16 text-end text-sm font-semibold tracking-wide text-gray-300">Action</p>
                            </div>

                            {/* Scrollable Table Body containing filterdUsers array layout */}
                            <div className="flex flex-col w-full flex-1 overflow-y-auto divide-y divide-white/[0.03]">
                                {filterdUsers.length > 0 ? (
                                    filterdUsers.map((user, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => handleClick(user.data.membershipNumber)}
                                            className="flex gap-6 items-center justify-start w-full px-6 py-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
                                        >
                                            {/* Profile Info block */}
                                            <div className="flex flex-[1.5] items-center gap-3 min-w-0">
                                                <div className="avatar flex shrink-0 items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-sm">
                                                    <p className="text-black text-xs font-bold">{user?.data?.name?.slice(0, 2).toUpperCase()}</p>
                                                </div>
                                                <div className="info min-w-0">
                                                    <p className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">{user?.data?.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user?.data?.membershipNumber}</p>
                                                </div>
                                            </div>

                                            {/* Contact Details */}
                                            <div className="flex flex-col flex-1 min-w-0 text-xs gap-0.5">
                                                <div className="mobile flex gap-1.5 items-center text-gray-300 truncate">
                                                    <CiMobile1 className="shrink-0 text-gray-400" size={14} />
                                                    <span className="truncate">{user?.data?.contactNumber}</span>
                                                </div>
                                                <div className="email flex items-center gap-1.5 text-gray-400 truncate">
                                                    <CiMail className="shrink-0 text-gray-500" size={14} />
                                                    <span className="truncate">{user?.data?.email || "No email"}</span>
                                                </div>
                                            </div>

                                            {/* Membership Plan column */}
                                            <p className="flex-1 text-sm text-gray-300 truncate">
                                                {user?.data?.packageName ? user.data.packageName : "Basic Membership"}
                                            </p>

                                            {/* Status Badge */}
                                            <div className="w-24 flex justify-center shrink-0">
                                                <p className={`w-20 text-center py-1 text-xs rounded-full font-bold shadow-sm ${
                                                    user?.data?.status 
                                                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                                                        : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                                                }`}>
                                                    {user?.data?.status ? "Active" : "Inactive"}
                                                </p>
                                            </div>

                                            {/* Date Column */}
                                            <p className="flex-1 text-sm text-gray-400 truncate">
                                                {user?.data?.registerdAt ? user.data.registerdAt.toDate().toLocaleDateString() : 'N/A'}
                                            </p>

                                            {/* Menu Action Trigger */}
                                            <div className="w-16 flex justify-end text-gray-400 group-hover:text-white transition-colors shrink-0">
                                                <PiDotsNineBold size={20} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col flex-1 items-center justify-center p-8 text-gray-400">
                                        <p className="text-sm">No members found matching the current workspace criteria.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AnimatedContainer>
            </div>

            <AnimatePresence>
                {isModalOpen && <AddNewMemberModal setIsModalOpen={setIsModalOpen} />}
            </AnimatePresence>
        </div>
    );
}

export default Members;