import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PedestrianChart = ({ chartTime, currentYear, chartData }) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [mapOptions, setMapOptions] = useState()
  const [mapData, setMapData] = useState()


  useEffect(() => {

    if (chartTime == 'year') {



      //Group data by year 
      const groups = chartData.reduce((groups, item) => {
        const group = (groups[item.properties.year] || []);
        group.push(item);
        groups[item.properties.year] = group;
        return groups;
      }, {});

      let ped_data = []
      for (const [key, value] of Object.entries(groups)) {
        let year_array = value
        let avg = year_array.reduce((total, next) => total + next.properties.count, 0) / year_array.length
        ped_data.push(avg)
      }
      let ped_labels = Object.keys(groups)



      const options = {
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        maintainAspectRatio: false,

      };


      const labels = ped_labels;
      const data = {
        labels,
        datasets: [
          {
            label: `count - ${chartTime}`,
            data: ped_data,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)"
            ],
          },
        ],
      };


      setMapOptions(options);
      setMapData(data);
      setIsLoaded(true);
    }
    else if (chartTime == 'month') {


      const options = {
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        maintainAspectRatio: false,

      };

      const labels = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      const colors = [];
      for (let i = 0; i < 12; i++) {
        colors.push(random_rgba())
      }

      const data = {
        labels,
        datasets: [
          {
            label: `count - ${chartTime} (${currentYear})`,
            data: Array.from(
              { length: labels.length },
              () => Math.floor(Math.random() * 400) + 100
            ),

            backgroundColor: ['#F44336',
              '#039BE5',
              '#0288D1',
              '#0277BD',
              '#1A237E',
              '#8C9EFF',
              '#536DFE',
              '#3D5AFE',
              '#E53935',
              '#D32F2F',
              '#C62828',

              '#D50000',
              '#E91E63',
              '#FCE4EC',
              '#F8BBD0',

              '#E91E63',
              '#D81B60',
              '#C2185B',
              '#AD1457',
              '#880E4F',
              '#FF80AB',],
          },
        ],
      };


      setMapOptions(options);
      setMapData(data);
      setIsLoaded(true);
    }

    else if (chartTime == 'day') {


      const options = {
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        maintainAspectRatio: false,

        // indexAxis: 'y',
      };

      const labels = [];
      for (let i = 1; i < 28; i += 5) {
        labels.push(`${i}-${i + 4}`)
      }

      const colors = [];
      for (let i = 0; i < 12; i++) {
        colors.push(random_rgba())
      }

      const data = {
        labels,
        datasets: [
          {
            label: `count - ${chartTime} (${currentYear} - January)`,
            data: Array.from(
              { length: labels.length },
              () => Math.floor(Math.random() * 10) + 5
            ),

            backgroundColor: ['#F44336',
              '#039BE5',
              '#0288D1',
              '#0277BD',
              '#1A237E',
              '#8C9EFF',
              '#536DFE',
              '#3D5AFE',
              '#E53935',
              '#D32F2F',
              '#C62828',

              '#D50000',
              '#E91E63',
              '#FCE4EC',
              '#F8BBD0',

              '#E91E63',
              '#D81B60',
              '#C2185B',
              '#AD1457',
              '#880E4F',
              '#FF80AB',],
          },
        ],
      };


      setMapOptions(options);
      setMapData(data);
      setIsLoaded(true);
    }


  }, [currentYear, chartTime])


  function random_rgba() {

    return "#" + (Math.floor(Math.random() * 16777215).toString(16).toString());
  }









  return (
    <div className={chartTime != 'hours' ? 'h-64' : 'h-128'}>

      {isLoaded ?

        error ?
          <p>Error! Unable to load projects.</p>
          :
          <Bar options={mapOptions} data={mapData} />

        :
        <p>Loading</p>
      }



    </div>

  )
};

export default PedestrianChart;
