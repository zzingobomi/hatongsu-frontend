"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LineChart(props: any) {
  const { chartData, chartOptions } = props;

  return (
    <ApexChart
      type="line"
      options={chartOptions}
      series={chartData}
      height="100%"
      width="100%"
    />
  );
}
