export const lineChartOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
    },
  },
  colors: ["var(--chart)"],
  markers: {
    size: 0,
    colors: "white",
    strokeColors: "#71717A",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: "circle",
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    type: "line",
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: "#71717A",
        fontSize: "12px",
        fontWeight: "600",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      color: ["#71717A", "#39B8FF"],
      opacity: 0.5,
    },
  },
  color: ["#71717A", "#39B8FF"],
};
