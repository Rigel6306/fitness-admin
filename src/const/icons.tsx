import { LuUsers ,LuDollarSign} from "react-icons/lu";
import { FaArrowUpShortWide } from "react-icons/fa6";
import { GiPayMoney } from "react-icons/gi";
const icons = {
    user:(props:any)=> <LuUsers  {...props}/>,
    dollor:(props:any)=><LuDollarSign {...props}/>,
    delayedPayments:(props:any)=><GiPayMoney {...props} />,
    attendence:(props:any)=><FaArrowUpShortWide {...props} />
}

export default icons