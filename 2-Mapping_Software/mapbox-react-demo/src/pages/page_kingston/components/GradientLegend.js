import React from "react";

const GradientLegend = () => {
  return (
    <div className="flex flex-col items-center justify-center">
       <p className="w-16 font-bold"># of Pedestrians Average per Hour</p>
      <span>1000</span>
      <div className="h-28 w-3 bg-gradient-to-b from-[#900b0a] to-[#74ed86] rounded-lg" />
      <span>0</span>
    </div>
  );
};

export default React.memo(GradientLegend);
