'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
    RiCoinsLine, 
    RiUserReceivedLine, 
    RiTimeLine, 
    RiAlertLine,
    RiSearchLine,
    RiFilter3Line,
    RiNotification3Line,
    RiCheckLine,
    RiCloseLine
} from "react-icons/ri";

// Mock Data matching your fitness gym theme
const initialPayments = [
    { id: "TXN-9082", name: "Marcus Vance", plan: "Elite AI Pass", amount: 49.00, status: "completed", date: "2026-06-08", avatar: "⚡" },
    { id: "TXN-8921", name: "Seraphina Ross", plan: "Titan Strength Pro", amount: 79.00, status: "completed", date: "2026-06-07", avatar: "🏋️‍♀️" },
    { id: "TXN-8810", name: "Dorian Yates", plan: "Elite AI Pass", amount: 49.00, status: "pending", date: "2026-06-06", avatar: "🤖" },
    { id: "TXN-8765", name: "Elena Rostova", plan: "Basic Tier", amount: 29.00, status: "failed", date: "2026-06-05", avatar: "🏃‍♀️" },
    { id: "TXN-8654", name: "Killian Jones", plan: "Elite AI Pass", amount: 49.00, status: "completed", date: "2026-06-04", avatar: "🔥" },
];

const initialNotifications = [
    { id: 1, type: "alert", text: "Card expired for Elena Rostova (Basic Tier).", time: "2 hours ago" },
    { id: 2, type: "success", text: "Payout of $1,420.00 successfully initiated to gym vault.", time: "5 hours ago" },
    { id: 3, type: "pending", text: "Dorian Yates requested alternative invoice routing.", time: "1 day ago" },
];

