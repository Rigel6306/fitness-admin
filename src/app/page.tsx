
import StatCard from "../components/home/statCards";
import { ChartAreaInteractive } from "../components/ui/chart/AreaChart";
import { ChartPieSimple } from "../components/ui/chart/PieChart";

export default function Home() {
  return (
    <div className="flex flex-col pb-4 px-10 h-[calc(100vh-80px)] overflow-hidden" >
      {/* heading */}
      <div className="flex flex-col my-8 font-mono tracking-wider">
        <h1 className="font-semibold text-xl text-heading uppercase">Dashboard</h1>
        <p className="text-white/30">Welcome back! Here's what's happening today.</p>
      </div>
      {/* stats card */}
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard icon={'user'} heading="Total Members" total={260} percentage={12.5} growth={true} />
        <StatCard icon={'dollor'} heading="Monthly Revenue" total={123000} percentage={11.5} growth={false} />
        <StatCard icon={'delayedPayments'} heading="Delayed Payments" total={260} percentage={16.5} growth={true} />
        <StatCard icon={'attendence'} heading="Attendance Rate" total={260} percentage={11.3} growth={false} />
      </div>

      <div className="flex gap-4 mt-4 flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <ChartPieSimple />
        </div>
        <div className="flex-1 min-h-0" >
          <ChartAreaInteractive />
        </div>
      </div>



    </div>
  );
}
