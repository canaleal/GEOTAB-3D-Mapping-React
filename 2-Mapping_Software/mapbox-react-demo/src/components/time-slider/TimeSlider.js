import Slider from "rc-slider";
import { useState } from "react";

const TimeSlider = ({value, onSliderChange, sliderRef}) => {

  const onSliderChange = (event) =>{
    props.onChange(event.target.value);
  } 
  
  return (
   
        <Slider
          min={2015}
          max={2020}
          defaultValue={value}
          dots={true}
          railStyle={{ background: "#d1d1d1", height: 12 }}
          trackStyle={{
            transition: "0.3s ease background-color",
            height: 12,
            background: "#d1d1d1",
          }}
          onChange={onSliderChange}
          ref={sliderRef}
          handleStyle={{
            height: 20,
            width: 20,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
            border: "none",
          }}
          dotStyle={{
            height: 15,
            width: 2,
            border: 0,
            marginBottom: 11,
            backgroundColor: "#d1d1d1",
            transform: "translateX(0.2rem)",
          }}
          className="-translate-y-1"
        />
  );
};

export default TimeSlider;
