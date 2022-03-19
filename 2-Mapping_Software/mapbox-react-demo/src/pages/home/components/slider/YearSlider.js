import Slider from "rc-slider";
import { useState, useEffect } from "react";

const TimeSlider = ({ minYear, maxYear, currentYear, yearSliderHandler }) => {



  return (


    <Slider
      min={minYear}
      max={maxYear}
      value={currentYear}
      onChange={yearSliderHandler}
      dots={true}
      marks={{ 2015: '2015', 2016: '2016', 2017: '2017', 2018: '2018', 2019: '2019', 2020: '2020' }}

    />

  )
};

export default TimeSlider;