export default function PaymentManagement() {
    const [payments, setPayments] = useState(initialPayments);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Filter Logic
    const filteredPayments = payments.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
        if (filter === 'all') return matchesSearch;
        return p.status === filter && matchesSearch;
    });

    return (
        <div className="w-full min-h-screen text-white p-4 md:p-8 font-sans isolate">
            {/* Top Bar Matrix */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-black tracking-wide uppercase text-white">Ledge Terminal</h1>
                    <p className="text-[#0affca] text-[10px] font-mono tracking-widest uppercase">Gym Revenue & Subscription Management</p>
                </div>
                
                {/* Micro Search Input Wrapped in Glass */}
                <div className="relative flex items-center bg-black/30 backdrop-blur-md rounded-xl border border-white/10 w-full md:w-64 px-3">
                    <RiSearchLine className="text-white/30 shrink-0 mr-2" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search roster or txn..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none py-2.5 text-xs text-white placeholder:text-white/20 font-mono"
                    />
                </div>
            </div>

            {/* Analytics Grid Strip */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { title: "Gross Revenue", value: "$4,890.00", sub: "+14% this week", icon: RiCoinsLine, color: "text-[#0affca]", bg: "bg-[#0c6955]/10 border-[#0affca]/20" },
                    { title: "Completed Collects", value: "92", sub: "98.2% success rate", icon: RiUserReceivedLine, color: "text-[#0affca]", bg: "bg-white/[0.02] border-white/5" },
                    { title: "Pending Pipelines", value: "$98.00", sub: "2 members pending", icon: RiTimeLine, color: "text-[#ffaa00]", bg: "bg-white/[0.02] border-white/5" },
                    { title: "Failed Gates", value: "1 Active", sub: "Action required", icon: RiAlertLine, color: "text-[#ff007f]", bg: "bg-[#ff0055]/5 border-[#ff0055]/20" }
                ].map((card, i) => (
                    <div key={i} className={`p-4 rounded-xl border backdrop-blur-md flex flex-col justify-between ${card.bg}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono tracking-wider text-white/50 uppercase">{card.title}</span>
                            <card.icon className={card.color} size={16} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-wide text-white">{card.value}</h3>
                            <p className="text-[9px] text-white/30 font-mono">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Operational Split Interface */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT: Ledger Ledger Table (8 Columns Space) */}
                <div className="lg:col-span-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-xs font-bold tracking-wider uppercase text-white/80">Transaction Registry</h2>
                        
                        {/* Segment Filters */}
                        <div className="flex gap-1.5 p-0.5 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono">
                            {['all', 'completed', 'pending', 'failed'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    className={`px-2.5 py-1 rounded-md uppercase transition-all duration-200 cursor-pointer ${filter === t ? 'bg-white/10 text-[#0affca] font-bold' : 'text-white/40 hover:text-white/80'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fluid Responsive Table Area */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-mono tracking-widest text-white/40 uppercase">
                                    <th className="pb-3 font-normal">Member</th>
                                    <th className="pb-3 font-normal">Plan Profile</th>
                                    <th className="pb-3 font-normal">Amount</th>
                                    <th className="pb-3 font-normal">Status</th>
                                    <th className="pb-3 font-normal text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03] text-xs">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center font-mono text-white/30 text-[11px]">
                                            No matching logs encountered inside segment.
                                        </td>
                                    </tr>
                                ) : filteredPayments.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-3.5 flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-sm">
                                                {p.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white/90 group-hover:text-[#0affca] transition-colors">{p.name}</p>
                                                <p className="text-[9px] font-mono text-white/30 uppercase">{p.id}</p>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-white/70">{p.plan}</td>
                                        <td className="py-3.5 font-mono font-bold text-white/90">${p.amount.toFixed(2)}</td>
                                        <td className="py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono tracking-wide uppercase ${
                                                p.status === 'completed' ? 'bg-[#0c6955]/10 text-[#0affca] border border-[#0affca]/20' :
                                                p.status === 'pending' ? 'bg-[#ffaa00]/5 text-[#ffaa00] border border-[#ffaa00]/20' :
                                                'bg-[#ff0055]/5 text-[#ff007f] border border-[#ff0055]/20'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${
                                                    p.status === 'completed' ? 'bg-[#0affca]' :
                                                    p.status === 'pending' ? 'bg-[#ffaa00]' : 'bg-[#ff007f]'
                                                }`} />
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-right font-mono text-white/40 text-[11px]">{p.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Notifications & Live Feed System (4 Columns Space) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Activity Feed Box */}
                    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                                <h2 className="text-xs font-bold tracking-wider uppercase text-white/80 flex items-center gap-2">
                                    <RiNotification3Line className="text-[#0affca]" size={14} />
                                    <span>System Alerts</span>
                                </h2>
                                <span className="text-[9px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                                    {notifications.length} Live
                                </span>
                            </div>

                            {/* Alert Stack Loop */}
                            <div className="space-y-3">
                                {notifications.map((n) => (
                                    <div key={n.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-start gap-3 hover:border-white/10 transition-all group">
                                        <div className={`p-1.5 rounded-lg shrink-0 border mt-0.5 ${
                                            n.type === 'success' ? 'bg-[#0c6955]/10 border-[#0affca]/20 text-[#0affca]' :
                                            n.type === 'alert' ? 'bg-[#ff0055]/5 border-[#ff0055]/20 text-[#ff007f]' :
                                            'bg-white/5 border-white/10 text-[#ffaa00]'
                                        }`}>
                                            {n.type === 'success' ? <RiCheckLine size={12} /> : <RiAlertLine size={12} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[11px] text-white/80 leading-normal">{n.text}</p>
                                            <p className="text-[9px] font-mono text-white/30 mt-1">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Batch Clear Trigger */}
                        <button 
                            onClick={() => setNotifications([])}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono font-bold tracking-wider uppercase py-2 rounded-xl transition-all duration-200 mt-4 text-white/60 cursor-pointer"
                        >
                            Flush Active Alert Stack
                        </button>
                    </div>

                    {/* Gym Payout Matrix Summary Box */}
                    <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-[#0affca]/10 p-5 shadow-2xl bg-gradient-to-br from-[#0c6955]/5 to-transparent">
                        <span className="text-[9px] font-mono tracking-widest text-[#0affca] uppercase border border-[#0affca]/30 px-2 py-0.5 rounded">Payout Core</span>
                        <div className="mt-4 mb-2 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-white/40">Available Gym Balance</p>
                                <h4 className="text-2xl font-black text-white tracking-wide mt-1">$3,840.12</h4>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed">
                            Next direct auto-deposit scheduled to your synchronized commercial banking account on **June 12, 2026**.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}