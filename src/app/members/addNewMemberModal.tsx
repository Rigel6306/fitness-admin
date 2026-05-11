
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
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { useState } from "react";
import { addNewUser } from "@/util/addNewUser";
import { serverTimestamp } from "firebase/firestore";
import z from "zod";
const AddNewMemberModal = ({ setIsModalOpen }) => {
    const [userInputs, setUserInputs] = useState({
        name: undefined,
        age: undefined,
        email: undefined,
        contactNumber: undefined,
        membershipNumber: undefined,
        gender: "male",
        height: undefined,
        weight: undefined,
        packageName: "Workouts Only",

    })

    const [validInput, setValidinput] = useState({
        name: false,
        age: false,
        email: false,
        contactNumber: false,
        membershipNumber: false,
        gender: false,
        height: false,
        weight: false,
        packageName: false

    })


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
            "Workouts Only",
            "Workouts + Treadmill",
            "Zumba Only",
            "Zumba + Workouts",
            "Zumba + Workouts + Treadmil",
        ]),



    })

    const handleInputs = (field: any, value: any) => {

        setUserInputs(prev => ({ ...prev, [field]: value }))
        const result = userSchema.shape[field].safeParse(value)
        setValidinput(prev=>({...prev,[field]:result.success?true:false}))

        //  const result = userSchema.pick({ [field]: true }).safeParse({ [field]: value })
        console.log("at Handle Inputs",result)
    
    }

    console.log(validInput)

    const handleConfirm = () => {
        const result = userSchema.safeParse(userInputs)
        if (!result.success) {
            console.log("Validation Error at edit Modal:", result.error.issues[0].message)
            return
        }
        console.log(result)
        const userData = { ...userInputs, registerdAt: serverTimestamp(), status: true }
        console.log("Final UserData At add Modal", userData)
        addNewUser(userData)

    }
    return (

        <div className="fixed inset-0  bg-gray-600/30 flex items-center justify-center z-50">
            <div className="bg-[#000000]/50  h-[95vh] rounded-2xl p-2 px-6  shadow-lg flex flex-col backdrop-blur-xl overflow-y-auto ">
                {/* Heading */}
                <div className="heading flex gap-15 justify-between py-3">
                    <div className="flex flex-col">
                        <p className="text-heading text-xl">Add a new Member</p>
                        <p className="text-sub">Provide complete information to add a member</p>

                    </div>

                    <p className="cursor-pointer text-white font-bold" onClick={() => setIsModalOpen(false)}>✕</p>
                </div>

                {/* Input Section */}

                <div className="flex mt-4 flex-col  flex-1 justify-center mx-20  gap-4">

                    <div className="flex items-center  gap-4">
                        <BiUser size={24} />
                        <input
                            onChange={(e) => handleInputs("name", e.target.value)}
                            className={`${validInput.name?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                            placeholder="User Name"
                            type="text" name="age" id="age" value={userInputs.name || ''} />

                    </div>
                    <div className="flex items-center  gap-4">
                        <PiCalendarStarFill size={24} />
                        <input
                            onChange={(e) => handleInputs("age", e.target.value)}
                            className={`${validInput.age?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                            placeholder="Age"
                            type="number" name="age" id="age" value={userInputs.age || ''} />
                    </div>
                    <div className="flex items-center  gap-4">
                        <MdOutlineAlternateEmail size={24} />
                        <input
                            onChange={(e) => handleInputs("email", e.target.value)}
                            placeholder="E-Mail"
                            className={`${validInput.email?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                            type="text" name="email" id="email" value={userInputs.email || ''} />
                    </div>
                    <div className="flex items-center  gap-4">
                        <CiMobile1 size={24} />
                        <input
                            onChange={(e) => handleInputs("contactNumber", e.target.value)}
                            className={`${validInput.contactNumber?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                            type="tel" name="pno" id="pno"
                            placeholder="Contact Number"
                            value={userInputs.contactNumber || ''} />
                    </div>
                    <div className="flex items-center  gap-4">
                        <FaRegIdCard size={24} />
                        <input
                            onChange={(e) => handleInputs("membershipNumber", e.target.value)}
                            placeholder="Membership Number"
                            className={`${validInput.membershipNumber?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                            type="text" name="membershipNumber" id="membershipNumber" value={userInputs.membershipNumber || ''} />
                    </div>
                    <div className="flex items-center  gap-4">
                        <BsGenderAmbiguous size={24} />
                        <div className="bg-[#7f818244] pe-2 rounded-xl flex-1 ">
                            <select
                                onChange={(e) => handleInputs("gender", e.target.value)}
                                className=" p-2 rounded-xl w-full " value={userInputs.gender || ''} name="gender" id="gender"  >
                                <option className="bg-gray-600" value="male">Male</option>
                                <option className="bg-gray-600" value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center  gap-4">
                        <RiLineHeight size={24} />
                        <input
                            onChange={(e) => handleInputs("height", e.target.value)}
                            placeholder="Height (CM)"
                            className={`${validInput.height?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                             type="text" name="height" id="height" value={userInputs.height || ''} />
                    </div>

                    <div className="flex items-center  gap-4">
                        <LuWeight size={24} />
                        <input
                            onChange={(e) => handleInputs("weight", e.target.value)}
                            placeholder="Weight (KG)"
                            className={`${validInput.weight?"bg-[#89eac644]":"bg-[#7f818244]"} bg-[#7f818244] p-2 rounded-xl flex-1 `}
                             type="text" name="weight" id="weight" value={userInputs.weight || ''} />
                    </div>

                    <div className="flex items-center  gap-4">
                        <FaChalkboardUser size={24} />
                        <div className="bg-[#7f818244] pe-2 rounded-xl ">
                            <select
                                onChange={(e) => handleInputs("packageName", e.target.value)}
                                className=" p-2 rounded-xl " value={userInputs.packageName || ''} name="membership" id="membership"  >
                                <option className="bg-gray-600" value="Workouts Only">Workouts Only</option>
                                <option className="bg-gray-600" value="Workouts + Treadmill">Workouts + Treadmill</option>
                                <option className="bg-gray-600" value="Zumba Only">Zumba Only</option>
                                <option className="bg-gray-600" value="Zumba + Workouts">Zumba + Workouts</option>
                                <option className="bg-gray-600" value="Zumba + Workouts + Treadmil">Zumba + Workouts + Treadmil</option>

                            </select>
                        </div>
                    </div>

                </div>

                <div className="flex mt-4 justify-end gap-4">
                    <div
                        onClick={handleConfirm}
                        className="flex p-2 font-semibold bg-[#76787a44] w-20 items-center justify-center rounded-xl cursor-pointer hover:bg-[#c6ced588]">
                        <p>Confirm</p>
                    </div>
                    <div
                        onClick={() => { setIsModalOpen(false) }}
                        className="flex p-2 font-semibold bg-[#af002fdc] w-20 items-center justify-center rounded-xl cursor-pointer hover:bg-[#f20535fa]">
                        <p>Cancle</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewMemberModal;