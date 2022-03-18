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

const PedestrianChart = ({ chartData }) => {
  //console.log("🚀 ~ file: PedestrianChart.js ~ line 22 ~ PedestrianChart ~ chartData", chartData)



    let ped_labels = chartData.map(function(e) {
      return e.properties.year;
    });
    let ped_data = chartData.map(function(e) {
        return e.properties.count;
    });;

  
  

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

  const labels = ped_labels;

  const data = {
    labels,
    datasets: [
      {
        label: "count",
        data:ped_data,
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
