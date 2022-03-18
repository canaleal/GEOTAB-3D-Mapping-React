
import Range from "rc-slider";
import React from 'react'


const CountRangeSlider = () => {
  return (
    <Range  min={0}
    max={1000} 
    step={100}x
    dots={true}
    defaultValue={[0, 1000]}

    
    />
  )
}



export default CountRangeSlider;