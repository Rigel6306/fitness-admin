
import { strict } from 'assert'
import { motion } from 'motion/react'
import { Children, ReactNode } from 'react'

type AnimatedContainerProps = {
    children: ReactNode,
    className: string,
    duration?: number
}

const AnimatedContainer = ({ children, className, duration }: AnimatedContainerProps) => {

    return (

        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                duration: duration ? duration : 0.6, 
                ease: "easeOut",
                type: "spring", 
                stiffness: 320, 
                damping: 20,
                layout: { type: "spring", stiffness: 120, damping: 20 }
            }}
            exit={{ opacity: 0, scale: 0.95 }}  
            className={className}
        >
            {
                children
            }
        </motion.div>
    )

}

export default AnimatedContainer