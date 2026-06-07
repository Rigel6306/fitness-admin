'use client'

import { BiUser } from "react-icons/bi";
import { PiCalendarStarFill } from "react-icons/pi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { CiMobile1 } from "react-icons/ci";
import { FaRegIdCard } from "react-icons/fa6";
import { BsGenderAmbiguous } from "react-icons/bs";
import { RiLineHeight } from "react-icons/ri";
import { LuWeight } from "react-icons/lu";
import { FaChalkboardUser } from "react-icons/fa6";
import { useState, useId } from "react";
import { addNewUser } from "@/util/addNewUser";
import { serverTimestamp } from "firebase/firestore";
import AnimatedContainer from "@/src/components/ui/animatedContainer";
import { LiquidOverlayVarient1 } from "@/src/components/ui/liquidOverlay";
import z from "zod";

interface AddNewMemberModalProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const AddNewMemberModal = ({ setIsModalOpen }: AddNewMemberModalProps) => {
    // Generate unique base namespaces for accessibility criteria mappings
    const baseId = useId();

    const [userInputs, setUserInputs] = useState({
        name: "",
        age: "",
        email: "",
        contactNumber: "",
        membershipNumber: "",
        gender: "male",
        height: "",
        weight: "",
        packageName: "Workouts Only",
    });

    const [validInput, setValidInput] = useState({
        name: false,
        age: false,
        email: false,
        contactNumber: false,
        membershipNumber: false,
        gender: true,
        height: false,
        weight: false,
        packageName: true
    });

    const userSchema = z.object({
        name: z.string().min(1, "Name is Required"),
        age: z.string().regex(/^\d+$/, "Age must be a number").transform(Number).refine((val) => val > 10 && val < 100, {
            message: "Age must be between 10 and 100"
        }),
        email: z.email("Invalid E-Mail Address"),
        contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
        membershipNumber: z.string().regex(/^\d{4}$/, "Membership number must be exactly 4 digits"),
        gender: z.enum(["male", 'female']),
        height: z.string().regex(/^\d+$/, "Height must be a number").transform(Number).refine((val) => val > 50 && val < 250, {
            message: "Height must be between 50cm and 250cm",
        }),
        weight: z.string().regex(/^\d+$/, "Weight must be a number").transform(Number).refine((val) => val > 20 && val < 300, {
            message: "Weight must be between 20kg and 300kg",
        }),
        packageName: z.enum([
            "Workouts Only",
            "Workouts + Treadmill",
            "Zumba Only",
            "Zumba + Workouts",
            "Zumba + Workouts + Treadmil",
        ]),
    });

    const handleInputs = (field: string, value: string) => {
        setUserInputs(prev => ({ ...prev, [field]: value }));
        const result = userSchema.shape[field].safeParse(value);
        setValidInput(prev => ({ ...prev, [field]: result.success }));
    };

    const handleConfirm = async () => {
        const result = userSchema.safeParse(userInputs);
        if (!result.success) {
            console.log("Validation Error at edit Modal:", result.error.issues[0].message);
            return;
        }

        const userData = { ...userInputs, registerdAt: serverTimestamp(), status: true };

        try {
            await addNewUser(userData);
            setIsModalOpen(false);
        } catch(err) {
            console.log("User Registration Failed");
        }
    };

