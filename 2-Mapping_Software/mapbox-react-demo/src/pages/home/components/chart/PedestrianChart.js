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

const PedestrianChart = ({ years, currentYear }) => {
  const options = {
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {

      title: {
        display: true,
        text: `# of Pedestrians - Average per Hour`,
      },
    },
  };

  const labels = years;

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
        backgroundColor: "rgb(59,130,246,0.5)",
      },
    ],
  };

  return (
    <div className="h-64"><Bar options={options} data={data} /></div>

  )
};

export default PedestrianChart;
