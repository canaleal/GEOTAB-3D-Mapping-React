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

    try{

      if (chartTime == 'year') {
        add_year_chart_data();
      }
      else if (chartTime == 'month') {
  
        add_month_chart_data();
      }
      else if (chartTime == 'day') {
        add_day_chart_data();
      }

    }
    catch (Exception){
      setIsLoaded(true);
      setError(true);
    }
   


  }, [currentYear, chartTime])



  const add_year_chart_data = () =>{


      //Group data by year
      const groups = groupDataBySpecificPropertyValue(chartData, 'Year');
     
      //Get average of each year
      const ped_data = getAverageValueOfEachDateBySpecificPropertyValue(groups, 'count');

      //Get label of each year
      const labels = Object.keys(groups)


      const chart_name = 'count -  (' + currentYear  + ')';
      createChart(ped_data, labels, chart_name);
  }

  const add_month_chart_data = () =>{
    

    //Get current year data
    let currentYear_objects = chartData.filter(function (item) {
      return item.properties.Year === currentYear.toString();
    });

    //Group data by month
    const groups_raw = groupDataBySpecificPropertyValue(currentYear_objects, 'Month');
  

    //Sort data from January to December
    let groups = {};
    for (let i = 1; i < 13; i++) {

      //Add a 0 to the month if it's less than 10 (ex: 01, 02, 03)
      let temp_month = i < 10 ? "0" + i.toString() : i.toString();
      groups[i.toString()] = groups_raw[temp_month]
    }

    //Get average of each month
    const ped_data = getAverageValueOfEachDateBySpecificPropertyValue(groups, 'count');

    //Get label of each month
    const labels = getListNameOfMonths();


    const chart_name = 'count -  (' + currentYear  + ')';
    createChart(ped_data, labels, chart_name);
  }

  const add_day_chart_data = () =>{
    
    const labels = [];
    for (let i = 1; i < 28; i += 5) {
      labels.push(`${i}-${i + 4}`)
    }

    //Make random data
    const ped_data = Array.from(
      { length: labels.length },
      () => Math.floor(Math.random() * 10) + 5
    );

  
    const chart_name = 'count -  (' + currentYear + '-' + 'temp_month' + ')';
    createChart(ped_data, labels, chart_name);

  }


  function createChart(chart_data, labels, chart_name){
    const options = {
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    const data = {
      labels,
      datasets: [
        {
          label: `${chart_name}`,
          data: chart_data,

          backgroundColor: returnListOfColors(),
        },
      ],
    };

    setMapOptions(options);
    setMapData(data);
    setIsLoaded(true);
  }

  function groupDataBySpecificPropertyValue(data, property_name){
    return data.reduce((groups, item) => {
      const group = (groups[item['properties'][property_name]] || []);
      group.push(item);
      groups[item['properties'][property_name]] = group;
      return groups;
    }, {});
  }

  function getAverageValueOfEachDateBySpecificPropertyValue(groups, property_name){
    let impediments_data = [];
    for (const [key, value] of Object.entries(groups)) {
      let value_array = value
      let avg = value_array.reduce((total, next) => total + next['properties'][property_name], 0) / value_array.length
      impediments_data.push(avg)
    }

    return impediments_data;

  }

  function returnListOfColors(){
    return ["rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(201, 203, 207)"]
  }

  function random_rgba() {
    return "#" + (Math.floor(Math.random() * 16777215).toString(16).toString());
  }

  function getListNameOfMonths() {
    let months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months
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
