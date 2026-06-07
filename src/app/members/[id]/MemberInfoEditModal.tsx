'use client'
import { updateDocument } from "@/util/updateDoc";
import { useState, useId } from "react";
import z, { email } from "zod";
import AnimatedContainer from "@/src/components/ui/animatedContainer";

const MemberInfoEditModal = ({ isModalOpen, setIsModalOpen, userData }) => {
    const baseId = useId();
    const [userInputs, setUserInputs] = useState({ ...userData.data })

    const handleInputs = (field, value) => {
        if (field === 'status') {
            setUserInputs((prev) => ({ ...prev, [field]: value === "active" ? true : false }))
            return
        }
        setUserInputs((prev) => ({ ...prev, [field]: value }))
    }

    const userSchema = z.object({
        name: z.string().min(1, "Name is Required"),
        age: z.string().regex(/^\d+$/, "Age must be a number").transform(Number).refine((val) => val > 10 && val < 100, {
            message: "Age must be between 10 and 100"
        }),
        email: z.email("Invalid E-Mail Address"),
        contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
        membershipNumber: z
            .string()
            .regex(/^\d{4}$/, "Membership number must be exactly 4 digits"),
        gender: z.enum(["male", 'female']),
        height: z
            .string()
            .regex(/^\d+$/, "Height must be a number")
            .transform(Number)
            .refine((val) => val > 50 && val < 250, {
                message: "Height must be between 50cm and 250cm",
            }),
        weight: z
            .string()
            .regex(/^\d+$/, "Weight must be a number")
            .transform(Number)
            .refine((val) => val > 20 && val < 300, {
                message: "Weight must be between 20kg and 300kg",
            }),
        packageName: z.enum([
            "workouts only",
            "workouts + treadmill",
            "zumba only",
            "zumba + workout",
            "zumba + workouts + treadmil",
        ]),
    })

    const handleConfirm = async () => {
        const result = userSchema.safeParse(userInputs)
        if (!result.success) {
            console.log("Validation Error at edit Modal:", result.error.issues[0].message)
            alert(`Validation Error: ${result.error.issues[0].message}`)
            return
        }

        const confirmed = window.confirm("Do you want to CONFIRM the changes?");
        if (!confirmed) {
            return;
        }

        try {
            await updateDocument(userData.id, "users", userInputs);
            alert('Member Info Updated Successfully')
            setIsModalOpen(false)
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Something Went wrong. Updation unsuccessfull. please try again")
        }
    };
    console.log("At EditInfoModal", userInputs)

    if (!isModalOpen) return null;

    // Autofill aesthetic protector parameters
    const autofillOverride = {
        WebkitBoxShadow: "0 0 0px 1000px transparent inset",
        WebkitTextFillColor: "rgba(255, 255, 255, 0.8)",
        transition: "background-color 5000s ease-in-out 0s",
    };

    return (
        <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center z-[150] p-4 select-none animate-fadeIn">
            <AnimatedContainer 
                duration={0.3}
                className="bg-black/60 relative w-[90vw] max-w-4xl h-[90vh] rounded-2xl p-6 md:p-8 flex flex-col backdrop-blur-xl overflow-hidden border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)]"
            >
                {/* Accent Background Highlights */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#0affca]/[0.02] blur-3xl rounded-full pointer-events-none" />

                {/* Heading Block Section */}
                <div className="relative z-10 flex justify-between items-start border-b border-white/5 pb-4 shrink-0">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-xl font-bold tracking-wide uppercase text-white/90">
                            Edit Member Information
                        </h2>
                        <p className="text-white/30 text-[10px] font-mono tracking-widest uppercase mt-0.5">
                            Management // Keep member parameters accurate and synchronized
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

                {/* Scrollable Work Area Wrapper */}
                <div className="relative z-10 flex-1 flex flex-col gap-6 overflow-y-auto pr-1 py-4 scrollbar-thin">
                    
                    {/* Current Meta Blueprint Display Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 shrink-0">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-36">User Name :</span>
                                <span className="font-semibold text-white/80 uppercase tracking-wide">{userInputs.name}</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-36">Age Allocation :</span>
                                <span className="font-semibold text-white/80">{userInputs.age} Years</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-36">E-mail Routing :</span>
                                <span className="font-mono text-[11px] text-white/60 lowercase">{userInputs.email}</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-36">Contact Line :</span>
                                <span className="font-mono text-[11px] text-white/80 tracking-wide">{userInputs.contactNumber}</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-36">Membership ID :</span>
                                <span className="font-mono text-[11px] text-[#0affca] font-bold">#{userInputs.membershipNumber}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-2 md:pt-0 md:pl-4">
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-32">Gender Vector :</span>
                                <span className="font-semibold text-white/80 uppercase tracking-wider">{userInputs.gender}</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-32">Height Metric :</span>
                                <span className="font-semibold text-white/80 font-mono">{userInputs.height} CM</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-32">Weight Metric :</span>
                                <span className="font-semibold text-white/80 font-mono">{userInputs.weight} KG</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-32">Package Module :</span>
                                <span className="font-semibold text-white/80 uppercase text-[11px] tracking-wide text-white/70">{userInputs.packageName}</span>
                            </div>
                            <div className="flex gap-2 items-baseline text-xs">
                                <span className="font-mono text-[10px] uppercase text-white/30 w-32">Roster Status :</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-widest ${userInputs.status ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                    {userInputs.status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Mutator Input System Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        
                        {/* Left Column Fields */}
                        <div className="flex flex-col gap-4">
                            {/* Input Field - Name */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-name`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">User Name</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-name`}
                                        type="text" 
                                        value={userInputs.name}
                                        onChange={(e) => handleInputs("name", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold tracking-wide uppercase transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Field - Age */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-age`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Age Allocation</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-age`}
                                        type="number" 
                                        value={userInputs.age}
                                        onChange={(e) => handleInputs("age", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold font-mono tracking-wide transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Field - Email (Readonly) */}
                            <div className="flex flex-col gap-1.5 opacity-60 select-none cursor-not-allowed">
                                <label htmlFor={`${baseId}-email`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/20">E-mail Routing (Locked)</label>
                                <div className="relative flex items-center h-10 bg-white/[0.01] rounded-xl border border-white/5 cursor-not-allowed">
                                    <input 
                                        id={`${baseId}-email`}
                                        type="text" 
                                        readOnly
                                        value={userInputs.email}
                                        className="absolute inset-0 w-full h-full px-3 text-white/40 bg-transparent border-none outline-none text-xs font-mono lowercase cursor-not-allowed"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Field - Contact */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-contact`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Contact Number</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-contact`}
                                        type="tel" 
                                        value={userInputs.contactNumber}
                                        onChange={(e) => handleInputs("contactNumber", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold font-mono tracking-wide transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Field - Membership Number */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-memNum`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Membership Code</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-memNum`}
                                        type="text" 
                                        value={userInputs.membershipNumber}
                                        onChange={(e) => handleInputs("membershipNumber", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-bold font-mono tracking-wider transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column Fields */}
                        <div className="flex flex-col gap-4">
                            {/* Input Selector - Gender */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-gender`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Gender Identity</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300 px-2">
                                    <select
                                        id={`${baseId}-gender`}
                                        value={userInputs.gender}
                                        onChange={(e) => handleInputs("gender", e.target.value)}
                                        className="w-full bg-transparent text-white/80 text-xs font-semibold tracking-wide uppercase outline-none border-none cursor-pointer p-1"
                                    >
                                        <option className="bg-[#0b0b0c] text-white/80" value="male">Male</option>
                                        <option className="bg-[#0b0b0c] text-white/80" value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            {/* Input Field - Height */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-height`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Height (CM)</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-height`}
                                        type="text" 
                                        value={userInputs.height}
                                        onChange={(e) => handleInputs("height", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold font-mono tracking-wide transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Field - Weight */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-weight`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Weight (KG)</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300">
                                    <input 
                                        id={`${baseId}-weight`}
                                        type="text" 
                                        value={userInputs.weight}
                                        onChange={(e) => handleInputs("weight", e.target.value)}
                                        className="absolute inset-0 w-full h-full px-3 text-white/80 bg-transparent border-none outline-none text-xs font-semibold font-mono tracking-wide transition-colors duration-300"
                                        style={autofillOverride}
                                    />
                                </div>
                            </div>

                            {/* Input Selector - Membership Package */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-package`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Subscription Package Matrix</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300 px-2">
                                    <select
                                        id={`${baseId}-package`}
                                        value={userInputs.packageName}
                                        onChange={(e) => handleInputs("packageName", e.target.value)}
                                        className="w-full bg-transparent text-white/80 text-xs font-semibold tracking-wide uppercase outline-none border-none cursor-pointer p-1"
                                    >
                                        <option className="bg-[#0b0b0c] text-white/80" value="workouts only">Workouts Only</option>
                                        <option className="bg-[#0b0b0c] text-white/80" value="workouts + treadmill">Workouts + Treadmill</option>
                                        <option className="bg-[#0b0b0c] text-white/80" value="zumba only">Zumba Only</option>
                                        <option className="bg-[#0b0b0c] text-white/80" value="zumba + workouts">Zumba + Workouts</option>
                                        <option className="bg-[#0b0b0c] text-white/80" value="zumba + workouts + treadmil">Zumba + Workouts + Treadmil</option>
                                    </select>
                                </div>
                            </div>

                            {/* Input Selector - Status */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={`${baseId}-status`} className="text-[10px] font-bold font-mono tracking-wider uppercase text-white/40 cursor-pointer">Deployment Status</label>
                                <div className="relative flex items-center h-10 bg-white/[0.03] rounded-xl border border-white/5 focus-within:border-white/20 transition-all duration-300 px-2">
                                    <select
                                        id={`${baseId}-status`}
                                        value={userInputs.status ? "active" : "inactive"}
                                        onChange={(e) => handleInputs("status", e.target.value)}
                                        className="w-full bg-transparent text-white/80 text-xs font-semibold tracking-wide uppercase outline-none border-none cursor-pointer p-1"
                                    >
                                        <option className="bg-[#0b0b0c] text-emerald-400 font-mono" value="active">Active System</option>
                                        <option className="bg-[#0b0b0c] text-red-400 font-mono" value="inactive">Inactive Standby</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Trigger Controls Actions Footer */}
                <div className="relative z-10 flex mt-2 justify-end gap-3 border-t border-white/5 pt-4 shrink-0">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="h-10 px-6 rounded-xl text-xs font-bold tracking-wider uppercase text-black bg-[#0ae2ff7a] border border-[#0affca]/20 hover:bg-[#0ae2ffad] shadow-[0_4px_12px_rgba(10,255,202,0.2)] active:scale-95 transition-all duration-250 cursor-pointer"
                    >
                        Commit Changes
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="h-10 px-5 rounded-xl text-xs font-bold tracking-wider uppercase text-white/50 bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:text-white/80 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>

            </AnimatedContainer>
        </div>
    );
}

export default MemberInfoEditModal;