'use client'

import AnimatedContainer from "@/src/components/ui/animatedContainer";
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";
import { CustomTabsWithTooltips } from "@/src/components/ui/tabsCard";
import { Dispatch, SetStateAction, useState } from "react";
import { MdPayments } from "react-icons/md";
import QrScanner from "@/src/components/payment/qrScanner";
import ManualLookup from "@/src/components/payment/malualLookup";
import CashPaymentPanel, { type CashPayment, type DeskUser } from "@/src/components/payment/cashPaymentPanel";

interface CashAtModalProps {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const tabs = [
    { id: "auto", label: "Auto Scan", description: "No AI suggestions and spellcheck." },
    { id: "manual", label: "Manual Lookup", description: "AI Assist by providing suggestions and spellcheck." },
];

const CashAtDeskModal = ({ setIsModalOpen }: CashAtModalProps) => {
    const [mode, setMode] = useState(false);
    // null = show lookup, a user = show that user's payment panel
    const [selectedUser, setSelectedUser] = useState<DeskUser | null>(null);

    const handleConfirmPayment = async (payment: CashPayment) => {
        // Do the real write on the server (API route / server action), not in the browser.
        const res = await fetch("/api/payments/cash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error ?? "Payment failed. Nothing was charged. Try again.");
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-150 p-4 select-none">
            <AnimatedContainer className="bg-[#000000]/90 top-10 w-full max-w-2xl h-[85vh] max-h-[90vh] rounded-2xl p-6 md:p-8 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] flex flex-col relative overflow-hidden">
                <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#0affca]/3 blur-3xl rounded-full pointer-events-none" />

                {/* Heading */}
                <div className="heading relative z-10 flex justify-between">
                    <div className="headingText flex-col">
                        <div className="title flex items-center gap-4">
                            <MdPayments className="text-[#ffb03a]" size={22} />
                            <p className="text-xl font-bold tracking-wide uppercase text-white/90">Accept Cash At Desk</p>
                        </div>
                        <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">
                            clear outstanding payments with fiat cash
                        </p>
                    </div>
                    <button
                        aria-label="Close"
                        className="flex items-center justify-center text-white/40 hover:text-white/90 text-xs bg-white/3 border h-10 w-10 border-white/5 rounded-full cursor-pointer transition-all duration-200"
                        onClick={() => setIsModalOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {selectedUser ? (
                    <div className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col">
                        <CashPaymentPanel
                            user={selectedUser}
                            onBack={() => setSelectedUser(null)}
                            onConfirm={handleConfirmPayment}
                        />
                    </div>
                ) : (
                    <>
                        <div className="relative z-10 flex flex-col items-center my-4 border-white/5 p-3 rounded-2xl shrink-0">
                            <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-white/30 mb-2">
                                How would you like to manage?
                            </span>
                            <CustomTabsWithTooltips setMode={setMode} tabs={tabs} />
                        </div>

                        {mode === false ? <QrScanner /> : <ManualLookup onSelectUser={setSelectedUser} />}
                    </>
                )}
            </AnimatedContainer>
        </div>
    );
};

export default CashAtDeskModal;