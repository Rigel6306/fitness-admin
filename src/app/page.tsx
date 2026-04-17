
import StatCard from "../components/home/statCards";
import { ChartAreaInteractive } from "../components/ui/chart/AreaChart";
import { ChartPieSimple } from "../components/ui/chart/PieChart";

export default function Home() {
  return (
    <div className="flex flex-col pb-10 px-10 bg-[#07020b]" >
      {/* heading */}
      <div className="flex flex-col my-10">
        <h1 className="font-semibold text-3xl text-[#E0E0E0] ">Dashboard</h1>
        <p className="text-[#B0B0B0]">Welcome back! Here's what's happening today.</p>
      </div>
      {/* stats card */}
      <div className="flex flex-col sm:flex-row   gap-10">
        <StatCard icon={'user'} heading="Total Members" total={260} percentage={12.5} growth={true} />
        <StatCard icon={'dollor'} heading="Monthly Revenue" total={123000} percentage={11.5} growth={false} />
        <StatCard icon={'delayedPayments'} heading="Delayed Payments" total={260} percentage={16.5} growth={true} />
        <StatCard icon={'attendence'} heading="Attendance Rate" total={260} percentage={11.3} growth={false} />
      </div>

      <div className="flex w-full  gap-6  mt-10">
        <div className="flex-1 h-full  ">
          <ChartPieSimple />
        </div>
        <div className="flex-1" >
          <ChartAreaInteractive />
        </div>
      </div>



    </div>
  );
}
