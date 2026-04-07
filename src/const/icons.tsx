import { LuUsers ,LuDollarSign} from "react-icons/lu";
import { FaArrowUpShortWide,FaMoneyCheckDollar  } from "react-icons/fa6";
import { FcMoneyTransfer } from "react-icons/fc";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
const icons = {
    user:(props:any)=> <LuUsers  color="#ffff" {...props}/>,
    dollor:(props:any)=><FaMoneyCheckDollar  color="#ffff" {...props}/>,
    delayedPayments:(props:any)=><GiTakeMyMoney  color="#ffff" {...props} />,
    attendence:(props:any)=><FaArrowUpShortWide color="#ffff" {...props} />
}

export default icons