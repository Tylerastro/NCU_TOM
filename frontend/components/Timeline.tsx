import React from "react";
import { Line } from "react-chartjs-2"; // Import Line instead of Bar
import "chartjs-adapter-date-fns";
import { LineChartData } from "@/models/observations";
import zoomPlugin from "chartjs-plugin-zoom";
import { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement, // Used for line chart
  LineElement, // Used for line chart
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // Register PointElement
  LineElement, // Register LineElement
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

interface HorizontalLineChartProps {
  data: LineChartData;
}

const HorizontalLineChart: React.FC<HorizontalLineChartProps> = ({ data }) => {
  let minDate = Infinity;
  let maxDate = -Infinity;

  data.datasets.forEach((dataset) => {
    dataset.data.forEach((dataPoint) => {
      if (dataPoint.x < minDate) minDate = dataPoint.x;
      if (dataPoint.x > maxDate) maxDate = dataPoint.x;
    });
  });

  // Convert timestamps to ISO 8601 date strings
  const minDateString = new Date(minDate).toISOString();
  const maxDateString = new Date(maxDate).toISOString();

  const options: ChartOptions<"line"> = {
    indexAxis: "y",
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "MMM dd HH:mm",
          displayFormats: {
            hour: "HH:mm",
            day: "MMM dd",
          },
        },
        ticks: {
          autoSkip: true,
          source: "data",
        },
        min: minDateString,
        max: maxDateString,
        stacked: false,
      },
      y: {
        beginAtZero: true,
        type: "linear",
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 2,
        borderWidth: 1,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: true,
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
            enabled: false,
          },
          pinch: {
            enabled: false,
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default HorizontalLineChart;
