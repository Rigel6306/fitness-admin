import { FaArrowUp,FaArrowDown } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import icons from "@/src/const/icons";

interface statCardsProp {
    icon: "user" | "dollor" | "delayedPayments" | "attendence",
    heading:string,
    total:number,
    percentage:number,
    growth:boolean

}

const StatCard = ({icon,heading,total,percentage,growth}:statCardsProp) => {

   

    return (
        <div className="container flex  bg-gray-700  p-4 rounded-2xl gap-2">
            <div className="flex flex-col flex-3 gap-2">
                <h1>{heading}</h1>
                <h3 className="text-xl sm:text-2xl md:text-3xl">{total}</h3>
                <hr />
                <div className="flex gap-2 items-center " >
                    
                    {
                        growth?  <FaArrowUp size={17} color="oklch(72.3% 0.219 149.579)" />:
                    <FaArrowDown color="#f6339a"/>
                    }
                  
                    <p className="text-gray-400"> <span className={`${growth?"text-green-500":'text-pink-500'}`}>{`${growth?"+":"-"}`}12.5% </span>vs Last Month</p>
                </div>
            </div>
            <div className="statIcon flex h-full s items-center justify-center">
                <div className="p-2 rounded-2xl bg-indigo-500/40">
                    {icons[icon]({size:30})}
                </div>

            </div>

        </div>);
}

export default StatCard;