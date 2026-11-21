'use client'

import { Key, useState } from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";

export interface DeskUser {
    id: Key;
    data: {
        id:string,
        name: string;
        membershipNumber: string | number;
        contactNumber?: string;
        status: boolean;
        registerdAt?: { toDate: () => Date };
        balanceDue?: number; // <-- rename to whatever field holds the outstanding amount
    };
}

export interface CashPayment {
    membershipNumber: string | number;
    amount: number;
    note: string;
}

interface CashPaymentPanelProps {
    user: DeskUser;
    onBack: () => void;
    onConfirm: (payment: CashPayment) => Promise<void>;
}

const CURRENCY = "USD"; // change to your currency code

export const formatMoney = (value: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: CURRENCY }).format(value);

type Phase = "form" | "submitting" | "done";

const CashPaymentPanel = ({ user, onBack, onConfirm }: CashPaymentPanelProps) => {
    const { name, membershipNumber, contactNumber } = user.data;
    const due = user.data.balanceDue ?? 0;

    const [amount, setAmount] = useState(due > 0 ? due.toFixed(2) : "");
    const [note, setNote] = useState("");
    const [phase, setPhase] = useState<Phase>("form");
    const [error, setError] = useState<string | null>(null);
    const [paid, setPaid] = useState(0);

    // compare in cents to avoid floating point surprises
    const parsed = Number(amount);
    const cents = Math.round(parsed * 100);
    const dueCents = Math.round(due * 100);
    const isValid = Number.isFinite(parsed) && cents > 0 && cents <= dueCents;

    let helper: string | null = null;
    if (amount !== "" && !isValid) {
        helper = cents > dueCents
            ? `Amount can't be more than the ${formatMoney(due)} due.`
            : "Enter an amount greater than zero.";
    }

    const handleSubmit = async () => {
        if (!isValid || phase === "submitting") return;
        setPhase("submitting");
        setError(null);
        try {
            await onConfirm({ membershipNumber, amount: cents / 100, note: note.trim() });
            setPaid(cents / 100);
            setPhase("done");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Payment failed. Nothing was charged. Try again.");
            setPhase("form");
        }
    };

    if (phase === "done") {
        return (
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <MdCheckCircle className="text-[#0affca]" size={52} />
                <div>
                    <p className="text-lg font-bold text-white/90">Payment recorded</p>
                    <p className="mt-1 text-sm text-white/50">
                        {formatMoney(paid)} received from {name}
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                        Remaining balance: {formatMoney(Math.max(0, due - paid))}
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="mt-2 h-10 rounded-lg border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                >
                    Back to members
                </button>
            </div>
        );
    }

    return (
        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
            <button
                onClick={onBack}
                disabled={phase === "submitting"}
                className="flex w-fit items-center gap-1.5 text-xs font-semibold text-white/40 transition-colors hover:text-white/80 disabled:opacity-40"
            >
                <MdArrowBack size={16} />
                Back to members
            </button>

            {/* Member summary */}
            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/3 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/2 font-mono text-sm font-bold text-[#0affca]">
                    {name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-white/90">{name}</p>
                    <p className="truncate font-mono text-xs text-white/35">
                        #{membershipNumber}{contactNumber ? `  ${contactNumber}` : ""}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/35">Balance due</p>
                    <p className="text-xl font-bold text-[#ffb03a]">{formatMoney(due)}</p>
                </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
                <label htmlFor="cash-amount" className="text-xs font-semibold text-white/50">
                    Cash received
                </label>
                <input
                    id="cash-amount"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0.00"
                    autoFocus
                    className={`h-14 rounded-xl border bg-white/3 px-4 font-mono text-2xl font-bold text-white/90 outline-none transition-colors placeholder:text-white/15 ${
                        helper ? "border-red-500/40" : "border-white/10 focus:border-[#0affca]/40"
                    }`}
                />
                {helper && <p className="text-xs text-red-400">{helper}</p>}
                <div className="flex gap-2">
                    <button
                        onClick={() => setAmount(due.toFixed(2))}
                        className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10"
                    >
                        Pay full amount
                    </button>
                    <button
                        onClick={() => setAmount((due / 2).toFixed(2))}
                        className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:bg-white/10"
                    >
                        Pay half
                    </button>
                </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-2">
                <label htmlFor="cash-note" className="text-xs font-semibold text-white/50">
                    Note (optional)
                </label>
                <input
                    id="cash-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={120}
                    placeholder="e.g. receipt number"
                    className="h-10 rounded-lg border border-white/10 bg-white/3 px-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#0affca]/40"
                />
            </div>

            {error && (
                <p className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-xs text-red-300">{error}</p>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                <p className="text-xs text-white/35">
                    {isValid && `Remaining after payment: ${formatMoney((dueCents - cents) / 100)}`}
                </p>
                <button
                    onClick={handleSubmit}
                    disabled={!isValid || phase === "submitting"}
                    className="h-11 min-w-44 rounded-lg bg-[#0affca] px-5 text-sm font-bold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                >
                    {phase === "submitting" ? "Recording…" : `Confirm ${isValid ? formatMoney(parsed) : "payment"}`}
                </button>
            </div>
        </div>
    );
};

export default CashPaymentPanel;