


import React from 'react'


const TimeScaleDropDown = ({ label, value, options, onChange }) => {
    return (
      <label>
        <span className="text-white mr-4">{label}</span>
        <select className="rounded-sm" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };



export default TimeScaleDropDown;