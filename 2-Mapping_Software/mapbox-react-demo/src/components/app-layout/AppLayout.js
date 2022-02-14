import { Layout, Menu, Radio } from "antd";
import { GiWalk } from "react-icons/gi";
import Map from "../map/Map";
import { useState } from "react";
import { MdDirectionsBike } from "react-icons/md";
import { IoIosCar } from "react-icons/io";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const { Header, Content, Sider } = Layout;
const AppLayout = () => {
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
      <Header className="">
        <div></div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Civilians</Menu.Item>
          <Menu.Item key="2">Road Conditions</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={300} className="p-2" theme="light">
          <div className="border-2 rounded-md p-3">
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

            <div className="mt-2">
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

          <div className="border-2 mt-2 rounded-md p-3">
            <img alt="chart" src={require("../../images/pedestrian.png")}></img>
          </div>
        </Sider>
        <Layout>
          <Content className="relative">
            <Map />
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
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
