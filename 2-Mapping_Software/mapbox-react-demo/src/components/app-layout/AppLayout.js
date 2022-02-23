import { Layout, Menu, Radio } from "antd";
import { GiWalk } from "react-icons/gi";
import Map from "../map/Map";
import { useState, useRef } from "react";
import { MdDirectionsBike } from "react-icons/md";
import { IoIosCar } from "react-icons/io";
import BlackBar from "../black-bar/BlackBar";

import "rc-slider/assets/index.css";
import TimeSlider from "../time-slider/TimeSlider";
import PedestrianChart from "../visualizations/PedestrianChart";

const { Header, Content, Sider } = Layout;
const AppLayout = () => {
  const [yearFilter, setYearFilter] = useState(2016);
  const [civFilter, setCivFilter] = useState();
  const [pedestrianFilter, setPedestrianFilter] = useState();

  const handleCivFilterChange = (e) => {
    setCivFilter(e.target.value);
  };

  const handlePedestrianFilterChange = (e) => {
    setPedestrianFilter(e.target.value);
  };

  return (
    <Layout className="h-screen">
      <BlackBar />
      <Header style={{backgroundColor: "#F8F8F8"}}>
        <Menu style={{backgroundColor: "#F8F8F8"}} mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Civilians</Menu.Item>
          <Menu.Item key="2" disabled>Road Conditions</Menu.Item>
          <Menu.Item key="2" disabled>Tree Canopy</Menu.Item>
          <Menu.Item key="2" disabled>Toppled Bins</Menu.Item>
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
            <p>
              Proident ex dolor cupidatat voluptate nulla veniam esse id
              incididunt ut enim in nostrud do. Aliquip velit id elit in
              exercitation tempor dolor nostrud sit reprehenderit commodo tempor
              aute proident. Nulla excepteur cupidatat officia amet labore
              occaecat anim quis et velit aliquip ullamco officia. Aliquip ex
              mollit sit elit culpa Lorem veniam sit minim duis cillum ea
              consequat.
            </p>
          </div>

          <div className="p-2 my-4 border rounded-lg">
            <PedestrianChart/>
          </div>
        </Sider>

        <Layout>
          <Content className="relative">
            <Map time={yearFilter} />

            <div className="px-20 pb-8 box-border absolute bottom-4 w-full">
              <div className="bg-black/70 px-7 pt-7 pb-3 rounded-md">
                <TimeSlider value={yearFilter} onSliderChange={(year)=>{setYearFilter(year)}}/>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
