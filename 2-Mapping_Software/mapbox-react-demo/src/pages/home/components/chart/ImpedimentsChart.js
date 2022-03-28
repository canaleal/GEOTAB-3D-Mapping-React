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

const ImpedimentsChart = ({ chartTime, currentYear, currentMonth, chartData }) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [mapOptions, setMapOptions] = useState()
  const [mapData, setMapData] = useState()


  useEffect(() => {

    try {
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
    catch (Exception) {
     
      setIsLoaded(true);
      setError(true);
    }



  }, [currentYear, currentMonth, chartTime])



  const add_year_chart_data = () => {



    //Group data by year 
    const groups = chartData.reduce((groups, item) => {
      const group = (groups[item.properties.Year] || []);
      group.push(item);
      groups[item.properties.Year] = group;
      return groups;
    }, {});

    let impediments_data = []
    for (const [key, value] of Object.entries(groups)) {
      let year_array = value
      let avg = year_array.reduce((total, next) => total + next.properties.AvgAcceleration, 0) / year_array.length
      impediments_data.push(avg)
    }
    let labels = Object.keys(groups)


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
          label: `count - ${chartTime}`,
          data: impediments_data,

          backgroundColor: returnListOfColors(),
        },
      ],
    };


    setMapOptions(options);
    setMapData(data);
    setIsLoaded(true);
  }

  const add_month_chart_data = () => {
    const options = {
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      maintainAspectRatio: false,

    };


    //Get current year data
    let currentYear_objects = chartData.filter(function (item) {
      return item.properties.Year === currentYear.toString();
    });

    //Group data by month
    const groups_raw = currentYear_objects.reduce((groups, item) => {
      const group = (groups[item.properties.Month] || []);
      group.push(item);
      groups[item.properties.Month] = group;
      return groups;
    }, {});

    //Sort data from Jan to Dec
    let groups = {};
    for (let i = 1; i < 13; i++) {
      let temp_month = i < 10 ? "0" + i.toString() : i.toString();
      groups[i.toString()] = groups_raw[temp_month]
    }

    //Get average acceleration
    let impediments_data = []
    for (const [key, value] of Object.entries(groups)) {
      let month_array = value
      let avg = month_array.reduce((total, next) => total + next.properties.AvgAcceleration, 0) / month_array.length
      impediments_data.push(avg)
    }

    

    const labels = getListNameOfMonths();

    const data = {
      labels,
      datasets: [
        {
          label: `count - ${chartTime} (${currentYear})`,
          data: impediments_data,

          backgroundColor: returnListOfColors(),
        },
      ],
    };


    setMapOptions(options);
    setMapData(data);
    setIsLoaded(true);
  }

  const add_day_chart_data = () => {

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

    let temp_month = currentMonth < 10 ? "0" + currentMonth.toString() : currentMonth.toString()

    //Get current year data
    let currentYearMonth_objects = chartData.filter(function (item) {
      return item.properties.Year === currentYear.toString() && item.properties.Month === temp_month.toString();
    });





    //Group data by day
    const groups_raw = currentYearMonth_objects.reduce((groups, item) => {
      const group = (groups[item.properties.Day] || []);
      group.push(item);
      groups[item.properties.Day] = group;
      return groups;
    }, {});


    //Sort data from Jan to Dec
    let groups = {};
    for (let i = 1; i < 29; i++) {
      let temp_day = i < 10 ? "0" + i.toString() : i.toString();
      groups[i.toString()] = groups_raw[temp_day]
    }


    //Get average acceleration
    let impediments_data = []
    for (const [key, value] of Object.entries(groups)) {
      try {
        let day_array = value
        let avg = day_array.reduce((total, next) => total + next.properties.AvgAcceleration, 0) / day_array.length
        impediments_data.push(avg)
      }
      catch {

      }

    }

    let labels = Object.keys(groups)

    const data = {
      labels,
      datasets: [
        {
          label: `count - ${chartTime} (${currentYear} - ${currentMonth})`,
          data: impediments_data,

          backgroundColor: returnListOfColors(),
        },
      ],
    };


    setMapOptions(options);
    setMapData(data);
    setIsLoaded(true);
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
    <div className={'h-64'}>

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

export default ImpedimentsChart;
