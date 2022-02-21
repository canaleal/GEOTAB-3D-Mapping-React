import Slider from "rc-slider";

const TimeSlider = () => {
    return (

        <div className="px-20 pb-10 box-border absolute bottom-4 w-full">
              <div className="bg-black/70 px-7 pt-7 pb-3 rounded-md">
                <Slider
                  min={0}
                  max={28}
                  dots={true}
                  railStyle={{ background: "#d1d1d1", height: 12 }}
                  trackStyle={{
                    transition: "0.3s ease background-color",
                    height: 12,
                    background: "#d1d1d1"
                  }}
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
                    transform: "translateX(0.2rem)"
                  }}
                  className="-translate-y-1"
                />
              </div>
            </div>
    )
}

export default TimeSlider