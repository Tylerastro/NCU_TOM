import { BarChartData } from "@/models/observations";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import React from "react";
import { Bar } from "react-chartjs-2";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

interface HorizontalBarChartProps {
  data: BarChartData;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data }) => {
  let minDate = Infinity;
  let maxDate = -Infinity;

  data.datasets.forEach((dataset) => {
    dataset.data.forEach((range) => {
      minDate = Math.min(minDate, range[0]);
      maxDate = Math.max(maxDate, range[1]);
    });
  });

  // Convert timestamps to ISO 8601 date strings
  const minDateString = new Date(minDate).toISOString();
  const maxDateString = new Date(maxDate).toISOString();

  const options: ChartOptions<"bar"> = {
    indexAxis: "y", // Explicitly typed as 'y'
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd",
        },
        ticks: {
          source: "data",
        },
        min: minDateString,
        max: maxDateString,
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        display: false,
      },
      title: {
        display: false,
        text: "Targets timeline",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;
