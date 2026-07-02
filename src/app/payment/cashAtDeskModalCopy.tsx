'use client'

import { BiUser } from "react-icons/bi";
import { FaRegIdCard } from "react-icons/fa6";
import { MdOutlinePriceChange, MdPayments } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { useState, useId, useEffect, useRef } from "react";
import { serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase"; // Replace with your actual database entry point
import AnimatedContainer from "@/src/components/ui/animatedContainer";
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";
import z from "zod";


interface CashAtDeskModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onPaymentSuccess?: () => void;
}

const CashAtDeskModal = ({ setIsModalOpen, onPaymentSuccess }: CashAtDeskModalProps) => {
    const baseId = useId();
    const qrInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [scanMode, setScanMode] = useState<true | false>(true);
    const [qrRawString, setQrRawString] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Contextual runtime state for verified active profile balance records
    const [activeTransaction, setActiveTransaction] = useState<{
        userId: string;
        name: string;
        membershipNumber: string;
        packageName: string;
        amountDue: number;
    } | null>(null);

    // Keep hidden physical scanner input element continuously focused during auto-scan loops
    useEffect(() => {
        if (scanMode && qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, [scanMode]);

    // Handle incoming payloads from physical USB scanner inputs
    const handleQrScanInput = async (val: string) => {
        setQrRawString(val);
        setErrorMsg(null);

        try {
            // Expecting structured JSON stringified map payload from your updated mobile view:
            // {"type":"cash","userId":"XYZ-123"}
            const parsedData = JSON.parse(val);
            
            if (parsedData.type === 'cash' && parsedData.userId) {
                fetchMemberPaymentProfile(parsedData.userId);
            } else {
                setErrorMsg("Invalid layout properties found in QR sequence.");
            }
        } catch (e) {
            // If raw input or manual entry isn't explicit JSON string parsing, fallback check can be applied here
        }
    };

    // Database lookup route logic
    const fetchMemberPaymentProfile = async (targetUserId: string) => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const userDocRef = doc(db, "users", targetUserId);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setActiveTransaction({
                    userId: targetUserId,
                    name: data.name || "Unknown Member",
                    membershipNumber: data.membershipNumber || "—",
                    packageName: data.package?.name || "Standard Plan",
                    amountDue: data.package?.price || 0
                });
            } else {
                setErrorMsg("No active membership profile mapped to this identifier.");
            }
        } catch (err) {
            setErrorMsg("Cloud pipeline fetch failure. Check network connectivity status.");
        } finally {
            setIsLoading(false);
        }
    };

    // Finalize cash settlement inside your Firestore collection ledger
    const handleCommitPayment = async () => {
        if (!activeTransaction) return;

        setIsLoading(true);
        try {
            const userDocRef = doc(db, "users", activeTransaction.userId);
            
            // Updates transaction schemas to clear active balances instantly
            await updateDoc(userDocRef, {
                "paymentStatus": "COMPLETED",
                "paymentMethod": "cash_at_desk",
                "lastSettledAt": serverTimestamp()
            });

            if (onPaymentSuccess) onPaymentSuccess();
            setIsModalOpen(false);
        } catch (err) {
            setErrorMsg("Ledger commit failure. Cash ledger update was rejected.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-150 p-4 select-none">
            <AnimatedContainer className="bg-[#000000]/90 w-full max-w-xl h-initial rounded-2xl p-6 md:p-8 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] flex flex-col relative overflow-hidden">
                
                {/* Background Ambient Decorative Elements */}
                <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ffb03a]/3 blur-3xl rounded-full pointer-events-none" />

                {/* Header Module Section */}
                <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-4 shrink-0">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-xl font-bold tracking-wide uppercase text-white/90 flex items-center gap-2.5">
                            <MdPayments className="text-[#ffb03a]" size={22} /> Accept Cash At Desk
                        </h2>
                        <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">
                            Terminal // Clear outstanding pipelines with fiat cash verification
                        </p>
                    </div>
                    <button 
                        type="button"
                        className="text-white/40 hover:text-white/90 text-xs font-mono tracking-wider uppercase bg-white/3 border border-white/5 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200" 
                        onClick={() => setIsModalOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Form Inputs Container / Verification Layout */}
                <div className="relative z-10 flex flex-col gap-5 my-6 context-panel-wrapper">
                    
                    {/* Workflow Mode Selector Grid */}
                    <div className="grid grid-cols-2 gap-2 bg-white/2 p-1 rounded-xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => { setScanMode(true); setActiveTransaction(null); }}
                            className={`h-8 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                                scanMode ? "bg-white/5 text-white border border-white/10" : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            <BsQrCodeScan size={12} /> Auto Scanner Mode
                        </button>
                        <button
                            type="button"
                            onClick={() => { setScanMode(false); setActiveTransaction(null); }}
                            className={`h-8 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
                                !scanMode ? "bg-white/5 text-white border border-white/10" : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            <BiUser size={13} /> Manual Look-Up
                        </button>
                    </div>

                    {/* DYNAMIC SUBVIEWS */}
                    {scanMode ? (
                        /* SCANNING INTERFACE VIEW */
                        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-white/1 relative">
                            {/* Hidden processing node hook dedicated to catching physical keypress emulations */}
                            <input
                                ref={qrInputRef}
                                type="text"
                                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                                value={qrRawString}
                                onChange={(e) => handleQrScanInput(e.target.value)}
                                onBlur={() => { if (scanMode && qrInputRef.current) qrInputRef.current.focus(); }}
                            />
                            
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                                activeTransaction ? "bg-[#0affca]/10 border border-[#0affca]/30 text-[#0affca]" : "bg-[#ffb03a]/5 border border-[#ffb03a]/20 text-[#ffb03a] animate-pulse"
                            }`}>
                                <BsQrCodeScan size={22} />
                            </div>

                            {!activeTransaction ? (
                                <>
                                    <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Awaiting Scanner Input...</h4>
                                    <p className="text-[11px] text-white/30 text-center max-w-xs leading-relaxed">
                                        Position the device scanner or focus this window to scan the user's mobile app payment QR matrix code.
                                    </p>
                                </>
                            ) : (
                                <div className="text-center">
                                    <h4 className="text-xs font-bold text-[#0affca] uppercase tracking-wider mb-0.5">Payload Read Successfully</h4>
                                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Roster Record Identified</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* MANUAL ACCOUNT LOOKUP INPUT VIEW */
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor={`${baseId}-manualId`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                                <FaRegIdCard size={13} className="text-white/30" /> Enter User / Target ID Token
                            </label>
                            <div className="relative flex items-center h-11 bg-white/3 rounded-xl border border-white/5 focus-within:border-[#ffb03a]/40 transition-all duration-300">
                                <input
                                    id={`${baseId}-manualId`}
                                    type="text"
                                    className="absolute inset-0 w-full h-full px-4 text-white/80 bg-transparent border-none outline-none text-xs font-mono tracking-wider placeholder:text-white/25"
                                    placeholder="Ex: Paste Firebase User ID or Custom Registry String"
                                    onChange={(e) => {
                                        if(e.target.value.length > 5) fetchMemberPaymentProfile(e.target.value.trim());
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* RUNTIME SYSTEM STATUS DISPLAYS */}
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-semibold tracking-wide uppercase text-center">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-center py-2 text-[11px] font-mono tracking-widest text-[#ffb03a] uppercase animate-pulse">
                            Querying data pipeline nodes...
                        </div>
                    )}

                    {/* ENFORCED DATA VERIFICATION PANELS */}
                    {activeTransaction && !isLoading && (
                        <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col gap-3.5 animate-fadeIn">
                            <div className="text-[10px] font-bold font-mono tracking-widest text-white/30 uppercase border-b border-white/5 pb-2">
                                Verified Statement Summary
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 text-xs">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-white/30 uppercase font-mono">Member Name</span>
                                    <span className="font-bold text-white/80 uppercase tracking-wide">{activeTransaction.name}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-white/30 uppercase font-mono">Registry Index ID</span>
                                    <span className="font-mono font-bold text-white/60">{activeTransaction.membershipNumber}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 col-span-2 border-t border-white/3 pt-2">
                                    <span className="text-[10px] text-white/30 uppercase font-mono">Subscribed Service Profile</span>
                                    <span className="font-semibold text-white/70 uppercase tracking-wide">{activeTransaction.packageName}</span>
                                </div>
                            </div>

                            {/* Crisp high-contrast billing accent box */}
                            <div className="bg-[#ffb03a]/5 border border-[#ffb03a]/20 rounded-xl p-3 flex justify-between items-center mt-1">
                                <div className="flex items-center gap-2 text-[#ffb03a]">
                                    <MdOutlinePriceChange size={16} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Cash Collection Total</span>
                                </div>
                                <span className="text-lg font-black text-[#ffb03a] font-mono">
                                    Rs {activeTransaction.amountDue.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Foot Action Controls Strip */}
                <div className="relative z-10 flex justify-end gap-3 border-t border-white/5 pt-4 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-10 px-5 rounded-xl text-xs font-bold tracking-wider uppercase text-white/50 bg-white/2 border border-white/5 hover:bg-white/6 hover:text-white/80 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!activeTransaction || isLoading}
                        onClick={handleCommitPayment}
                        className={`h-10 px-6 rounded-xl text-xs font-bold tracking-wider uppercase text-black flex items-center gap-2 shadow-lg transition-all duration-250 ${
                            activeTransaction && !isLoading
                                ? "bg-[#ffb03a] border border-[#ffb03a]/20 hover:bg-[#ffbe5b] cursor-pointer active:scale-95" 
                                : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                        }`}
                    >
                        <IoShieldCheckmarkSharp size={14} /> Clear Cash Invoice
                    </button>
                </div>
            </AnimatedContainer>
        </div>
    );
};

export default CashAtDeskModal;