    return (
        <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center z-150 p-4 select-none">
            <AnimatedContainer className="bg-[#000000]/90  w-full max-w-2xl h-initial max-h-[90vh] rounded-2xl p-6 md:p-8 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] flex flex-col relative overflow-hidden">
                
                {/* Background Ambient Decorative Elements */}
                <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#0affca]/3 blur-3xl rounded-full pointer-events-none" />

                {/* Header Module Section */}
                <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-4 shrink-0">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-xl font-bold tracking-wide uppercase text-white/90">Add New Member</h2>
                        <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">
                            System // Provision account profiles into core roster databases
                        </p>
                    </div>
                    <button 
                        type="button"
                        className="text-white/40 hover:text-white/90 text-xs font-mono tracking-wider uppercase bg-white/[0.03] border border-white/5 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200" 
                        onClick={() => setIsModalOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Form Inputs Container - Dual Column Matrix Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-6 overflow-y-auto pr-1 flex-1 py-1 scrollbar-thin">
                    
                    {/* Identity - Full Name */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-name`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <BiUser size={13} className="text-white/30" /> Full Name
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.name ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-name`}
                                type="text"
                                value={userInputs.name}
                                onChange={(e) => handleInputs("name", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide placeholder:text-white/25 uppercase"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Identity - Membership Badge ID Number */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-membershipNumber`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <FaRegIdCard size={13} className="text-white/30" /> Roster Index Number
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.membershipNumber ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-membershipNumber`}
                                type="text"
                                maxLength={4}
                                value={userInputs.membershipNumber}
                                onChange={(e) => handleInputs("membershipNumber", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-mono font-bold tracking-widest placeholder:text-white/25"
                                placeholder="0000"
                            />
                        </div>
                    </div>

                    {/* Contact - Electronic Mail Address */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-email`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <MdOutlineAlternateEmail size={13} className="text-white/30" /> Email Address
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.email ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-email`}
                                type="email"
                                value={userInputs.email}
                                onChange={(e) => handleInputs("email", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide placeholder:text-white/25 lowercase"
                                placeholder="name@domain.com"
                            />
                        </div>
                    </div>

                    {/* Contact - Mobile Dial Link */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-contactNumber`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <CiMobile1 size={13} className="text-white/30" /> Primary Mobile
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.contactNumber ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-contactNumber`}
                                type="tel"
                                maxLength={10}
                                value={userInputs.contactNumber}
                                onChange={(e) => handleInputs("contactNumber", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-mono font-bold tracking-widest placeholder:text-white/25"
                                placeholder="0771234567"
                            />
                        </div>
                    </div>

                    {/* Demographics - Age Profile */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-age`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <PiCalendarStarFill size={13} className="text-white/30" /> Age Profile
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.age ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-age`}
                                type="text"
                                value={userInputs.age}
                                onChange={(e) => handleInputs("age", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-mono font-bold tracking-wider placeholder:text-white/25"
                                placeholder="24"
                            />
                        </div>
                    </div>

                    {/* Demographics - Gender Classification Dropdown */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-gender`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <BsGenderAmbiguous size={13} className="text-white/30" /> Gender Vector
                        </label>
                        <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-[#0affca]/20 transition-all duration-300">
                            <select
                                id={`${baseId}-gender`}
                                value={userInputs.gender}
                                onChange={(e) => handleInputs("gender", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 bg-transparent font-bold text-[11px] tracking-wider text-white/70 uppercase outline-none cursor-pointer appearance-none pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23ffffff' stroke-opacity='0.2' stroke-width='2' viewBox='0 0 24 24'><path d='M6 9l6 6 6-6'/></svg>")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'calc(100% - 12px) center',
                                }}
                            >
                                <option value="male" className="bg-[#121214] text-white/70">Male Identifier</option>
                                <option value="female" className="bg-[#121214] text-white/70">Female Identifier</option>
                            </select>
                        </div>
                    </div>

                    {/* Biometrics - Geometric Height Index */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-height`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <RiLineHeight size={13} className="text-white/30" /> Height Metric
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.height ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-height`}
                                type="text"
                                value={userInputs.height}
                                onChange={(e) => handleInputs("height", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-mono font-bold tracking-wider placeholder:text-white/25"
                                placeholder="175 (CM)"
                            />
                        </div>
                    </div>

                    {/* Biometrics - Mass Weight Index */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${baseId}-weight`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <LuWeight size={13} className="text-white/30" /> Mass Weight
                        </label>
                        <div className={`relative flex items-center h-10 bg-white/[0.03] rounded-xl border transition-all duration-300 ${
                            validInput.weight ? "border-[#0affca]/40 bg-[#0affca]/[0.01]" : "border-white/5 focus-within:border-white/20"
                        }`}>
                            <input
                                id={`${baseId}-weight`}
                                type="text"
                                value={userInputs.weight}
                                onChange={(e) => handleInputs("weight", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-mono font-bold tracking-wider placeholder:text-white/25"
                                placeholder="70 (KG)"
                            />
                        </div>
                    </div>

                    {/* Subscription Package Program Route Selection */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label htmlFor={`${baseId}-packageName`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 flex items-center gap-2 cursor-pointer select-none">
                            <FaChalkboardUser size={13} className="text-white/30" /> Operations Membership Route
                        </label>
                        <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-[#0affca]/20 transition-all duration-300">
                            <select
                                id={`${baseId}-packageName`}
                                value={userInputs.packageName}
                                onChange={(e) => handleInputs("packageName", e.target.value)}
                                className="absolute inset-0 w-full h-full px-3 bg-transparent font-bold text-[11px] tracking-wider text-white/70 uppercase outline-none cursor-pointer appearance-none pr-8"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23ffffff' stroke-opacity='0.2' stroke-width='2' viewBox='0 0 24 24'><path d='M6 9l6 6 6-6'/></svg>")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'calc(100% - 12px) center',
                                }}
                            >
                                <option value="Workouts Only" className="bg-[#121214] text-white/70">Workouts Only</option>
                                <option value="Workouts + Treadmill" className="bg-[#121214] text-white/70">Workouts + Treadmill</option>
                                <option value="Zumba Only" className="bg-[#121214] text-white/70">Zumba Only</option>
                                <option value="Zumba + Workouts" className="bg-[#121214] text-white/70">Zumba + Workouts</option>
                                <option value="Zumba + Workouts + Treadmil" className="bg-[#121214] text-white/70">Zumba + Workouts + Treadmill</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Foot Action Controls Strip */}
                <div className="relative z-10 flex mt-2 justify-end gap-3 border-t border-white/5 pt-4 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-10 px-5 rounded-xl text-xs font-bold tracking-wider uppercase text-white/50 bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:text-white/80 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="h-10 px-6 rounded-xl text-xs font-bold tracking-wider uppercase text-black bg-[#0c6955] border border-[#0affca]/20 hover:bg-[#00f0bd] shadow-[0_4px_12px_rgba(10,255,202,0.2)] active:scale-95 transition-all duration-250 cursor-pointer"
                    >
                        Confirm Provision
                    </button>
                </div>
            </AnimatedContainer>
        </div>
    );
}

export default AddNewMemberModal;