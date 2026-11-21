'use client'

import { useEffect, useMemo, useState, useTransition } from "react";
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
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";

type StatusFilterType = 'all' | 'active' | 'inactive';

const Members = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, startTransition] = useTransition();

    const userData = useUserClientContext();
    const router = useRouter();

    //filtering serch query
    const filteredUsers = useMemo(() => {
        const users = (userData ?? []);
        const q = searchQuery.trim().toLowerCase();

        return users
            .filter(({ data }) => {
                const matchesSearch =
                    !q ||
                    data?.name?.toLowerCase().includes(q) ||
                    data?.contactNumber?.includes(q) ||
                    String(data?.membershipNumber ?? "").includes(q);
                const matchesStatus =
                    statusFilter === "all" ||
                    (statusFilter === "active" ? data?.status === true : data?.status === false);
                return matchesSearch && matchesStatus;
            })
    }, [userData, searchQuery, statusFilter]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            setStatusFilter(e.target.value as StatusFilterType);
        });
    };

    const handleClick = (id: string) => {
        router.push(`/members/${id}`);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] px-4 sm:px-10 pb-6 text-white font-sans overflow-hidden select-none">

            {/* 1. Header Control Section */}
            <div className="heading flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6 shrink-0">
                <div className="headingTextContainer flex flex-col gap-0.5">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase text-white/90">Members</h1>
                    <p className="text-white/30 text-xs font-mono tracking-widest uppercase mt-0.5">
                        Core // Manage gym rosters and profile databases
                    </p>
                </div>
                <GlassLiquidButton
                    onClick={() => setIsModalOpen(true)}
                    bubbleGradient="from-white/10 to-white/3"
                    className="h-10 rounded-xl px-5 border-none"
                >
                    <span className="font-bold text-xs tracking-wider uppercase text-white">+ Add Member</span>
                </GlassLiquidButton>
            </div>

            {/* 2. Main Interactive Workspace Station */}
            <div className="flex flex-col flex-1 min-h-0 w-full gap-4">

                {/* Search & Filter Controls Panel */}
                <AnimatedContainer className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center bg-black/10 backdrop-blur-2xl p-4 rounded-2xl shrink-0 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.4)] relative overflow-hidden">
                    <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />

                    {/* Input Wrapper Field */}
                    <div className="relative z-10 flex items-center w-full sm:flex-1 gap-2.5 px-3 h-10 bg-white/3 rounded-xl border border-white/5 focus-within:border-[#0affca]/30 transition-colors duration-300">
                        <RiSearch2Line className="text-white/30 shrink-0" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="text-white/80 bg-transparent border-none outline-none w-full text-xs font-medium tracking-wide placeholder:text-white/20 uppercase"
                            placeholder="Search by name or contact parameter..."
                        />
                    </div>

                    {/* Dropdown Select Parameter Filter */}
                    <div className="relative z-10 flex w-full sm:w-auto px-3.5 h-10 items-center gap-2.5 bg-white/3 rounded-xl border border-white/5 text-white/50 focus-within:border-[#0affca]/30 transition-colors duration-300 shrink-0">
                        <FaFilter className="text-white/20" size={11} />
                        <select
                            name="status"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            className="bg-transparent font-bold text-[11px] tracking-wider outline-none cursor-pointer w-full sm:w-40 text-white/70 uppercase appearance-none pr-6"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23ffffff' stroke-opacity='0.3' stroke-width='2' viewBox='0 0 24 24'><path d='M6 9l6 6 6-6'/></svg>")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right center',
                            }}
                        >
                            <option value="all" className="bg-[#121214] text-white/70 uppercase tracking-wider font-bold">All Status</option>
                            <option value="active" className="bg-[#121214] text-white/70 uppercase tracking-wider font-bold">Active</option>
                            <option value="inactive" className="bg-[#121214] text-white/70 uppercase tracking-wider font-bold">Inactive</option>
                        </select>
                    </div>
                </AnimatedContainer>

                {/* 3. Main Operational Database Table Layout */}
                <AnimatedContainer className="flex flex-col flex-1 min-h-0 bg-black/10 backdrop-blur-2xl shadow-[0_12px_32px_-10px_rgba(0,0,0,0.5)] w-full rounded-2xl border border-t-white/10 border-x-white/5 border-b-white/0 overflow-hidden relative">
                    <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />

                    <div className="flex flex-col w-full h-full overflow-x-auto relative z-10">
                        <div className="min-w-212.5 flex flex-col h-full">

                            {/* Sticky Functional Column Headers */}
                            <div className="flex gap-6 items-center justify-start w-full px-6 bg-white/2 border-b border-white/5 py-3.5 shrink-0 sticky top-0 z-10">
                                <span className="flex-[1.5] text-[10px] font-bold tracking-widest uppercase text-white/30">Member </span>
                                <span className="flex-1 text-[10px] font-bold tracking-widest uppercase text-white/30">Contact </span>
                                <span className="flex-1 text-[10px] font-bold tracking-widest uppercase text-white/30">Subscription Package</span>
                                <span className="w-24 text-center text-[10px] font-bold tracking-widest uppercase text-white/30">Status</span>
                                <span className="flex-1 text-[10px] font-bold tracking-widest uppercase text-white/30">join date</span>
                                <span className="w-16 text-end text-[10px] font-bold tracking-widest uppercase text-white/30">Action</span>
                            </div>

                            {/* Scrollable Document Core Content Feed */}
                            <div className="flex flex-col w-full flex-1 overflow-y-auto divide-y divide-white/2">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleClick(user.data.membershipNumber)}
                                            className="flex gap-6 items-center justify-start w-full px-6 py-4 hover:bg-white/3 border-l-2 border-l-transparent hover:border-l-[#0affca]/40 transition-all duration-200 cursor-pointer group"
                                        >
                                            {/* Micro-Avatar Identity Module */}
                                            <div className="flex flex-[1.5] items-center gap-3.5 min-w-0">
                                                <div className="avatar relative flex shrink-0 items-center justify-center h-9 w-9 rounded-xl border border-white/5 shadow-inner overflow-hidden bg-white/2">
                                                    <LiquidOverlayVarient1 className="pointer-events-none" />
                                                    <span className="text-[#0affca] relative z-10 text-xs font-bold font-mono tracking-wider">
                                                        {user?.data?.name?.slice(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="info min-w-0 flex flex-col gap-0.5">
                                                    <p className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-[#0affca] transition-colors truncate">
                                                        {user?.data?.name}
                                                    </p>
                                                    <p className="text-[10px] font-mono font-bold tracking-wider text-white/30 uppercase truncate">
                                                        #{user?.data?.membershipNumber}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Contact Comms Breakdown Column */}
                                            <div className="flex flex-col flex-1 min-w-0 text-[11px] font-medium gap-1">
                                                <div className="mobile flex gap-2 items-center text-white/60 font-mono truncate">
                                                    <CiMobile1 className="shrink-0 text-white/30" size={14} />
                                                    <span className="truncate">{user?.data?.contactNumber}</span>
                                                </div>
                                                <div className="email flex items-center gap-2 text-white/40 truncate">
                                                    <CiMail className="shrink-0 text-white/20" size={14} />
                                                    <span className="truncate normal-case font-sans">{user?.data?.email || "No digital address"}</span>
                                                </div>
                                            </div>

                                            {/* Pack Tier */}
                                            <p className="flex-1 text-xs font-bold uppercase tracking-wide text-white/70 truncate">
                                                {user?.data?.packageName ? user.data.packageName : "Basic Access"}
                                            </p>

                                            {/* Dynamic Status Capsule Badge */}
                                            <div className="w-24 flex justify-center shrink-0">
                                                <div className={`w-20 text-center py-1 text-[10px] font-bold tracking-widest uppercase rounded-md shadow-sm border ${user?.data?.status
                                                        ? "text-[#0affca] bg-[#0affca]/5 border-[#0affca]/25"
                                                        : "text-red-400 bg-red-500/5 border-red-500/25"
                                                    }`}>
                                                    {user?.data?.status ? "Active" : "Inactive"}
                                                </div>
                                            </div>

                                            {/* Registry Date Marker */}
                                            <p className="flex-1 text-xs font-semibold font-mono text-white/40 tracking-wider truncate">
                                                {user?.data?.registerdAt ? user.data.registerdAt.toDate().toLocaleDateString() : 'N/A'}
                                            </p>

                                            {/* System Grid Option Matrix Button */}
                                            <div className="w-16 flex justify-end text-white/20 group-hover:text-[#0affca]/80 transition-colors shrink-0 pr-1">
                                                <PiDotsNineBold size={18} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col flex-1 items-center justify-center p-12 text-center">
                                        <p className="text-xs font-mono tracking-widest text-white/20 uppercase max-w-sm leading-relaxed">
                                            No profile matrices discovered matching your filter criteria.
                                        </p>
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