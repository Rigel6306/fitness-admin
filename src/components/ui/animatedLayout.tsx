'use client'
import { AnimatePresence,motion } from "motion/react";
import { usePathname } from "next/navigation";
import React from "react";

const AnimatedLayout = ({children}:{children:React.ReactNode}) => {

    const pathName = usePathname()


    return ( 

        <AnimatePresence mode="sync">
            <motion.div
            key={pathName}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-20}}
            transition={{duration:0.4,ease:"easeInOut"}}
            >
                {children}
            </motion.div>
        </AnimatePresence>


     );
}
 
export default AnimatedLayout;