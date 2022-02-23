import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PedestrianChart = () => {
    const options = {
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          
          title: {
            display: true,
            text: 'Pedestrians',
          },
        },
      };
  const labels = ["2015", "2016", "2017", "2018", "2019", "2020"];
  const data = {
    labels,
    datasets: [
      {
        label: "count",
        data: Array.from(
          { length: labels.length },
          () => Math.floor(Math.random() * 400) + 100
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default PedestrianChart;
