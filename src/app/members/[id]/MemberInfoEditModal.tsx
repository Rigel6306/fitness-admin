'use client'
import { updateDocument } from "@/util/updateDoc";
import { useState } from "react";
import z, { email } from "zod";
import AnimatedContainer from "@/src/components/ui/animatedContainer";

const MemberInfoEditModal = ({ isModalOpen, setIsModalOpen, userData }) => {

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


    return (
        <div className="fixed inset-0 bg-gray-600/15 flex items-center justify-center z-150">
            <AnimatedContainer className="bg-[#000000]/50 w-[90vw] max-w-4xl h-[90vh] rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-xl overflow-hidden">

                <div className="heading flex justify-between py-3">
                    <div className="flex flex-col">
                        <p className="text-heading text-xl">Edit member information</p>
                        <p className="text-sub">Keep member details accurate and up to date</p>

                    </div>

                    <p className=" cursor-pointer" onClick={() => setIsModalOpen(false)}>✕</p>
                </div>

                {/* Curent Info Section */}

                <div className="flex justify-between mt-4 bg-[#00000000] backdrop-blur-2xl rounded-2xl py-3">

                    <div className="flex flex-col">

                        <div className="flex flex-1 items-center mx-10 mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">User Name :</p>
                                <p className="text-sub text-sm">{userInputs.name}</p>
                            </div>
                        </div>

                        <div className="flex mx-10 flex-1  items-center mt-2">

                            <div className="flex gap-2  ">
                                <p className="text-heading text-sm">Age :</p>
                                <p className="text-sub text-sm">{userInputs.age}</p>
                            </div>
                        </div>

                        <div className="flex mx-10 flex-1  items-center mt-2 ">

                            <div className="flex gap-2  ">
                                <p className="text-heading text-sm">E-mail :</p>
                                <p className="text-sub text-sm">{userInputs.email}</p>
                            </div>
                        </div>

                        <div className="flex mx-10 flex-1  items-center mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">Contact Number :</p>
                                <p className="text-sub text-sm">{userInputs.contactNumber}</p>
                            </div>
                        </div>
                        <div className="flex mx-10  flex-1 items-center mt-2 ">

                            <div className="flex gap-2  ">
                                <p className="text-heading text-sm">Membership Number :</p>
                                <p className="text-sub text-sm">{userInputs.membershipNumber}</p>
                            </div>
                        </div>



                    </div>



                    <div className="flex-col">

                        <div className="flex  min-w-[320] items-center mx-10 mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">Gender :</p>
                                <p className="text-sub text-sm">{userInputs.gender}</p>
                            </div>
                        </div>

                        <div className="flex flex-1 mx-10  items-center mt-2 ">


                            <div className="flex gap-2  ">
                                <p className="text-heading text-sm">Height :</p>
                                <p className="text-sub text-sm">{userInputs.height} CM</p>
                            </div>
                        </div>

                        <div className="flex flex-1 mx-10  items-center mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">Weight :</p>
                                <p className="text-sub text-sm">{userInputs.weight} KG</p>
                            </div>
                        </div>

                        <div className="flex flex-1 mx-10  items-center mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">Membership :</p>
                                <p className="text-sub text-sm">{userInputs.packageName}</p>
                            </div>
                        </div>
                        <div className="flex flex-1 mx-10  items-center mt-2 ">

                            <div className="flex gap-2 ">
                                <p className="text-heading text-sm">Status :</p>
                                <p className="text-sub text-sm">{`${userInputs.status ? "Active" : "Inactive"}`}</p>
                            </div>
                        </div>


                    </div>


                </div>

                {/* Input Fields Section */}

                <div className="flex mt-4 justify-between flex-1 items-center">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="name">User Name</label>
                            <input onChange={(e) => handleInputs("name", e.target.value)}
                                className="bg-[#7f818244]  p-2 rounded-xl" type="text" name="name" id="name" value={userInputs.name} />
                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2 " htmlFor="age">Age</label>
                            <input
                                onChange={(e) => handleInputs("age", e.target.value)}
                                className="bg-[#7f818244] p-2 rounded-xl max-w-40"
                                type="number" name="age" id="age" value={userInputs.age} />
                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="email">E-mail</label>
                            <input
                                // onChange={(e) => handleInputs("email", e.target.value)} keep as readonly coz changing the email may cause accidential problems 
                                readOnly
                                className="bg-[#7f818244] p-2 rounded-xl" type="text" name="email" id="email" value={userInputs.email} />
                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="pno">Contact Number</label>
                            <input
                                onChange={(e) => handleInputs("contactNumber", e.target.value)}
                                className="bg-[#7f818244] p-2 rounded-xl" type="tel" name="pno" id="pno"
                                value={userInputs.contactNumber} />
                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="membershipNumber">Membership Number</label>
                            <input
                                onChange={(e) => handleInputs("membershipNumber", e.target.value)}
                                className="bg-[#7f818244] p-2 rounded-xl" type="text" name="membershipNumber" id="membershipNumber" value={userInputs.membershipNumber} />
                        </div>

                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl h-10 justify-between">
                            <label className="ms-2" htmlFor="gender">Gender</label>

                            <div className=" bg-[#7f818244] pe-2 rounded-xl  ">
                                <select
                                    onChange={(e) => handleInputs("gender", e.target.value)}
                                    className="p-2 rounded-xl w-40" value={userInputs.gender} name="gender" id="gender"  >
                                    <option className="bg-gray-600" value="male">Male</option>
                                    <option className="bg-gray-600" value="female">Female</option>
                                </select>
                            </div>

                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="height">Height (cm) </label>
                            <input
                                onChange={(e) => handleInputs("height", e.target.value)}
                                className="bg-[#7f818244] p-2 rounded-xl" type="text" name="height" id="height" value={userInputs.height} />
                        </div>
                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl justify-between">
                            <label className="ms-2" htmlFor="weight">Weight (kg) </label>
                            <input
                                onChange={(e) => handleInputs("weight", e.target.value)}
                                className="bg-[#7f818244] p-2 rounded-xl" type="text" name="weight" id="weight" value={userInputs.weight} />
                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl h-10 justify-between">
                            <label className="ms-2" htmlFor="membership">Membership</label>

                            <div className=" bg-[#7f818244] pe-2 rounded-xl ">
                                <select
                                    onChange={(e) => handleInputs("packageName", e.target.value)}
                                    className=" p-2 rounded-xl w-70" value={userInputs.packageName} name="membership" id="membership"  >
                                    <option className="bg-gray-600" value="workouts only">Workouts Only</option>
                                    <option className="bg-gray-600" value="workouts + treadmill">Workouts + Treadmill</option>
                                    <option className="bg-gray-600" value="zumba only">Zumba Only</option>
                                    <option className="bg-gray-600" value="zumba + workouts">Zumba + Workouts</option>
                                    <option className="bg-gray-600" value="zumba + workouts + treadmil">Zumba + Workouts + Treadmil</option>

                                </select>
                            </div>

                        </div>

                        <div className="flex items-center gap-2 bg-[#2c2e3144] rounded-2xl h-10 justify-between">
                            <label className="ms-2" htmlFor="status">Status</label>
                            <div className=" bg-[#7f818244] pe-2 rounded-xl  ">
                                <select
                                    onChange={(e) => handleInputs("status", e.target.value)}
                                    className="p-2 rounded-xl w-40" name="status" id="status"  >
                                    <option className="bg-gray-600" value="active">Active</option>
                                    <option className="bg-gray-600" value="inactive">Inactive</option>
                                </select>
                            </div>

                        </div>


                    </div>
                </div>

                {/* Action Btns */}
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

            </AnimatedContainer>

        </div>

    );
}

export default MemberInfoEditModal;