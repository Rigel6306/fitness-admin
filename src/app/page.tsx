
import StatCard from "../components/home/statCards";

export default function Home() {
  return (
    <div className="flex flex-col px-10" >
      {/* heading */}
      <div className="flex flex-col my-10">
        <h1 className="font-semibold text-3xl ">Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>
      {/* stats card */}
      <div className="flex flex-col sm:flex-row   gap-10">
        <StatCard icon={'user'} heading="Total Members" total={260} percentage={12.5} growth={true}/>
        <StatCard icon={'dollor'} heading="Monthly Revenue" total={123000} percentage={11.5} growth={false} />
        <StatCard icon={'delayedPayments'} heading="Delayed Payments" total={260} percentage={16.5} growth={true}/>
        <StatCard icon={'attendence'} heading="Attendance Rate" total={260} percentage={11.3} growth={false}/>
      </div>

    </div>
  );
}
