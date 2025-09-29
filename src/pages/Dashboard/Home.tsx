import RegistrationMetrics from "../../components/dashboard/RegistrationMeterics.tsx";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Legacy Admin Dashboard"
        description="This is Legacy Dashboard for Admin"
      />
      <div className="grid grid-cols-6 gap-4 md:gap-6">
        <div className="col-span-6 space-y-6 xl:col-span-7">
          <RegistrationMetrics />

          {/* <MonthlySalesChart /> */}
        </div>
        {/* <div className="col-span-6 space-y-6 xl:col-span-7">
          <StatisticsChart />
        </div> */}
      </div>
    </>
  );
}
