import { Layout, Menu, Radio } from "antd";
import { GiWalk } from "react-icons/gi";
import Map from "../map/Map";
import { useState, useRef } from "react";
import { MdDirectionsBike } from "react-icons/md";
import { IoIosCar } from "react-icons/io";
import Slider from "rc-slider";
import BlackBar from "../black-bar/BlackBar";


import "rc-slider/assets/index.css";

const { Header, Content, Sider } = Layout;
const AppLayout = () => {
 
  const [yearFilter, setYearFilter] = useState(2016);
  const [civFilter, setCivFilter] = useState();
  const [pedestrianFilter, setPedestrianFilter] = useState();


  const handleCivFilterChange = (e) => {
    console.log(e)
    setCivFilter(e.target.value);
  };

  const handlePedestrianFilterChange = (e) => {
    setPedestrianFilter(e.target.value);
  };

  return (
    <Layout className="h-screen">

      <BlackBar/>

      {/* <div className="flex flex-row py-2 px-4 bg-white-500">

        <div className="w-4/12 ">
          <span className="txt-xl">A.I.M</span>
        </div>

        <div className="w-8/12">
          2
        </div>
      </div> */}


      <Header >  
          <Menu theme="dark"  mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">Civilians</Menu.Item>
            <Menu.Item key="2">Road Conditions</Menu.Item>
          </Menu>
        </Header>
      


      <Layout>
        <Sider width={400} className="px-4 py-4" theme="light">
          <div className="border-2 rounded-md ">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={civFilter}
              onChange={handleCivFilterChange}
              style={{ display: "flex" }}
            >
              <Radio.Button value="Pedestrian" className="grow text-center">
                <GiWalk className="inline" />
              </Radio.Button>
              <Radio.Button value="Bike" className="grow text-center">
                <MdDirectionsBike className="inline" />
              </Radio.Button>
              <Radio.Button value="Traffic" className="grow text-center">
                <IoIosCar className="inline" />
              </Radio.Button>
              <Radio.Button value="All" className="grow text-center">
                All
              </Radio.Button>
            </Radio.Group>

            <div className="py-2">
              {civFilter === "Pedestrian" && (
                <Radio.Group
                  defaultValue={"All"}
                  buttonStyle="solid"
                  value={pedestrianFilter}
                  onChange={handlePedestrianFilterChange}
                  style={{ display: "flex" }}
                >
                  <Radio.Button value="Crossing" className="grow text-center">
                    Crossing
                  </Radio.Button>
                  <Radio.Button value="Jaywalking" className="grow text-center">
                    Jaywalking
                  </Radio.Button>
                  <Radio.Button value="All" className="grow text-center">
                    All
                  </Radio.Button>
                </Radio.Group>
              )}
            </div>
          </div>


          <div className="p-2 my-4 border rounded-lg border-red-500">
            <p>Proident ex dolor cupidatat voluptate nulla veniam esse id incididunt ut enim in nostrud do. Aliquip velit id elit in exercitation tempor dolor nostrud sit reprehenderit commodo tempor aute proident. Nulla excepteur cupidatat officia amet labore occaecat anim quis et velit aliquip ullamco officia. Aliquip ex mollit sit elit culpa Lorem veniam sit minim duis cillum ea consequat.</p>
          </div>


          <div className="p-2 my-4 border rounded-lg">
            <h1>Pedestrians</h1>
          </div>

          
        </Sider>


        
        <Layout>
          <Content className="relative">

            <Map time={yearFilter}/>



            

            <div className="px-20 pb-8 box-border absolute bottom-4 w-full">
              <div className="bg-black/70 px-7 pt-7 pb-3 rounded-md">

              <Slider
                  
                  min={2015}
                  max={2020}
                  dots={true}
                  
                  dotStyle={{
                    height: 15,
                    width: 2,
                    border: 0,
                    marginBottom: 11,
                    backgroundColor: "#d1d1d1",
                    transform: "translateX(0.2rem)"
                  }}
                  onChange={value => console.log(value)}
                 
                />
                {/* <Slider
                  ref={sliderRef}
                  min={2015}
                  max={2020}
                  dots={true}
                  value={yearFilter}
                  onChange={handleYearFilterChange}
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
                /> */}
              </div>
            </div>

          </Content>
        </Layout>

        
      </Layout>

      
    </Layout>
  );
};

export default AppLayout;
