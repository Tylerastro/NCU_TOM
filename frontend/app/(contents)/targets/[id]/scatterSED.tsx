import { getTargetSED } from "@/apis/targets";
import { TargetSED } from "@/models/targets";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend, // Used for line chart
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  TimeScale, // Used for line chart
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect } from "react";
import { Scatter } from "react-chartjs-2";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement, // Register PointElement
  LineElement, // Register LineElement
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type ScatterSEDProps = {
  id: number;
};

const ScatterSED = ({ id }: ScatterSEDProps) => {
  const [targetSED, setTargetSED] = React.useState<TargetSED | null>();
  const [vfV, setVfV] = React.useState<
    { x: number; y: number; yMin: number; yMax: number; filter: string }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTargetSED(id)
      .then((targetSED) => {
        setTargetSED(targetSED);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (targetSED) {
      const speedOfLight = 3e8;
      const frequencies = targetSED.frequency;
      const fluxv = targetSED.fluxv;
      const filter = targetSED.filter;
      const fluxMin = targetSED.fluxMin;
      const fluxMax = targetSED.fluxMax;

      const newVfV = frequencies.map((frequency, index) => ({
        x: speedOfLight / frequency,
        y: fluxv[index],
        yMin: fluxMin[index],
        yMax: fluxMax[index],
        filter: filter[index],
      }));

      setVfV(newVfV);
      console.log(newVfV);
    }
  }, [targetSED]);

  const data = {
    datasets: [
      {
        label: "Astronomical Flux",
        data: vfV,
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const options: ChartOptions<"scatter"> = {
    scales: {
      x: {
        type: "logarithmic",
        position: "bottom",
        title: {
          display: true,
          text: "Wavelength (nm)",
        },
        ticks: {
          callback: function (value, index, ticks) {
            return Number(value).toExponential(2);
          },
        },
      },
      y: {
        type: "logarithmic",
        min: 1e-30,
        max: 1e-12,
        title: {
          display: true,
          text: "vF(v) (W/m²)",
        },
        ticks: {
          callback: function (value, index, ticks) {
            return Number(value).toExponential(2);
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipitems) => {
            const item = tooltipitems[0];
            const dataPoint = item.raw as {
              x: number;
              y: number;
              yMin: number;
              yMax: number;
              filter: string;
            };
            return `${dataPoint.filter}`;
          },

          label: (context) => {
            const dataPoint = context.raw as {
              x: number;
              y: number;
              yMin: number;
              yMax: number;
              filter: string;
            };
            return `Wavelength: ${dataPoint.x} Flux: ${dataPoint.y}`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Scatter key={vfV.length} data={data} options={options} />;
};

export default ScatterSED;
