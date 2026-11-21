'use client'

import { useMemo, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import useUserClientContext from "@/src/hooks/useUserClientContext";
import { LiquidOverlayVarient1 } from "../ui/liquidOverlay";
import { formatMoney, type DeskUser } from './cashPaymentPanel'

type StatusFilterType = "all" | "active" | "inactive";

interface ManualLookupProps {
    onSelectUser: (user: DeskUser) => void;
}

const FILTERS: { id: StatusFilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
];

// One grid template shared by the header and every row keeps columns aligned.
const GRID = "grid items-center gap-4 grid-cols-[minmax(0,1fr)_72px_88px_16px] sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_72px_88px_16px]";

const ManualLookup = ({ onSelectUser }: ManualLookupProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

    const userData = useUserClientContext();

    // Derived data: compute during render instead of effect + state.
    const filteredUsers = useMemo(() => {
        const users = (userData ?? []) as DeskUser[];
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
            // people who owe money first, then alphabetical
            .sort(
                (a, b) =>
                    (b.data.balanceDue ?? 0) - (a.data.balanceDue ?? 0) ||
                    a.data.name.localeCompare(b.data.name)
            );
    }, [userData, searchQuery, statusFilter]);

    return (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-black/60">
            {/* Search + filter */}
            <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                <div className="flex h-10 flex-1 items-center gap-2.5 rounded-lg border border-white/5 bg-white/3 px-3 transition-colors duration-300 focus-within:border-[#0affca]/30">
                    <RiSearch2Line className="shrink-0 text-white/30" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-none bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25"
                        placeholder="Search by name, phone or member number"
                        aria-label="Search members"
                    />
                </div>
                <div className="flex shrink-0 rounded-lg border border-white/5 bg-white/3 p-0.5" role="tablist" aria-label="Filter by status">
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            role="tab"
                            aria-selected={statusFilter === f.id}
                            onClick={() => setStatusFilter(f.id)}
                            className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                                statusFilter === f.id ? "bg-white/10 text-white/90" : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Column header */}
            <div className={`${GRID} border-y border-white/5 bg-white/2 px-5 py-2 text-[11px] font-semibold text-white/35`}>
                <span>Member</span>
                <span className="hidden sm:block">Contact</span>
                <span className="text-center">Status</span>
                <span className="text-right">Due</span>
                <span />
            </div>

            {/* Rows */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto divide-y divide-white/4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const { name, membershipNumber, contactNumber, status, balanceDue = 0 } = user.data;
                        return (
                            <button
                                key={user.id}
                                onClick={() => onSelectUser(user)}
                                className={`${GRID} group w-full border-l-2 border-l-transparent px-5 py-3 text-left transition-colors duration-200 hover:border-l-[#0affca]/50 hover:bg-white/3 focus-visible:border-l-[#0affca]/50 focus-visible:bg-white/3 focus-visible:outline-none`}
                            >
                                {/* Member */}
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/2">
                                        <LiquidOverlayVarient1 className="pointer-events-none" />
                                        <span className="relative z-10 font-mono text-xs font-bold text-[#0affca]">
                                            {name?.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-white/90 transition-colors group-hover:text-[#0affca]">
                                            {name}
                                        </p>
                                        <p className="truncate font-mono text-[11px] text-white/30">#{membershipNumber}</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <p className="hidden truncate font-mono text-xs text-white/45 sm:block">
                                    {contactNumber || "—"}
                                </p>

                                {/* Status */}
                                <span
                                    className={`justify-self-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
                                        status
                                            ? "border-[#0affca]/25 bg-[#0affca]/5 text-[#0affca]"
                                            : "border-red-500/25 bg-red-500/5 text-red-400"
                                    }`}
                                >
                                    {status ? "Active" : "Inactive"}
                                </span>

                                {/* Balance due */}
                                <span
                                    className={`text-right font-mono text-sm font-semibold ${
                                        balanceDue > 0 ? "text-[#ffb03a]" : "text-white/25"
                                    }`}
                                >
                                    {balanceDue > 0 ? formatMoney(balanceDue) : "Paid up"}
                                </span>

                                <MdChevronRight className="text-white/20 transition-colors group-hover:text-white/60" size={16} />
                            </button>
                        );
                    })
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-12 text-center">
                        <p className="text-sm font-semibold text-white/50">No members found</p>
                        <p className="text-xs text-white/30">Try a different name, number, or status filter.</p>
                    </div>
                )}
            </div>

            <div className="border-t border-white/5 px-5 py-2 text-[11px] text-white/30">
                {filteredUsers.length} {filteredUsers.length === 1 ? "member" : "members"}
            </div>
        </div>
    );
};

export default ManualLookup;